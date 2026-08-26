import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  InputBase,
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';
import { NAV_ITEMS } from './navItems';

const DrawerSearch = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: Number(theme.shape.borderRadius || 8) * 2,
  backgroundColor: alpha(theme.palette.common.black, 0.04),
  border: '1px solid #E2E8F0',
  width: '100%',
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
    width: '100%',
    fontSize: '0.9rem',
  },
}));

interface AppMobileDrawerProps {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const AppMobileDrawer: React.FC<AppMobileDrawerProps> = ({
  open,
  onClose,
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 290 },
      }}
    >
      <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'primary.main',
              cursor: 'pointer',
            }}
            onClick={() => {
              navigate('/');
              onClose();
            }}
          >
            <Box
              component="img"
              src="/images/logo.png"
              alt="BookLoop Logo"
              referrerPolicy="no-referrer"
              sx={{
                width: 34,
                height: 34,
                mr: 1.5,
                borderRadius: 1.5,
                objectFit: 'contain',
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.3px', color: 'primary.main' }}>
              BookLoop
            </Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="ปิดเมนู" size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Box component="form" onSubmit={onSearchSubmit} sx={{ mb: 3 }}>
          <DrawerSearch>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="ค้นหาชื่อหนังสือ..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              inputProps={{ 'aria-label': 'ค้นหาชื่อหนังสือ' }}
            />
          </DrawerSearch>
        </Box>

        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: 2,
                    bgcolor: isActive ? 'rgba(23, 105, 170, 0.08)' : 'transparent',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(23, 105, 170, 0.12)',
                      '&:hover': { bgcolor: 'rgba(23, 105, 170, 0.18)' },
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? 'secondary.main' : 'text.primary',
                          fontSize: '0.95rem',
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={() => {
              navigate('/sell');
              onClose();
            }}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            ลงขายหนังสือ
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
