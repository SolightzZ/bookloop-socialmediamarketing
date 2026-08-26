import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Container, InputBase, Tooltip } from '@mui/material';
import { Search as SearchIcon, ShoppingCart as CartIcon, FavoriteBorder as WishlistIcon, Menu as MenuIcon } from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';
import { NAV_ITEMS } from './navItems';

const SearchContainer = styled('div')(({ theme }) => ({
   position: 'relative',
   borderRadius: Number(theme.shape.borderRadius || 8) * 2,
   backgroundColor: alpha(theme.palette.common.black, 0.04),
   '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.07),
   },
   marginRight: theme.spacing(2),
   marginLeft: 0,
   width: '100%',
   [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
   },
   flexGrow: 1,
   maxWidth: 420,
   border: '1px solid #E2E8F0',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
   padding: theme.spacing(0, 2),
   height: '100%',
   position: 'absolute',
   pointerEvents: 'none',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
   color: 'inherit',
   width: '100%',
   '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      fontSize: '0.9rem',
   },
}));

interface AppNavbarProps {
   cartCount: number;
   wishlistCount: number;
   searchQuery: string;
   onSearchQueryChange: (query: string) => void;
   onSearchSubmit: (e: React.FormEvent) => void;
   onOpenMobileMenu: () => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({ cartCount, wishlistCount, searchQuery, onSearchQueryChange, onSearchSubmit, onOpenMobileMenu }) => {
   const navigate = useNavigate();
   const location = useLocation();

   const handleNavigation = (path: string) => {
      navigate(path);
      if (location.pathname === path) {
         window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
   };

   return (
      <AppBar
         position="sticky"
         color="inherit"
         elevation={0}
         sx={{
            borderBottom: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
         }}>
         <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3, md: 4 }, width: '100%' }}>
            <Toolbar disableGutters sx={{ minHeight: { xs: 60, sm: 64, md: 74 }, gap: { xs: 0.5, md: 2, lg: 3 }, width: '100%', minWidth: 0 }}>
               {/* Mobile Menu Icon */}
               <IconButton
                  color="inherit"
                  edge="start"
                  onClick={onOpenMobileMenu}
                  aria-label="เปิดเมนูนำทาง"
                  sx={{
                     mr: 0,
                     display: { md: 'none' },
                     width: { xs: 40, sm: 44 },
                     height: { xs: 40, sm: 44 },
                     p: { xs: 0.75, sm: 1 },
                     flexShrink: 0,
                  }}>
                  <MenuIcon />
               </IconButton>

               {/* Logo */}
               <Box
                  sx={{
                     display: 'flex',
                     alignItems: 'center',
                     cursor: 'pointer',
                     color: 'primary.main',
                     userSelect: 'none',
                     mr: { xs: 0.5, md: 2, lg: 3 },
                     minWidth: 0,
                     flexGrow: { xs: 1, md: 0 },
                     flexShrink: 0,
                  }}
                  onClick={() => navigate('/')}>
                  <Box
                     component="img"
                     src="/images/logo.png"
                     alt="BookLoop Logo"
                     referrerPolicy="no-referrer"
                     sx={{
                        width: { xs: 30, md: 38 },
                        height: { xs: 30, md: 38 },
                        mr: { xs: 0.75, md: 1.25 },
                        borderRadius: 1.75,
                        objectFit: 'contain',
                     }}
                  />
                  <Typography
                     variant="h5"
                     sx={{
                        fontWeight: 800,
                        letterSpacing: '-0.5px',
                        color: 'primary.main',
                        fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.45rem' },
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                     }}
                     noWrap>
                     BookLoop
                  </Typography>
               </Box>

               {/* Desktop Navigation */}
               <Box
                  sx={{
                     display: { xs: 'none', md: 'flex' },
                     alignItems: 'center',
                     gap: { md: 0.75, lg: 1.5 },
                     flexShrink: 0,
                  }}>
                  {NAV_ITEMS.map((item) => {
                     const isActive = location.pathname === item.path;
                     return (
                        <Button
                           key={item.label}
                           color="inherit"
                           onClick={() => handleNavigation(item.path)}
                           sx={{
                              fontWeight: isActive ? 700 : 500,
                              color: isActive ? 'primary.main' : 'text.secondary',
                              borderRadius: 2,
                              px: { md: 1.25, lg: 1.75 },
                              py: 0.85,
                              fontSize: { md: '0.875rem', lg: '0.925rem' },
                              whiteSpace: 'nowrap',
                              bgcolor: isActive ? 'rgba(16, 42, 67, 0.06)' : 'transparent',
                              transition: 'all 0.15s ease-in-out',
                              '&:hover': {
                                 bgcolor: isActive ? 'rgba(16, 42, 67, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                                 color: 'primary.main',
                              },
                           }}>
                           {item.label}
                        </Button>
                     );
                  })}
               </Box>

               {/* Desktop Search Bar */}
               <Box
                  component="form"
                  onSubmit={onSearchSubmit}
                  sx={{
                     display: { xs: 'none', sm: 'block' },
                     ml: 'auto',
                     flexGrow: 0,
                     width: { sm: 160, md: 180, lg: 240, xl: 280 },
                     maxWidth: 280,
                  }}>
                  <SearchContainer sx={{ m: 0, width: '100%' }}>
                     <SearchIconWrapper>
                        <SearchIcon sx={{ fontSize: 20 }} />
                     </SearchIconWrapper>
                     <StyledInputBase placeholder="ค้นหาชื่อหนังสือ..." value={searchQuery} onChange={(e) => onSearchQueryChange(e.target.value)} inputProps={{ 'aria-label': 'ค้นหาชื่อหนังสือ' }} />
                  </SearchContainer>
               </Box>

               {/* Action Icons */}
               <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.25, sm: 1 }, flexShrink: 0, minWidth: 0 }}>
                  <Tooltip title="รายการโปรดของคุณ">
                     <IconButton
                        color="inherit"
                        onClick={() => navigate('/books?favorite=true')}
                        aria-label="รายการโปรดของคุณ"
                        sx={{
                           width: { xs: 40, sm: 44 },
                           height: { xs: 40, sm: 44 },
                           p: { xs: 0.75, sm: 1.1 },
                           flexShrink: 0,
                           '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                        }}>
                        <Badge badgeContent={wishlistCount} color="error">
                           <WishlistIcon sx={{ fontSize: { xs: 21, sm: 22 } }} />
                        </Badge>
                     </IconButton>
                  </Tooltip>
                  <Tooltip title="ตะกร้าสินค้า">
                     <IconButton
                        color="inherit"
                        onClick={() => navigate('/cart')}
                        aria-label="ตะกร้าสินค้า"
                        sx={{
                           width: { xs: 40, sm: 44 },
                           height: { xs: 40, sm: 44 },
                           p: { xs: 0.75, sm: 1.1 },
                           flexShrink: 0,
                           '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                        }}>
                        <Badge badgeContent={cartCount} color="error">
                           <CartIcon sx={{ fontSize: { xs: 21, sm: 22 } }} />
                        </Badge>
                     </IconButton>
                  </Tooltip>
               </Box>
            </Toolbar>
         </Container>
      </AppBar>
   );
};
