import React from 'react';
import { Box, Button, InputBase, IconButton } from '@mui/material';
import { Search as SearchIcon, Close as ClearIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../../utils/analytics';

export type SearchBarVariant = 'hero' | 'header' | 'page';

export interface SearchBarProps {
  variant?: SearchBarVariant;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  placeholder?: string;
  fullWidth?: boolean;
  autoFocus?: boolean;
  className?: string;
  onClear?: () => void;
  id?: string;
}

/**
 * Reusable SearchBar component supporting:
 * - 'hero': Large pill search bar on landing page with prominent submit button
 * - 'header': Compact navbar search bar with subtle pill border
 * - 'page': Standard search input used on catalog and search results pages
 *
 * All variants share the exact same search logic, routing to /books?q=...,
 * and analytics event dispatching.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  variant = 'header',
  value,
  onChange,
  onSubmit,
  placeholder,
  fullWidth = false,
  autoFocus = false,
  className = '',
  onClear,
  id,
}) => {
  const navigate = useNavigate();

  const handleDefaultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      trackEvent('search_book', { query: value.trim(), source: variant });
      navigate(`/books?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleSubmit = onSubmit || handleDefaultSubmit;

  // ----------------------------------------------------
  // VARIANT: HERO (Landing Page Prominent Pill Search)
  // ----------------------------------------------------
  if (variant === 'hero') {
    return (
      <Box
        component="form"
        role="search"
        onSubmit={handleSubmit}
        className={className}
        sx={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 50,
          p: { xs: '4px 6px 4px 14px', sm: '6px 8px 6px 18px' },
          border: '1.5px solid #D9E2EC',
          boxShadow: '0 4px 14px -2px rgba(15, 45, 74, 0.06)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            borderColor: '#CBD5E1',
            boxShadow: '0 6px 18px -2px rgba(15, 45, 74, 0.09)',
          },
          '&:focus-within': {
            borderColor: '#1976D2',
            boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
          },
          width: '100%',
          maxWidth: 540,
        }}
      >
        <SearchIcon
          sx={{
            color: '#627D98',
            mr: 1.5,
            flexShrink: 0,
            fontSize: { xs: 20, sm: 22 },
          }}
        />
        <InputBase
          id={id || 'hero-search-input'}
          fullWidth
          autoFocus={autoFocus}
          placeholder={placeholder || 'ค้นหาชื่อหนังสือ, ผู้เขียน, หรือ ISBN...'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputProps={{
            'aria-label': placeholder || 'ค้นหาชื่อหนังสือ, ผู้เขียน, หรือ ISBN',
          }}
          sx={{
            color: '#0F2D4A',
            fontSize: { xs: '0.875rem', sm: '0.95rem' },
            '& .MuiInputBase-input::placeholder': {
              color: '#627D98',
              opacity: 0.85,
            },
          }}
        />
        {value && onClear && (
          <IconButton
            size="small"
            aria-label="ล้างคำค้นหา"
            onClick={onClear}
            sx={{ mr: 1, color: '#94A3B8' }}
          >
            <ClearIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
        <Button
          type="submit"
          variant="contained"
          aria-label="ค้นหาหนังสือ"
          sx={{
            bgcolor: '#0F2D4A',
            color: '#FFFFFF',
            borderRadius: 50,
            px: { xs: 2.25, sm: 3.5 },
            py: { xs: 0.85, sm: 1 },
            fontWeight: 700,
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            flexShrink: 0,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#1976D2',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          ค้นหา
        </Button>
      </Box>
    );
  }

  // ----------------------------------------------------
  // VARIANT: HEADER (Navbar Compact Pill Search)
  // ----------------------------------------------------
  if (variant === 'header') {
    return (
      <Box
        component="form"
        role="search"
        onSubmit={handleSubmit}
        className={className}
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 50,
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          transition: 'all 0.2s ease',
          width: '100%',
          maxWidth: { xs: '100%', md: 220, lg: 280 },
          px: 1.5,
          py: 0.4,
          '&:hover': {
            backgroundColor: '#FFFFFF',
            borderColor: '#CBD5E1',
          },
          '&:focus-within': {
            backgroundColor: '#FFFFFF',
            borderColor: '#1976D2',
            boxShadow: '0 0 0 2.5px rgba(25, 118, 210, 0.12)',
          },
        }}
      >
        <SearchIcon
          sx={{
            color: '#627D98',
            fontSize: 18,
            mr: 1,
            flexShrink: 0,
          }}
        />
        <InputBase
          id={id || 'header-search-input'}
          fullWidth
          placeholder={placeholder || 'ค้นหาชื่อหนังสือ, ผู้เขียน...'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputProps={{
            'aria-label': placeholder || 'ค้นหาหนังสือหรือผู้เขียน',
          }}
          sx={{
            color: '#0F2D4A',
            fontSize: '0.85rem',
            '& .MuiInputBase-input': {
              py: 0.5,
              '&::placeholder': {
                color: '#627D98',
                opacity: 0.85,
              },
            },
          }}
        />
        {value && onClear && (
          <IconButton
            size="small"
            aria-label="ล้างคำค้นหา"
            onClick={onClear}
            sx={{ p: 0.25, color: '#94A3B8' }}
          >
            <ClearIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>
    );
  }

  // ----------------------------------------------------
  // VARIANT: PAGE (Standard Search Bar on Catalog Pages)
  // ----------------------------------------------------
  return (
    <Box
      component="form"
      role="search"
      onSubmit={handleSubmit}
      className={className}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 2.5,
        border: '1.5px solid #E2E8F0',
        px: 2,
        py: 0.75,
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#CBD5E1',
        },
        '&:focus-within': {
          borderColor: '#1976D2',
          boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
        },
      }}
    >
      <SearchIcon sx={{ color: '#627D98', mr: 1.5, fontSize: 20, flexShrink: 0 }} />
      <InputBase
        id={id || 'page-search-input'}
        fullWidth
        autoFocus={autoFocus}
        placeholder={placeholder || 'ค้นหาหนังสือ...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputProps={{
          'aria-label': placeholder || 'ค้นหาหนังสือ',
        }}
        sx={{
          color: '#0F2D4A',
          fontSize: '0.9rem',
          '& .MuiInputBase-input::placeholder': {
            color: '#627D98',
            opacity: 0.85,
          },
        }}
      />
      {value && onClear && (
        <IconButton
          size="small"
          aria-label="ล้างคำค้นหา"
          onClick={onClear}
          sx={{ mr: 1, color: '#94A3B8' }}
        >
          <ClearIcon sx={{ fontSize: 18 }} />
        </IconButton>
      )}
      <Button
        type="submit"
        variant="contained"
        size="small"
        sx={{
          bgcolor: '#1976D2',
          color: '#FFFFFF',
          borderRadius: 2,
          px: 2.5,
          fontWeight: 700,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': { bgcolor: '#0F2D4A' },
        }}
      >
        ค้นหา
      </Button>
    </Box>
  );
};
