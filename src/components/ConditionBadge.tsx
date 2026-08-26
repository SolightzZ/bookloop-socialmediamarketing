import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface ConditionBadgeProps {
  condition: 'Excellent' | 'Very Good' | 'Good' | 'Acceptable';
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined';
}

export const ConditionBadge: React.FC<ConditionBadgeProps> = ({
  condition,
  size = 'small',
  variant = 'outlined',
}) => {
  const getConditionConfig = (): {
    label: string;
    color: ChipProps['color'];
    title: string;
  } => {
    switch (condition) {
      case 'Excellent':
        return {
          label: 'สภาพ: ดีเยี่ยม (95%+)',
          color: 'success',
          title: 'สภาพใกล้เคียงหนังสือใหม่ ไม่มีรอยขีดเขียน',
        };
      case 'Very Good':
        return {
          label: 'สภาพ: ดีมาก (85-94%)',
          color: 'info',
          title: 'มีร่องรอยการใช้งานเล็กน้อย สภาพเรียบร้อย',
        };
      case 'Good':
        return {
          label: 'สภาพ: ปานกลาง (70-84%)',
          color: 'warning',
          title: 'มีร่องรอยการใช้งาน แต่ยังอ่านได้สมบูรณ์',
        };
      case 'Acceptable':
        return {
          label: 'สภาพ: พอใช้ (50-69%)',
          color: 'default',
          title: 'มีร่องรอยการใช้งานชัดเจน/ไฮไลต์ แต่เนื้อหาครบ',
        };
      default:
        return {
          label: condition,
          color: 'default',
          title: 'สภาพหนังสือ',
        };
    }
  };

  const config = getConditionConfig();

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      variant={variant}
      title={config.title}
      sx={{
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.85rem',
      }}
    />
  );
};
