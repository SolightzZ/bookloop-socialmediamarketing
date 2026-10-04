import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Drawer,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputBase,
} from '@mui/material';
import {
  Search as SearchIcon,
  X as CloseIcon,
  SlidersHorizontal,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';
import { books, Book } from '../data/books';
import { listingService } from '../services/listingService';
import { BookCard } from '../components/BookCard';
import { useWishlist } from '../hooks/useWishlist';
import { trackEvent } from '../utils/analytics';
import { BookFilterSidebar } from '../components/books/BookFilterSidebar';
import { BookActiveFilters } from '../components/books/BookActiveFilters';
import { BookPaginationControls } from '../components/books/BookPaginationControls';
import { BreadcrumbsNav } from '../components/common/BreadcrumbsNav';

const ITEMS_PER_PAGE = 12;

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
  const [activeListings, setActiveListings] = useState<Book[]>([]);

  useEffect(() => {
    let isMounted = true;
    listingService.getActiveListings().then((items) => {
      if (isMounted && items.length > 0) {
        setActiveListings(items);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setPriceRange(2000);
    setSearchParams({});
  };

  const filteredBooks = useMemo(() => {
    let result = [...activeListings, ...books];

    if (onlyFavorites) {
      result = result.filter((b) => isInWishlist(b.id));
    }

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.isbn && b.isbn.toLowerCase().includes(q)) ||
          (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)))
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
  }, [query, category, condition, maxPriceParam, sort, onlyFavorites, wishlist, activeListings]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const validPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const paginatedBooks = useMemo(() => {
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
    return filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBooks, validPage]);

  const activeFiltersCount = [
    query ? 1 : 0,
    category ? 1 : 0,
    condition ? 1 : 0,
    maxPriceParam ? 1 : 0,
    onlyFavorites ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <Box sx={{ bgcolor: '#F7F9FC', minHeight: '100vh', pb: { xs: 6, sm: 8 } }}>
      <Container
        maxWidth="lg"
        sx={{
          maxWidth: '1240px !important',
          px: { xs: 2, sm: 2.5, md: 3 },
          pt: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        {/* 1. Breadcrumbs (Small 12-13px, muted, not in a card) */}
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
          sx={{ mb: 1.5 }}
        />

        {/* 2. Page Title & Supporting Text (Clean, no giant card) */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              color: '#0F2F52',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              lineHeight: 1.25,
              mb: 0.5,
              letterSpacing: '-0.02em',
            }}
          >
            {onlyFavorites ? 'หนังสือในรายการโปรด' : 'ค้นหาหนังสือ'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#64748B',
              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
            }}
          >
            ค้นพบหนังสือมือสองที่ใช่สำหรับคุณ
          </Typography>
        </Box>

        {/* 3. Search Bar (Primary interaction, 44-48px height, rounded 10-12px) */}
        <Box
          component="form"
          role="search"
          onSubmit={handleSearchSubmit}
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#FFFFFF',
            border: '1px solid #DCE6F0',
            borderRadius: '12px',
            p: 0.5,
            mb: 3,
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            '&:focus-within': {
              borderColor: '#1976D2',
              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              pl: 1.5,
              color: '#64748B',
            }}
          >
            <SearchIcon size={20} />
          </Box>

          <InputBase
            fullWidth
            placeholder="ค้นหาชื่อหนังสือ ผู้เขียน หรือ ISBN..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            inputProps={{
              'aria-label': 'ค้นหาชื่อหนังสือ ผู้เขียน หรือ ISBN',
            }}
            sx={{
              px: 1.5,
              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              color: '#0F2F52',
            }}
          />

          {searchInput && (
            <IconButton
              size="small"
              aria-label="ล้างคำค้นหา"
              onClick={() => {
                setSearchInput('');
                searchParams.delete('q');
                searchParams.delete('page');
                setSearchParams(searchParams);
              }}
              sx={{ p: 0.75, color: '#94A3B8', mr: 0.5 }}
            >
              <CloseIcon size={16} />
            </IconButton>
          )}

          <Button
            type="submit"
            variant="contained"
            sx={{
              height: 40,
              px: { xs: 2, sm: 3 },
              borderRadius: '8px',
              bgcolor: '#1976D2',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.875rem',
              textTransform: 'none',
              boxShadow: 'none',
              flexShrink: 0,
              '&:hover': {
                bgcolor: '#1565C0',
                boxShadow: 'none',
              },
            }}
          >
            ค้นหา
          </Button>
        </Box>

        {/* 4. Active Filter Chips (if any) */}
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

        {/* 5. Result Toolbar (Clean single row: พบ X เล่ม | เรียงตาม: [ แนะนำ v ]) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2.5,
            gap: 1.5,
          }}
        >
          {/* Result Count */}
          <Typography
            sx={{
              fontWeight: 700,
              color: '#0F2F52',
              fontSize: { xs: '0.9rem', sm: '0.95rem' },
            }}
          >
            พบ {filteredBooks.length} เล่ม
          </Typography>

          {/* Right Controls: Sort & Mobile Filter Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Mobile Filter Button */}
            <Button
              variant="outlined"
              size="small"
              onClick={() => setMobileFilterOpen(true)}
              startIcon={<SlidersHorizontal size={15} />}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                height: 36,
                px: 1.5,
                borderRadius: '8px',
                borderColor: activeFiltersCount > 0 ? '#1976D2' : '#DCE6F0',
                bgcolor: activeFiltersCount > 0 ? '#F0F7FF' : '#FFFFFF',
                color: activeFiltersCount > 0 ? '#1976D2' : '#0F2F52',
                fontWeight: 600,
                fontSize: '0.8125rem',
                textTransform: 'none',
              }}
            >
              ตัวกรอง {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
            </Button>

            {/* Sort Select */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#64748B',
                  fontSize: '0.8125rem',
                  display: { xs: 'none', sm: 'inline' },
                  whiteSpace: 'nowrap',
                }}
              >
                เรียงตาม:
              </Typography>

              <FormControl size="small">
                <Select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  aria-label="เรียงลำดับหนังสือ"
                  sx={{
                    height: 36,
                    borderRadius: '8px',
                    bgcolor: '#FFFFFF',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: '#0F2F52',
                    minWidth: { xs: 120, sm: 140 },
                    '& fieldset': {
                      borderColor: '#DCE6F0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#94A3B8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976D2',
                    },
                  }}
                >
                  <MenuItem value="recommended">หนังสือแนะนำ</MenuItem>
                  <MenuItem value="price_asc">ราคา: ต่ำไปสูง</MenuItem>
                  <MenuItem value="price_desc">ราคา: สูงไปต่ำ</MenuItem>
                  <MenuItem value="rating">คะแนนรีวิวสูงสุด</MenuItem>
                  <MenuItem value="title_asc">ชื่อหนังสือ (ก-ฮ)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        {/* 6. Main Layout: Lightweight Sidebar (Desktop) + Book Grid */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: { xs: 0, md: 3 },
          }}
        >
          {/* Desktop Filter Sidebar (224px width, clean white surface, sticky) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              width: 224,
              flexShrink: 0,
              position: 'sticky',
              top: 84,
            }}
          >
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E5EAF0',
                p: 2.25,
                boxShadow: '0 1px 3px rgba(15, 47, 82, 0.02)',
              }}
            >
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
            </Box>
          </Box>

          {/* Book Grid Area */}
          <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            {filteredBooks.length === 0 ? (
              /* Clean Minimal Empty State */
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E5EAF0',
                  py: { xs: 6, sm: 8 },
                  px: 3,
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    bgcolor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    color: '#64748B',
                  }}
                >
                  <BookOpen size={24} />
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: '#0F2F52', mb: 0.5 }}
                >
                  ไม่พบหนังสือ
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#64748B', mb: 2.5, maxWidth: 360, mx: 'auto' }}
                >
                  ลองค้นหาด้วยคำอื่น หรือปรับตัวกรอง
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={clearAllFilters}
                  sx={{
                    bgcolor: '#1976D2',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                    py: 0.75,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#1565C0',
                      boxShadow: 'none',
                    },
                  }}
                >
                  ล้างตัวกรอง
                </Button>
              </Box>
            ) : (
              <>
                {/* Responsive CSS Grid (4 cols on 1280px+, 3 cols on 1024px, 2 cols on mobile/tablet) */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(2, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(4, 1fr)',
                    },
                    gap: { xs: 1.75, sm: 2, md: 2.25 },
                    alignItems: 'stretch',
                  }}
                >
                  {paginatedBooks.map((book, index) => (
                    <Box key={book.id} sx={{ height: '100%' }}>
                      <BookCard book={book} priority={index < 4} />
                    </Box>
                  ))}
                </Box>

                {/* Compact Centered Pagination */}
                <BookPaginationControls
                  totalPages={totalPages}
                  currentPage={validPage}
                  onPageChange={handlePageChange}
                />
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
            sx: {
              width: '85%',
              maxWidth: 320,
              p: 2.5,
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            pb: 1.5,
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F2F52' }}>
            ตัวกรอง
          </Typography>
          <IconButton
            size="small"
            onClick={() => setMobileFilterOpen(false)}
            aria-label="ปิดตัวกรอง"
            sx={{ color: '#64748B' }}
          >
            <CloseIcon size={18} />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5 }}>
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
        </Box>

        <Box sx={{ pt: 2, borderTop: '1px solid #E2E8F0', mt: 'auto' }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setMobileFilterOpen(false)}
            sx={{
              bgcolor: '#1976D2',
              borderRadius: '8px',
              fontWeight: 700,
              textTransform: 'none',
              py: 1,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#1565C0',
                boxShadow: 'none',
              },
            }}
          >
            ดูผลลัพธ์ ({filteredBooks.length} เล่ม)
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
