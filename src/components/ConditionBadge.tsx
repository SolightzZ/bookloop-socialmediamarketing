import React from 'react';
import { Chip, ChipProps } from '@mui/material';

export type BookCondition = 'Excellent' | 'Very Good' | 'Good' | 'Acceptable';

export interface ConditionMeta {
  value: BookCondition;
  /** Buyer-soft label: filters, cards, chips, seller form. */
  short: string;
  /** Inspector term used on detail surfaces. */
  detail: string;
  /** Percentage band shown beside the term where the choice is made. */
  band: string;
  bg: string;
  color: string;
  border: string;
  /** What the grade means (HelpPage faq-9 truth). */
  hint: string;
}

/**
 * CONDITION_META — the single source of truth for condition language.
 * Buyer-soft `short` labels pair with inspector `detail + band` so the
 * same grade reads identically on cards, filters, strips, and badges.
 * Short labels follow the documented 4-grade standard (HelpPage faq-9).
 */
export const CONDITION_ORDER: BookCondition[] = ['Excellent', 'Very Good', 'Good', 'Acceptable'];

export const CONDITION_META: Record<BookCondition, ConditionMeta> = {
  Excellent: {
    value: 'Excellent',
    short: 'เหมือนใหม่',
    detail: 'ดีเยี่ยม',
    band: '95%+',
    bg: '#DCFCE7',
    color: '#15803D',
    border: 'rgba(21, 128, 61, 0.25)',
    hint: 'ไม่มีรอยยับ ไม่มีรอยขีดเขียน สันคม กระดาษขาวสะอาด',
  },
  'Very Good': {
    value: 'Very Good',
    short: 'ดีมาก',
    detail: 'ดีมาก',
    band: '85–94%',
    bg: '#E0F2FE',
    color: '#0369A1',
    border: 'rgba(3, 105, 161, 0.25)',
    hint: 'มีรอยเปิดอ่านเบาบาง ไม่มีรอยขีดเขียน สภาพสมบูรณ์',
  },
  Good: {
    value: 'Good',
    short: 'ปานกลาง',
    detail: 'ปานกลาง',
    band: '70–84%',
    bg: '#FEF3C7',
    color: '#B45309',
    border: 'rgba(180, 83, 9, 0.25)',
    hint: 'อาจมีจุดเหลืองตามกาลเวลาหรือรอยพับมุมเล็กน้อย แต่เนื้อหาครบถ้วนแข็งแรง',
  },
  Acceptable: {
    value: 'Acceptable',
    short: 'พอใช้',
    detail: 'พอใช้',
    band: '50–69%',
    bg: '#FFEDD5',
    color: '#C2410C',
    border: 'rgba(194, 65, 12, 0.25)',
    hint: 'มีร่องรอยการใช้งานชัดเจน แต่เปิดอ่านได้ครบทุกหน้า',
  },
};

const FALLBACK_META: ConditionMeta = {
  value: 'Acceptable',
  short: '',
  detail: '',
  band: '',
  bg: '#F1F5F9',
  color: '#475569',
  border: '#E2E8F0',
  hint: 'สภาพหนังสือ',
};

export function getConditionMeta(condition: string): ConditionMeta {
  return (CONDITION_META as Record<string, ConditionMeta>)[condition] ?? { ...FALLBACK_META, short: condition, detail: condition };
}

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
  const meta = getConditionMeta(condition);

  const getColor = (): ChipProps['color'] => {
    switch (condition) {
      case 'Excellent':
        return 'success';
      case 'Very Good':
        return 'info';
      case 'Good':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={`สภาพ: ${meta.short}`}
      color={getColor()}
      size={size}
      variant={variant}
      title={`${meta.detail} (${meta.band}) — ${meta.hint}`}
      sx={{
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.85rem',
      }}
    />
  );
};
