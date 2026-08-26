import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Container, Typography, Grid, Button, Drawer, IconButton, FormControl, InputLabel, Select, MenuItem, TextField, Paper } from '@mui/material';
import { FilterList as FilterIcon, Search as SearchIcon, Close as CloseIcon, MenuBook as BookIcon } from '@mui/icons-material';
import { books } from '../data/books';
import { BookCard } from '../components/BookCard';
import { useWishlist } from '../hooks/useWishlist';
import { trackEvent } from '../utils/analytics';
import { BookFilterSidebar } from '../components/books/BookFilterSidebar';
import { BookActiveFilters } from '../components/books/BookActiveFilters';
import { BookPaginationControls } from '../components/books/BookPaginationControls';

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
            {/* Header and Filter trigger for mobile */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: { xs: 1.5, sm: 2 }, mb: { xs: 3, md: 4 } }}>
               <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '1.6rem', sm: '2.125rem' }, lineHeight: 1.25 }}>
                     {onlyFavorites ? 'หนังสือในรายการโปรด' : 'ค้นหาและเลือกซื้อหนังสือ'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                     พบหนังสือทั้งหมด {filteredBooks.length} เล่ม
                  </Typography>
               </Box>

               <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                  <Button startIcon={<FilterIcon />} variant="outlined" onClick={() => setMobileFilterOpen(true)} color="primary">
                     ตัวกรอง ({activeFiltersCount})
                  </Button>
               </Box>
            </Box>

            <Grid container spacing={{ xs: 2.5, md: 4 }}>
               {/* Desktop Filter Sidebar */}
               <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Paper sx={{ p: 3, borderRadius: 2.5, border: '1px solid #D9E2EC', position: 'sticky', top: 90 }}>
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
               </Grid>

               {/* Book Grid and Controls */}
               <Grid size={{ xs: 12, md: 9 }}>
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
                        onSubmit={handleSearchSubmit}
                        sx={{
                           display: 'flex',
                           flexGrow: 1,
                           width: { xs: '100%', sm: 'auto' },
                           minWidth: 0,
                           maxWidth: { xs: '100%', sm: 400 },
                        }}>
                        <TextField
                           placeholder="พิมพ์ชื่อหนังสือ, ผู้เขียน, หรือ ISBN..."
                           size="small"
                           fullWidth
                           value={searchInput}
                           onChange={(e) => setSearchInput(e.target.value)}
                           slotProps={{
                              input: {
                                 startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
                              },
                           }}
                           sx={{ bgcolor: '#FFFFFF', borderRadius: 1, minWidth: 0, flex: 1 }}
                        />
                        <Button type="submit" variant="contained" sx={{ ml: 1, px: { xs: 1.75, sm: 2.5 }, flexShrink: 0 }}>
                           ค้นหา
                        </Button>
                     </Box>

                     <FormControl size="small" sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 160 }, bgcolor: '#FFFFFF' }}>
                        <InputLabel>เรียงลำดับ</InputLabel>
                        <Select value={sort} label="เรียงลำดับ" onChange={(e) => handleSortChange(e.target.value)}>
                           <MenuItem value="recommended">หนังสือแนะนำ</MenuItem>
                           <MenuItem value="price_asc">ราคา: ต่ำไปสูง</MenuItem>
                           <MenuItem value="price_desc">ราคา: สูงไปต่ำ</MenuItem>
                           <MenuItem value="rating">คะแนนรีวิวสูงสุด</MenuItem>
                           <MenuItem value="title_asc">ชื่อหนังสือ (ก-ฮ)</MenuItem>
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
                     <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px solid #D9E2EC' }}>
                        <BookIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 1 }}>
                           ไม่พบหนังสือที่ตรงกับเงื่อนไขการค้นหา
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                           ลองปรับเปลี่ยนคำค้นหา หรือล้างตัวกรองทั้งหมดเพื่อดูหนังสือรายการอื่น
                        </Typography>
                        <Button variant="outlined" color="primary" onClick={clearAllFilters}>
                           ล้างตัวกรองทั้งหมด
                        </Button>
                     </Paper>
                  ) : (
                     <>
                        <Grid container spacing={3}>
                           {paginatedBooks.map((book) => (
                              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={book.id}>
                                 <BookCard book={book} />
                              </Grid>
                           ))}
                        </Grid>

                        {/* Pagination Controls */}
                        <BookPaginationControls totalPages={totalPages} currentPage={validPage} totalBooks={filteredBooks.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={handlePageChange} />
                     </>
                  )}
               </Grid>
            </Grid>
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
               <IconButton onClick={() => setMobileFilterOpen(false)}>
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
