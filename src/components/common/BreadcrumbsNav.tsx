import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { NavigateNext as NextIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsNavProps {
  items: BreadcrumbItem[];
  sx?: object;
}

export const BreadcrumbsNav: React.FC<BreadcrumbsNavProps> = ({ items, sx }) => {
  const navigate = useNavigate();

  return (
    <Breadcrumbs
      separator={<NextIcon fontSize="small" sx={{ color: '#94A3B8' }} />}
      sx={{ mb: { xs: 2, sm: 3 }, ...sx }}
    >
      <Link
        underline="hover"
        color="inherit"
        onClick={() => navigate('/')}
        sx={{ cursor: 'pointer', fontSize: '0.85rem', color: '#627D98', '&:hover': { color: '#1976D2' } }}
      >
        หน้าหลัก
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return isLast ? (
          <Typography key={i} color="primary.main" sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
            {item.label}
          </Typography>
        ) : (
          <Link
            key={i}
            underline="hover"
            color="inherit"
            onClick={() => item.path && navigate(item.path)}
            sx={{ cursor: item.path ? 'pointer' : 'default', fontSize: '0.85rem', color: '#627D98', '&:hover': { color: '#1976D2' } }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};
