import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Container, Typography, Grid, Button, Drawer, IconButton, FormControl, InputLabel, Select, MenuItem, TextField, Paper } from '@mui/material';
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  MenuBook as BookIcon,
  TuneRounded,
  ExploreRounded,
  AutoAwesomeRounded,
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  StarRounded,
  SortByAlphaRounded,
  SearchOffRounded,
  RestartAltRounded,
  FavoriteRounded,
  VerifiedRounded,
} from '@mui/icons-material';
import { books } from '../data/books';
import { BookCard } from '../components/BookCard';
import { useWishlist } from '../hooks/useWishlist';
import { trackEvent } from '../utils/analytics';
import { BookFilterSidebar } from '../components/books/BookFilterSidebar';
import { BookActiveFilters } from '../components/books/BookActiveFilters';
import { BookPaginationControls } from '../components/books/BookPaginationControls';
import { BreadcrumbsNav } from '../components/common/BreadcrumbsNav';

const ITEMS_PER_PAGE = 9;

export default function BooksPage() {
   const [searchParams, setSearchParams] = useSearchParams();
   const { wishlist, isInWishlist } = useWishlist();

   const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
   const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

   const query = searchParams.get('q') || '';
   const category = searchParams.get('category') || '';
   const condition = searchParams.get('condition') || '';
   const maxPriceParam = searchParams.get('maxPrice');
   const sort = searchParams.get('sort') || 'recommended';
   const onlyFavorites = searchParams.get('favorite') === 'true';
   const pageParam = parseInt(searchParams.get('page') || '1', 10);
   const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

   const [priceRange, setPriceRange] = useState<number>(maxPriceParam ? Number(maxPriceParam) : 2000);

   useEffect(() => {
      setSearchInput(query);
   }, [query]);

   const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchInput.trim()) {
         searchParams.set('q', searchInput.trim());
         trackEvent('search_book', { query: searchInput.trim() });
      } else {
         searchParams.delete('q');
      }
      searchParams.delete('page');
      setSearchParams(searchParams);
   };

   const handleCategoryChange = (cat: string) => {
      if (cat === 'ทั้งหมด') {
         searchParams.delete('category');
      } else {
         searchParams.set('category', cat);
         trackEvent('view_category', { category: cat });
      }
      searchParams.delete('page');
      setSearchParams(searchParams);
   };

   const handleConditionChange = (cond: string) => {
      if (cond === 'ทั้งหมด') {
         searchParams.delete('condition');
      } else {
         searchParams.set('condition', cond);
      }
      searchParams.delete('page');
      setSearchParams(searchParams);
   };

   const handlePriceChangeCommitted = (_: any, newValue: number | number[]) => {
      const val = newValue as number;
      setPriceRange(val);
      if (val < 2000) {
         searchParams.set('maxPrice', val.toString());
      } else {
         searchParams.delete('maxPrice');
      }
      searchParams.delete('page');
      setSearchParams(searchParams);
   };

   const handleSortChange = (newSort: string) => {
      searchParams.set('sort', newSort);
      searchParams.delete('page');
      setSearchParams(searchParams);
   };

   const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
      if (value === 1) {
         searchParams.delete('page');
      } else {
         searchParams.set('page', value.toString());
      }
      setSearchParams(searchParams);
      // Keep the first result below the sticky mobile navbar after pagination.
      // Scrolling to 120px used to place the card image underneath the AppBar
      // on narrow devices such as Pixel 3 XL.
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const clearAllFilters = () => {
      setSearchInput('');
      setPriceRange(2000);
      setSearchParams({});
   };

   const filteredBooks = useMemo(() => {
      let result = [...books];

      if (onlyFavorites) {
         result = result.filter((b) => isInWishlist(b.id));
      }

      if (query) {
         const q = query.toLowerCase();
         result = result.filter(
            (b) =>
               b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.isbn && b.isbn.toLowerCase().includes(q)) || (b.tags && b.tags.some((t) => t.toLowerCase().includes(q))),
         );
      }

      if (category && category !== 'ทั้งหมด') {
         result = result.filter((b) => b.category === category);
      }

      if (condition && condition !== 'ทั้งหมด') {
         result = result.filter((b) => b.condition === condition);
      }

      if (maxPriceParam) {
         const maxP = Number(maxPriceParam);
         result = result.filter((b) => b.price <= maxP);
      }

      switch (sort) {
         case 'price_asc':
            result.sort((a, b) => a.price - b.price);
            break;
         case 'price_desc':
            result.sort((a, b) => b.price - a.price);
            break;
         case 'rating':
            result.sort((a, b) => b.rating - a.rating);
            break;
         case 'title_asc':
            result.sort((a, b) => a.title.localeCompare(b.title, 'th'));
            break;
         default:
            result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
      }

      return result;
   }, [query, category, condition, maxPriceParam, sort, onlyFavorites, wishlist]);

   const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
   const validPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
   const paginatedBooks = useMemo(() => {
      const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
      return filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
   }, [filteredBooks, validPage]);

   const activeFiltersCount = [query ? 1 : 0, category ? 1 : 0, condition ? 1 : 0, maxPriceParam ? 1 : 0, onlyFavorites ? 1 : 0].reduce((a, b) => a + b, 0);

   return (
      <Box sx={{ py: { xs: 3, sm: 4, md: 6 }, bgcolor: 'background.default', minHeight: '100vh' }}>
         <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
            {/* Breadcrumbs */}
            <BreadcrumbsNav
               items={
                  category
                     ? [{ label: 'ค้นหาหนังสือ', path: '/books' }, { label: category }]
                     : onlyFavorites
                        ? [{ label: 'รายการโปรด' }]
                        : query
                           ? [{ label: 'ค้นหาหนังสือ', path: '/books' }, { label: `"${query}"` }]
                           : [{ label: 'ค้นหาหนังสือ' }]
               }
            />
            {/* Header Banner */}
            <Box
               sx={{
                  p: { xs: 2.5, sm: 3 },
                  borderRadius: 3.5,
                  border: '1.5px solid #E2E8F0',
                  bgcolor: '#FFFFFF',
                  boxShadow: '0 2px 10px rgba(15, 45, 74, 0.03)',
                  mb: { xs: 3, md: 4 },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  flexWrap: 'wrap',
                  gap: 2,
               }}>
               <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                     <Box
                        sx={{
                           display: 'inline-flex',
                           alignItems: 'center',
                           gap: 0.6,
                           px: 1.2,
                           py: 0.35,
                           borderRadius: 9999,
                           bgcolor: '#EAF4FF',
                           color: '#1976D2',
                           fontWeight: 800,
                           fontSize: '0.75rem',
                        }}>
                        {onlyFavorites ? (
                           <FavoriteRounded sx={{ fontSize: 14, color: '#E11D48' }} />
                        ) : (
                           <ExploreRounded sx={{ fontSize: 14 }} />
                        )}
                        {onlyFavorites ? 'WISHLIST' : 'BOOKLOOP CATALOG'}
                     </Box>
                     <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.78rem' }}>
                        พร้อมส่งทุกเล่ม • คัดสภาพจริง
                     </Typography>
                  </Box>

                  <Typography
                     variant="h4"
                     sx={{
                        fontWeight: 900,
                        color: '#0F2D4A',
                        fontSize: { xs: '1.45rem', sm: '1.9rem' },
                        lineHeight: 1.25,
                        letterSpacing: '-0.02em',
                        mb: 0.4,
                     }}>
                     {onlyFavorites ? 'หนังสือในรายการโปรดของคุณ' : 'ค้นหาและเลือกซื้อหนังสือ'}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                     พบหนังสือทั้งหมด <strong>{filteredBooks.length}</strong> เล่ม จากชุมชนนักอ่าน BookLoop
                  </Typography>
               </Box>

               <Box sx={{ display: { xs: 'block', md: 'none' }, width: { xs: '100%', sm: 'auto' } }}>
                  <Button
                     fullWidth
                     startIcon={<TuneRounded />}
                     variant="outlined"
                     onClick={() => setMobileFilterOpen(true)}
                     sx={{
                        borderRadius: 2.5,
                        textTransform: 'none',
                        fontWeight: 700,
                        borderColor: activeFiltersCount > 0 ? '#1976D2' : '#CBD5E1',
                        color: activeFiltersCount > 0 ? '#1976D2' : '#0F2D4A',
                        bgcolor: activeFiltersCount > 0 ? '#F0F7FF' : '#FFFFFF',
                     }}>
                     ตัวกรอง {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
                  </Button>
               </Box>
            </Box>

            <Box
               sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '240px minmax(0, 1fr)' },
                  gap: { xs: 2.5, md: 4 },
                  alignItems: 'start',
               }}>
               {/* Desktop Filter Sidebar */}
               <Box sx={{ display: { xs: 'none', md: 'block' }, width: 240 }}>
                  <Paper sx={{ p: 3, borderRadius: 3, border: '1.5px solid #E2E8F0', position: 'sticky', top: 90 }}>
                     <BookFilterSidebar
                        category={category}
                        condition={condition}
                        priceRange={priceRange}
                        onlyFavorites={onlyFavorites}
                        activeFiltersCount={activeFiltersCount}
                        onCategoryChange={handleCategoryChange}
                        onConditionChange={handleConditionChange}
                        onPriceChange={(val) => setPriceRange(val)}
                        onPriceChangeCommitted={handlePriceChangeCommitted}
                        onClearAll={clearAllFilters}
                        onClearFavorite={() => {
                           searchParams.delete('favorite');
                           searchParams.delete('page');
                           setSearchParams(searchParams);
                        }}
                     />
                  </Paper>
               </Box>

               {/* Book Grid and Controls */}
               <Box sx={{ minWidth: 0, width: '100%' }}>
                  {/* Search Input and Sort Row */}
                  <Box
                     sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: { xs: 1.5, sm: 2 },
                        mb: { xs: 2.5, md: 3 },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                     }}>
                     <Box
                        component="form"
                        role="search"
                        onSubmit={handleSearchSubmit}
                        sx={{
                           display: 'flex',
                           flexGrow: 1,
                           width: { xs: '100%', sm: 'auto' },
                           minWidth: 0,
                           maxWidth: { xs: '100%', sm: 420 },
                        }}>
                        <TextField
                           placeholder="พิมพ์ชื่อหนังสือ, ผู้เขียน, หรือ ISBN..."
                           size="small"
                           fullWidth
                           value={searchInput}
                           onChange={(e) => setSearchInput(e.target.value)}
                           slotProps={{
                              input: {
                                 startAdornment: <SearchIcon sx={{ color: '#1976D2', mr: 1, fontSize: 20 }} />,
                                 endAdornment: searchInput ? (
                                    <IconButton
                                       size="small"
                                       aria-label="ล้างคำค้นหา"
                                       onClick={() => {
                                          setSearchInput('');
                                          searchParams.delete('q');
                                          searchParams.delete('page');
                                          setSearchParams(searchParams);
                                       }}
                                       sx={{ p: 0.5, color: '#94A3B8' }}>
                                       <CloseIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                 ) : undefined,
                                 'aria-label': 'พิมพ์ชื่อหนังสือ, ผู้เขียน, หรือ ISBN',
                              },
                           }}
                           sx={{
                              bgcolor: '#FFFFFF',
                              borderRadius: 2.5,
                              '& .MuiOutlinedInput-root': {
                                 borderRadius: 2.5,
                              },
                              minWidth: 0,
                              flex: 1,
                           }}
                        />
                        <Button
                           type="submit"
                           variant="contained"
                           startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
                           sx={{
                              ml: 1,
                              px: { xs: 1.75, sm: 2.5 },
                              borderRadius: 2.5,
                              fontWeight: 700,
                              textTransform: 'none',
                              bgcolor: '#1976D2',
                              flexShrink: 0,
                              boxShadow: 'none',
                           }}>
                           ค้นหา
                        </Button>
                     </Box>

                     <FormControl size="small" sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 190 }, bgcolor: '#FFFFFF' }}>
                        <InputLabel id="books-sort-label">เรียงลำดับ</InputLabel>
                        <Select
                           labelId="books-sort-label"
                           value={sort}
                           label="เรียงลำดับ"
                           onChange={(e) => handleSortChange(e.target.value)}
                           sx={{ borderRadius: 2.5 }}
                        >
                           <MenuItem value="recommended">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                 <AutoAwesomeRounded sx={{ fontSize: 16, color: '#F59E0B' }} />
                                 <span>หนังสือแนะนำ</span>
                              </Box>
                           </MenuItem>
                           <MenuItem value="price_asc">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                 <ArrowDownwardRounded sx={{ fontSize: 16, color: '#16A34A' }} />
                                 <span>ราคา: ต่ำไปสูง</span>
                              </Box>
                           </MenuItem>
                           <MenuItem value="price_desc">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                 <ArrowUpwardRounded sx={{ fontSize: 16, color: '#2563EB' }} />
                                 <span>ราคา: สูงไปต่ำ</span>
                              </Box>
                           </MenuItem>
                           <MenuItem value="rating">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                 <StarRounded sx={{ fontSize: 16, color: '#F59E0B' }} />
                                 <span>คะแนนรีวิวสูงสุด</span>
                              </Box>
                           </MenuItem>
                           <MenuItem value="title_asc">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                 <SortByAlphaRounded sx={{ fontSize: 16, color: '#6366F1' }} />
                                 <span>ชื่อหนังสือ (ก-ฮ)</span>
                              </Box>
                           </MenuItem>
                        </Select>
                     </FormControl>
                  </Box>

                  {/* Active Filter Chips */}
                  <BookActiveFilters
                     query={query}
                     category={category}
                     condition={condition}
                     maxPriceParam={maxPriceParam}
                     onlyFavorites={onlyFavorites}
                     onClearQuery={() => {
                        searchParams.delete('q');
                        searchParams.delete('page');
                        setSearchInput('');
                        setSearchParams(searchParams);
                     }}
                     onClearCategory={() => {
                        searchParams.delete('category');
                        searchParams.delete('page');
                        setSearchParams(searchParams);
                     }}
                     onClearCondition={() => {
                        searchParams.delete('condition');
                        searchParams.delete('page');
                        setSearchParams(searchParams);
                     }}
                     onClearPrice={() => {
                        searchParams.delete('maxPrice');
                        searchParams.delete('page');
                        setPriceRange(2000);
                        setSearchParams(searchParams);
                     }}
                     onClearFavorite={() => {
                        searchParams.delete('favorite');
                        searchParams.delete('page');
                        setSearchParams(searchParams);
                     }}
                  />

                  {/* Results counter and page indicator */}
                  {filteredBooks.length > 0 && (
                     <Box
                        sx={{
                           display: 'flex',
                           justifyContent: 'space-between',
                           alignItems: { xs: 'flex-start', sm: 'center' },
                           flexDirection: { xs: 'column', sm: 'row' },
                           gap: { xs: 1, sm: 2 },
                           mb: { xs: 2, md: 2.5 },
                           px: 0.5,
                        }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.9rem' }, lineHeight: 1.5 }}>
                           แสดง{' '}
                           <strong>
                              {(validPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(validPage * ITEMS_PER_PAGE, filteredBooks.length)}
                           </strong>{' '}
                           จากทั้งหมด <strong>{filteredBooks.length}</strong> เล่ม (หน้า {validPage}/{totalPages})
                        </Typography>
                        {totalPages > 1 && (
                           <Typography
                              variant="caption"
                              sx={{ color: 'primary.main', fontWeight: 700, bgcolor: 'rgba(23, 105, 170, 0.08)', px: 1.5, py: 0.5, borderRadius: 1.5, alignSelf: { xs: 'flex-start', sm: 'auto' } }}>
                              แสดงหน้าละ 9 เล่ม
                           </Typography>
                        )}
                     </Box>
                  )}

                  {/* Books Grid */}
                  {filteredBooks.length === 0 ? (
                     <Paper
                        elevation={0}
                        sx={{
                           p: { xs: 4, sm: 6 },
                           textAlign: 'center',
                           borderRadius: 3.5,
                           border: '1.5px solid #E2E8F0',
                           bgcolor: '#FFFFFF',
                        }}>
                        <Box
                           sx={{
                              width: 72,
                              height: 72,
                              borderRadius: '50%',
                              bgcolor: '#F1F5F9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mx: 'auto',
                              mb: 2,
                           }}>
                           <SearchOffRounded sx={{ fontSize: 36, color: '#64748B' }} />
                        </Box>
                        <Typography variant="h6" sx={{ color: '#0F2D4A', fontWeight: 800, mb: 0.8, fontSize: '1.15rem' }}>
                           ไม่พบหนังสือที่ตรงกับเงื่อนไขการค้นหา
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748B', mb: 3, maxWidth: 440, mx: 'auto', fontSize: '0.85rem' }}>
                           ลองปรับเปลี่ยนคำค้นหา ขยายช่วงราคา หรือล้างตัวกรองทั้งหมดเพื่อดูหนังสือรายการอื่นในคลัง
                        </Typography>
                        <Button
                           variant="contained"
                           startIcon={<RestartAltRounded />}
                           onClick={clearAllFilters}
                           sx={{
                              borderRadius: 2.5,
                              px: 3,
                              py: 1,
                              fontWeight: 700,
                              textTransform: 'none',
                              bgcolor: '#1976D2',
                              boxShadow: 'none',
                           }}>
                           ล้างตัวกรองทั้งหมด
                        </Button>
                     </Paper>
                  ) : (
                     <>
                        <Box
                           sx={{
                              display: 'grid',
                              gridTemplateColumns: {
                                 xs: 'repeat(auto-fill, minmax(145px, 1fr))',
                                 sm: 'repeat(auto-fill, minmax(175px, 1fr))',
                                 md: 'repeat(auto-fill, minmax(195px, 1fr))',
                                 lg: 'repeat(auto-fill, minmax(215px, 1fr))',
                              },
                              gap: { xs: 2, sm: 2.5, md: 3 },
                              alignItems: 'stretch',
                           }}>
                           {paginatedBooks.map((book, index) => (
                              <Box key={book.id} sx={{ height: '100%' }}>
                                 <BookCard book={book} priority={index < 4} />
                              </Box>
                           ))}
                        </Box>

                        {/* Pagination Controls */}
                        <BookPaginationControls totalPages={totalPages} currentPage={validPage} totalBooks={filteredBooks.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={handlePageChange} />
                     </>
                  )}
               </Box>
            </Box>
         </Container>

         {/* Mobile Filter Drawer */}
         <Drawer
            anchor="right"
            open={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
            slotProps={{
               paper: {
                  sx: { width: '85%', maxWidth: 360, p: 2 },
               },
            }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
               <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ตัวกรองค้นหา
               </Typography>
               <IconButton onClick={() => setMobileFilterOpen(false)} aria-label="ปิดตัวกรอง">
                  <CloseIcon />
               </IconButton>
            </Box>
            <BookFilterSidebar
               category={category}
               condition={condition}
               priceRange={priceRange}
               onlyFavorites={onlyFavorites}
               activeFiltersCount={activeFiltersCount}
               onCategoryChange={(cat) => {
                  handleCategoryChange(cat);
                  setMobileFilterOpen(false);
               }}
               onConditionChange={(cond) => {
                  handleConditionChange(cond);
                  setMobileFilterOpen(false);
               }}
               onPriceChange={(val) => setPriceRange(val)}
               onPriceChangeCommitted={handlePriceChangeCommitted}
               onClearAll={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
               }}
               onClearFavorite={() => {
                  searchParams.delete('favorite');
                  searchParams.delete('page');
                  setSearchParams(searchParams);
                  setMobileFilterOpen(false);
               }}
            />
         </Drawer>
      </Box>
   );
}
