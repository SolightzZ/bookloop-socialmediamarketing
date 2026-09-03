import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Chip,
  FormHelperText,
} from '@mui/material';
import {
  VerifiedRounded,
  CheckCircleRounded,
  RadioButtonUncheckedRounded,
  StarRounded,
  ThumbUpRounded,
  MenuBookRounded,
  ReportProblemOutlined,
  SearchRounded,
} from '@mui/icons-material';
import { SELL_CONDITIONS } from './SellSteps';

interface ConditionSectionProps {
  condition: string;
  defects: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => void;
  onBlur: (field: string) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

const DEFECT_CHIPS = [
  'ไม่มีรอยขีดเขียน',
  'มุมปกยับเล็กน้อย',
  'มีรอยไฮไลต์ 2-3 หน้า',
  'กระดาษเหลืองตามเวลา',
  'ห่อปกพลาสติกเรียบร้อย',
  'สันหนังสือคมกริบ',
];

const conditionIconMap: Record<string, React.ReactElement> = {
  'Excellent': <StarRounded sx={{ fontSize: 20, color: '#16A34A' }} />,
  'Very Good': <CheckCircleRounded sx={{ fontSize: 20, color: '#1D4ED8' }} />,
  'Good': <ThumbUpRounded sx={{ fontSize: 20, color: '#D97706' }} />,
  'Acceptable': <ReportProblemOutlined sx={{ fontSize: 20, color: '#EA580C' }} />,
};

export const ConditionSection: React.FC<ConditionSectionProps> = ({
  condition,
  defects,
  onChange,
  onBlur,
  errors,
  touched,
}) => {
  const handleSelectCondition = (val: string) => {
    onChange({ target: { name: 'condition', value: val } });
    onBlur('condition');
  };

  const handleAppendDefect = (chipText: string) => {
    if (!defects) {
      onChange({ target: { name: 'defects', value: chipText } });
    } else if (!defects.includes(chipText)) {
      onChange({ target: { name: 'defects', value: `${defects}, ${chipText}` } });
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            bgcolor: '#EAF4FF',
            color: '#1976D2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <VerifiedRounded sx={{ fontSize: 18 }} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: 800, color: '#0F2D4A', fontSize: '1.05rem', lineHeight: 1.2 }}
          >
            สภาพหนังสือและตำหนิ
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.78rem' }}>
            เลือกเกณฑ์สภาพตามความเป็นจริง เพื่อความโปร่งใสและสร้างความมั่นใจให้ผู้ซื้อ
          </Typography>
        </Box>
      </Box>

      {/* Interactive Condition Selection Cards */}
      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
        {SELL_CONDITIONS.map((c) => {
          const isSelected = condition === c.value;
          return (
            <Grid key={c.value} size={{ xs: 12, sm: 6 }}>
              <Box
                onClick={() => handleSelectCondition(c.value)}
                sx={{
                  p: 1.8,
                  borderRadius: 3,
                  border: isSelected ? '2px solid #1976D2' : '1.5px solid #E2E8F0',
                  bgcolor: isSelected ? '#F0F7FF' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease-out',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.2,
                  boxShadow: isSelected
                    ? '0 2px 8px rgba(25, 118, 210, 0.12)'
                    : '0 1px 3px rgba(15, 45, 74, 0.03)',
                  '&:hover': {
                    borderColor: isSelected ? '#1976D2' : '#94A3B8',
                    bgcolor: isSelected ? '#F0F7FF' : '#F8FAFC',
                  },
                }}
              >
                <Box sx={{ mt: 0.2 }}>
                  {isSelected ? (
                    <CheckCircleRounded sx={{ fontSize: 20, color: '#1976D2' }} />
                  ) : (
                    <RadioButtonUncheckedRounded sx={{ fontSize: 20, color: '#CBD5E1' }} />
                  )}
                </Box>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.4 }}>
                    <Box
                      sx={{
                        px: 0.8,
                        py: 0.15,
                        borderRadius: 1,
                        bgcolor: c.bg,
                        color: c.color,
                        fontWeight: 800,
                        fontSize: '0.72rem',
                      }}
                    >
                      {c.value}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: isSelected ? 800 : 700, color: '#0F2D4A', fontSize: '0.85rem' }}
                    >
                      {c.label}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.75rem', lineHeight: 1.35 }}>
                    {c.desc}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {touched.condition && errors.condition && (
        <FormHelperText error sx={{ mt: -1.5, mb: 2, fontSize: '0.8rem' }}>
          {errors.condition}
        </FormHelperText>
      )}

      {/* Defects Field with Quick Suggestion Chips */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.8rem' }}>
            ตำหนิที่ควรแจ้ง (คลิกเพื่อเพิ่มด่วนได้ทันที):
          </Typography>
        </Box>

        {/* Quick Suggestion Chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.5 }}>
          {DEFECT_CHIPS.map((chipText) => (
            <Chip
              key={chipText}
              label={chipText}
              size="small"
              onClick={() => handleAppendDefect(chipText)}
              sx={{
                bgcolor: '#F1F5F9',
                color: '#475569',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: '#E2E8F0',
                  color: '#0F2D4A',
                },
              }}
            />
          ))}
        </Box>

        <TextField
          fullWidth
          label="รายละเอียดตำหนิ"
          name="defects"
          value={defects}
          onChange={onChange}
          onBlur={() => onBlur('defects')}
          placeholder="เช่น มุมปกล่างมีรอยยับเล็กน้อย, มีรอยขีดเขียนหน้า 12, ไม่มีหน้าขาด"
          size="small"
          helperText="ระบุตำหนิที่พบเพื่อความโปร่งใสและลดปัญหาข้อพิพาทหลังการซื้อขาย"
        />
      </Box>
    </Box>
  );
};
