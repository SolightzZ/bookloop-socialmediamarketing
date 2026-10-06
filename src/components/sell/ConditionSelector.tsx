import React from 'react';
import { Box, Typography, TextField, FormHelperText } from '@mui/material';
import { Sparkles, CheckCircle2, BookOpen, AlertCircle, Check } from 'lucide-react';

interface ConditionOption {
   value: 'Excellent' | 'Very Good' | 'Good' | 'Acceptable';
   title: string;
   description: string;
   icon: React.ReactNode;
}

const CONDITION_OPTIONS: ConditionOption[] = [
   {
      value: 'Excellent',
      title: 'เหมือนใหม่',
      description: 'แทบไม่มีรอย',
      icon: <Sparkles size={20} color="#1976D2" />,
   },
   {
      value: 'Very Good',
      title: 'สภาพดี',
      description: 'มีร่องรอยเล็กน้อย',
      icon: <CheckCircle2 size={20} color="#1976D2" />,
   },
   {
      value: 'Good',
      title: 'พอใช้',
      description: 'มีร่องรอยใช้งาน',
      icon: <BookOpen size={20} color="#1976D2" />,
   },
   {
      value: 'Acceptable',
      title: 'มีตำหนิ',
      description: 'มีรอยชัดเจน',
      icon: <AlertCircle size={20} color="#1976D2" />,
   },
];

export interface ConditionSelectorProps {
   condition: string;
   defects: string;
   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => void;
   onBlur: (field: string) => void;
   errors: Record<string, string>;
   touched: Record<string, boolean>;
}

const MAX_DEFECTS_LENGTH = 300;

export const ConditionSelector: React.FC<ConditionSelectorProps> = ({ condition, defects, onChange, onBlur, errors, touched }) => {
   const handleSelect = (val: string) => {
      onChange({ target: { name: 'condition', value: val } });
      onBlur('condition');
   };

   const handleDefectsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.target.value.length <= MAX_DEFECTS_LENGTH) {
         onChange(e);
      }
   };

   const currentLength = defects ? defects.length : 0;

   return (
      <Box sx={{ width: '100%' }}>
         {/* Title */}
         <Box sx={{ mb: 2 }}>
            <Typography
               variant="subtitle1"
               component="h2"
               sx={{
                  fontWeight: 700,
                  color: '#0F2F52',
                  fontSize: '1.05rem',
                  lineHeight: 1.3,
               }}>
               สภาพหนังสือ{' '}
               <Box component="span" sx={{ color: '#EF4444' }}>
                  *
               </Box>
            </Typography>
            <Typography
               variant="caption"
               sx={{
                  color: '#64748B',
                  fontSize: '0.825rem',
                  display: 'block',
                  mt: 0.25,
               }}>
               เลือกสภาพหนังสือ
            </Typography>
         </Box>

         {/* 4 Selectable Cards: 4 columns on desktop, 2x2 on mobile */}
         <Box
            role="radiogroup"
            aria-label="เลือกสภาพหนังสือ"
            sx={{
               display: 'grid',
               gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
               gap: { xs: 1.5, sm: 2 },
               mb: 1.5,
            }}>
            {CONDITION_OPTIONS.map((item) => {
               const isSelected = condition === item.value;

               return (
                  <Box
                     key={item.value}
                     role="radio"
                     aria-checked={isSelected}
                     tabIndex={0}
                     onClick={() => handleSelect(item.value)}
                     onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                           e.preventDefault();
                           handleSelect(item.value);
                        }
                     }}
                     sx={{
                        position: 'relative',
                        p: { xs: 2, sm: 2.25 },
                        borderRadius: '14px',
                        border: isSelected ? '2px solid #1976D2' : '1px solid #E2EAF2',
                        bgcolor: isSelected ? '#F0F7FF' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.25,
                        outline: 'none',
                        boxShadow: isSelected ? '0 4px 12px rgba(25, 118, 210, 0.1)' : '0 1px 3px rgba(15, 47, 82, 0.02)',
                        '&:hover': {
                           borderColor: isSelected ? '#1976D2' : '#CBD5E1',
                           bgcolor: isSelected ? '#F0F7FF' : '#F8FAFD',
                           transform: 'translateY(-1px)',
                        },
                        '&:focus-visible': {
                           boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.25)',
                        },
                     }}>
                     {/* Top Row: Icon + Check Indicator */}
                     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box
                           sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '10px',
                              bgcolor: isSelected ? '#FFFFFF' : '#F1F5F9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid',
                              borderColor: isSelected ? '#BFDBFE' : '#E2EAF2',
                              transition: 'all 0.15s ease',
                           }}>
                           {item.icon}
                        </Box>

                        {/* Blue check indicator */}
                        <Box
                           sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              bgcolor: isSelected ? '#1976D2' : 'transparent',
                              border: isSelected ? 'none' : '1.5px solid #CBD5E1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              transition: 'all 0.15s ease',
                           }}>
                           {isSelected && <Check size={13} strokeWidth={3} />}
                        </Box>
                     </Box>

                     {/* Title & Short Description */}
                     <Box>
                        <Typography
                           variant="body2"
                           sx={{
                              fontWeight: 700,
                              color: '#0F2F52',
                              fontSize: '0.9375rem',
                              mb: 0.25,
                           }}>
                           {item.title}
                        </Typography>
                        <Typography
                           variant="caption"
                           sx={{
                              color: '#64748B',
                              fontSize: '0.78rem',
                              lineHeight: 1.35,
                              display: 'block',
                           }}>
                           {item.description}
                        </Typography>
                     </Box>
                  </Box>
               );
            })}
         </Box>

         {/* Validation Error for condition */}
         {touched.condition && errors.condition && (
            <FormHelperText error sx={{ mb: 2, fontSize: '0.8rem' }}>
               {errors.condition}
            </FormHelperText>
         )}

         {/* Section 4: รายละเอียดเพิ่มเติม (ถ้ามี) */}
         <Box sx={{ mt: 3.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
               <Typography
                  component="label"
                  htmlFor="sell-field-defects"
                  sx={{
                     display: 'block',
                     fontSize: '0.875rem',
                     fontWeight: 600,
                     color: '#0F2F52',
                  }}>
                  รายละเอียดเพิ่มเติม (ถ้ามี)
               </Typography>
               <Typography
                  variant="caption"
                  sx={{
                     color: '#94A3B8',
                     fontSize: '0.75rem',
                  }}>
                  {currentLength} / {MAX_DEFECTS_LENGTH}
               </Typography>
            </Box>

            <TextField
               id="sell-field-defects"
               name="defects"
               fullWidth
               multiline
               rows={3}
               value={defects}
               onChange={handleDefectsChange}
               onBlur={() => onBlur('defects')}
               placeholder="เช่น มีรอยขีดเขียนเล็กน้อย..."
               slotProps={{
                  input: {
                     sx: {
                        borderRadius: '10px',
                        bgcolor: '#FFFFFF',
                        fontSize: '0.9375rem',
                        '& fieldset': {
                           borderColor: '#E2EAF2',
                        },
                        '&:hover fieldset': {
                           borderColor: '#94A3B8',
                        },
                        '&.Mui-focused fieldset': {
                           borderColor: '#1976D2',
                        },
                     },
                  },
               }}
            />
         </Box>
      </Box>
   );
};
