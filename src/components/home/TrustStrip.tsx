import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { Tag, ShieldCheck, BookOpen, ArrowLeftRight } from 'lucide-react';

interface TrustItem {
   icon: React.ReactNode;
   iconBg: string;
   iconColor: string;
   title: string;
   subtitle: string;
}

const benefits: TrustItem[] = [
   {
      icon: <Tag size={16} strokeWidth={2.2} />,
      iconBg: '#E8F5E9',
      iconColor: '#10B981',
      title: 'ประหยัดได้ 40-70%',
      subtitle: 'เมื่อเทียบกับราคาปกมือหนึ่ง',
   },
   {
      icon: <ShieldCheck size={16} strokeWidth={2.2} />,
      iconBg: '#EAF4FF',
      iconColor: '#1976D2',
      title: 'ระบุสภาพทุกเล่ม',
      subtitle: 'มีรูปจริงและคำอธิบายจากผู้ขาย',
   },
   {
      icon: <BookOpen size={16} strokeWidth={2.2} />,
      iconBg: '#FFFBEB',
      iconColor: '#D97706',
      title: 'เรื่องราวจากเจ้าของเดิม',
      subtitle: 'อ่านบันทึกที่เจ้าของเล่มเขียนไว้',
   },
   {
      icon: <ArrowLeftRight size={16} strokeWidth={2.2} />,
      iconBg: '#EAF4FF',
      iconColor: '#1976D2',
      title: 'ส่งต่อได้หลายรอบ',
      subtitle: 'อ่านจบแล้วส่งต่อให้คนถัดไป',
   },
];

// Duplicate 4x so one half of the track (2 sets) always exceeds the viewport.
// Animating translateX(0 → -50%) then loops seamlessly outside the visible area.
const marqueeItems: TrustItem[] = [...benefits, ...benefits, ...benefits, ...benefits];

/**
 * TrustStrip — auto-scrolling infinite benefit marquee.
 * - GPU-friendly CSS transform animation (no JS loop, no setState per frame)
 * - Seamless loop via duplicated track + translateX(-50%)
 * - Edge fade mask, hover-pause, reduced-motion respected
 * - Compact cards (~20% smaller): 250–290px desktop, 220–250px mobile
 */
export const TrustStrip = memo(function TrustStrip() {
   return (
      <Box
         component="section"
         aria-label="คุณค่าและความน่าเชื่อถือของ BookLoop"
         sx={{
            position: 'relative',
            zIndex: 20,
            py: { xs: 2.5, md: 3.5 },
            mt: { xs: -1.5, md: -2.5 },
            overflow: 'hidden',
         }}>
         {/* Edge-fade marquee viewport */}
         <Box
            className="trust-marquee"
            sx={{
               overflow: 'hidden',
               // Subtle left/right fade so cards enter & leave naturally
               WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)',
               maskImage: 'linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)',
               '@media (max-width: 768px)': {
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)',
                  maskImage: 'linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)',
               },
            }}>
            {/* Animated track */}
            <Box
               className="trust-marquee-track"
               sx={{
                  display: 'flex',
                  width: 'max-content',
                  alignItems: 'stretch',
                  py: 1,
                  willChange: 'transform',
               }}>
               {marqueeItems.map((item, index) => (
                  <Box
                     key={index}
                     aria-hidden={index >= benefits.length ? true : undefined}
                     sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.25,
                        flexShrink: 0,
                        width: { xs: 232, sm: 248, md: 268 },
                        minHeight: { xs: 72, md: 78 },
                        maxHeight: { xs: 80, md: 86 },
                        mr: { xs: 1.5, md: 2 },
                        px: { xs: 1.5, md: 1.75 },
                        py: 1.25,
                        bgcolor: 'rgba(255, 255, 255, 0.92)',
                        border: '1px solid rgba(25, 118, 210, 0.10)',
                        borderRadius: '22px',
                        boxShadow: '0 10px 24px -10px rgba(15, 45, 74, 0.12), 0 2px 6px rgba(15, 45, 74, 0.04)',
                        backdropFilter: 'blur(6px)',
                     }}>
                     {/* Small colored circular icon */}
                     <Box
                        sx={{
                           width: { xs: 30, md: 34 },
                           height: { xs: 30, md: 34 },
                           borderRadius: '50%',
                           bgcolor: item.iconBg,
                           color: item.iconColor,
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           flexShrink: 0,
                        }}>
                        {item.icon}
                     </Box>

                     {/* Text */}
                     <Box sx={{ minWidth: 0 }}>
                        <Typography
                           variant="subtitle2"
                           sx={{
                              fontWeight: 700,
                              color: '#102A43',
                              fontSize: { xs: '0.76rem', md: '0.82rem' },
                              lineHeight: 1.3,
                              letterSpacing: '-0.01em',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                           }}>
                           {item.title}
                        </Typography>
                        <Typography
                           variant="caption"
                           sx={{
                              color: '#627D98',
                              fontSize: { xs: '0.66rem', md: '0.7rem' },
                              display: 'block',
                              lineHeight: 1.3,
                              mt: 0.25,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                           }}>
                           {item.subtitle}
                        </Typography>
                     </Box>
                  </Box>
               ))}
            </Box>
         </Box>
      </Box>
   );
});

TrustStrip.displayName = 'TrustStrip';
