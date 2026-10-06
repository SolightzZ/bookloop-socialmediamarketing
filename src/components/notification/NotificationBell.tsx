import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Badge, IconButton, Tooltip, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider, Button, ClickAwayListener, Paper } from '@mui/material';
import {
   NotificationsNone as BellIcon,
   ShoppingCart as OrderIcon,
   PriceCheck as PriceDropIcon,
   Star as ReviewIcon,
   Campaign as PromoIcon,
   Info as SystemIcon,
   MarkEmailRead as MarkReadIcon,
   DeleteSweep as ClearAllIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification';
import type { AppNotification, NotificationType } from '../../types/notification';

const TYPE_ICON_MAP: Record<NotificationType, React.ReactNode> = {
   order_update: <OrderIcon sx={{ fontSize: 20, color: '#1976D2' }} />,
   price_drop: <PriceDropIcon sx={{ fontSize: 20, color: '#2E7D5B' }} />,
   review: <ReviewIcon sx={{ fontSize: 20, color: '#F59E0B' }} />,
   promotion: <PromoIcon sx={{ fontSize: 20, color: '#E11D48' }} />,
   system: <SystemIcon sx={{ fontSize: 20, color: '#627D98' }} />,
};

function timeAgo(ts: number): string {
   const diff = Date.now() - ts;
   const mins = Math.floor(diff / 60000);
   if (mins < 1) return 'เมื่อสักครู่';
   if (mins < 60) return `${mins} นาทีที่แล้ว`;
   const hrs = Math.floor(mins / 60);
   if (hrs < 24) return `${hrs} ชม.ที่แล้ว`;
   const days = Math.floor(hrs / 24);
   return `${days} วันที่แล้ว`;
}

export const NotificationBell: React.FC = () => {
   const navigate = useNavigate();
   const shouldReduceMotion = useReducedMotion();
   const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotification();
   const [open, setOpen] = useState(false);
   const [rightOffset, setRightOffset] = useState<number>(0);
   const [isBellHovered, setIsBellHovered] = useState(false);
   const [isWiggling, setIsWiggling] = useState(false);

   const containerRef = useRef<HTMLDivElement>(null);
   const prevUnreadRef = useRef(unreadCount);

   // Authored chime: subtle pendulum swing when new notifications arrive
   useEffect(() => {
      if (unreadCount > prevUnreadRef.current && unreadCount > 0) {
         setIsWiggling(true);
         const timer = window.setTimeout(() => setIsWiggling(false), 500);
         return () => clearTimeout(timer);
      }
      prevUnreadRef.current = unreadCount;
   }, [unreadCount]);

   const handleToggle = () => {
      setOpen((prev) => !prev);
   };

   const handleClose = () => {
      setOpen(false);
   };

   const calculatePosition = useCallback(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const panelWidth = Math.min(380, viewportWidth - 32);

      // Default: panel right aligns with trigger container right (right: 0)
      // The panel left coordinate in viewport would be rect.right - panelWidth
      const wouldBeLeft = rect.right - panelWidth;
      const minMargin = 16;

      if (wouldBeLeft < minMargin) {
         // Overflows viewport on the left: shift rightwards (negative right offset)
         setRightOffset(Math.round(wouldBeLeft - minMargin));
      } else if (rect.right > viewportWidth - minMargin) {
         // Overflows viewport on the right: shift leftwards (positive right offset)
         setRightOffset(Math.round(rect.right - (viewportWidth - minMargin)));
      } else {
         setRightOffset(0);
      }
   }, []);

   useEffect(() => {
      if (!open) return;
      calculatePosition();

      const handleResize = () => calculatePosition();
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            handleClose();
         }
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('keydown', handleKeyDown);

      return () => {
         window.removeEventListener('resize', handleResize);
         window.removeEventListener('keydown', handleKeyDown);
      };
   }, [open, calculatePosition]);

   const handleNotificationClick = (n: AppNotification) => {
      markAsRead(n.id);
      if (n.actionUrl) {
         navigate(n.actionUrl);
      }
      handleClose();
   };

   return (
      <ClickAwayListener onClickAway={handleClose}>
         <Box
            ref={containerRef}
            sx={{
               position: 'relative',
               display: 'inline-flex',
               alignItems: 'center',
               justifyContent: 'center',
            }}>
            <Tooltip title="การแจ้งเตือน">
               <IconButton
                  color="inherit"
                  onClick={handleToggle}
                  onMouseEnter={() => setIsBellHovered(true)}
                  onMouseLeave={() => setIsBellHovered(false)}
                  aria-label={`การแจ้งเตือน (${unreadCount} รายการใหม่)`}
                  aria-expanded={open}
                  aria-haspopup="true"
                  sx={{
                     color: open ? '#0F2D4A' : '#627D98',
                     bgcolor: open ? 'rgba(15, 45, 74, 0.05)' : 'transparent',
                     transition: 'background-color 150ms ease, color 150ms ease',
                     '&:hover': { color: '#0F2D4A', bgcolor: 'rgba(15, 45, 74, 0.05)' },
                     '&:focus-visible': { outline: '2px solid rgba(15, 23, 42, 0.2)', outlineOffset: '2px' },
                  }}>
                  <Badge
                     badgeContent={
                        unreadCount > 0 ? (
                           <motion.span
                              key={unreadCount}
                              initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.5 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                              style={{ display: 'inline-block' }}>
                              {unreadCount > 99 ? '99+' : unreadCount}
                           </motion.span>
                        ) : (
                           0
                        )
                     }
                     color="error"
                     max={99}>
                     {/* Pendulum Bell Chime Animation */}
                     <motion.span
                        style={{ display: 'inline-flex', transformOrigin: 'top center' }}
                        animate={!shouldReduceMotion && (isBellHovered || isWiggling) ? { rotate: [0, -14, 12, -8, 4, 0] } : { rotate: 0 }}
                        transition={{ duration: 0.45, ease: 'easeInOut' }}>
                        <BellIcon sx={{ fontSize: 22 }} />
                     </motion.span>
                  </Badge>
               </IconButton>
            </Tooltip>

            {/* Smooth Dropdown Panel with AnimatePresence */}
            <AnimatePresence>
               {open && (
                  <motion.div
                     key="notification-dropdown-panel"
                     initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -6 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
                     transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                     style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: rightOffset,
                        zIndex: 1300,
                        transformOrigin: 'top right',
                     }}>
                     <Paper
                        elevation={0}
                        id="notification-dropdown-panel"
                        role="region"
                        aria-label="การแจ้งเตือน"
                        sx={{
                           width: { xs: 'min(380px, calc(100vw - 32px))', sm: 380 },
                           maxWidth: { xs: 'calc(100vw - 32px)', sm: 380 },
                           maxHeight: 480,
                           borderRadius: 3,
                           border: '1px solid #E2E8F0',
                           boxShadow: '0 12px 36px rgba(15, 45, 74, 0.14)',
                           bgcolor: '#FFFFFF',
                           overflow: 'hidden',
                           display: 'flex',
                           flexDirection: 'column',
                        }}>
                        {/* Header */}
                        <Box sx={{ px: 2.5, pt: 2, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F2D4A' }}>
                              การแจ้งเตือน
                           </Typography>
                           <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {unreadCount > 0 && (
                                 <motion.div whileHover={!shouldReduceMotion ? { scale: 1.02 } : undefined} whileTap={!shouldReduceMotion ? { scale: 0.96 } : undefined}>
                                    <Button
                                       size="small"
                                       startIcon={<MarkReadIcon sx={{ fontSize: 16 }} />}
                                       onClick={markAllAsRead}
                                       sx={{
                                          textTransform: 'none',
                                          fontSize: '0.75rem',
                                          color: '#1976D2',
                                          fontWeight: 600,
                                          minWidth: 0,
                                          px: 1,
                                          borderRadius: 1.5,
                                       }}>
                                       อ่านทั้งหมด
                                    </Button>
                                 </motion.div>
                              )}
                              {notifications.length > 0 && (
                                 <motion.div whileHover={!shouldReduceMotion ? { scale: 1.02 } : undefined} whileTap={!shouldReduceMotion ? { scale: 0.96 } : undefined}>
                                    <Button
                                       size="small"
                                       startIcon={<ClearAllIcon sx={{ fontSize: 16 }} />}
                                       onClick={clearAll}
                                       sx={{
                                          textTransform: 'none',
                                          fontSize: '0.75rem',
                                          color: '#94A3B8',
                                          fontWeight: 600,
                                          minWidth: 0,
                                          px: 1,
                                          borderRadius: 1.5,
                                          '&:hover': { color: '#64748B' },
                                       }}>
                                       ล้าง
                                    </Button>
                                 </motion.div>
                              )}
                           </Box>
                        </Box>

                        <Divider sx={{ mx: 2.5 }} />

                        {/* Notification List */}
                        {notifications.length === 0 ? (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}>
                              <Box sx={{ py: 6, textAlign: 'center' }}>
                                 <BellIcon sx={{ fontSize: 44, color: '#CBD5E1', mb: 1, opacity: 0.8 }} />
                                 <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                                    ยังไม่มีการแจ้งเตือน
                                 </Typography>
                              </Box>
                           </motion.div>
                        ) : (
                           <List sx={{ py: 0, maxHeight: 380, overflowY: 'auto' }}>
                              <AnimatePresence initial={false}>
                                 {notifications.map((n, index) => (
                                    <motion.li
                                       key={n.id}
                                       initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -6 }}
                                       animate={{ opacity: 1, x: 0 }}
                                       exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 12 }}
                                       transition={
                                          shouldReduceMotion
                                             ? { duration: 0.1 }
                                             : {
                                                  duration: 0.16,
                                                  delay: Math.min(index * 0.025, 0.12),
                                                  ease: [0.16, 1, 0.3, 1],
                                               }
                                       }
                                       style={{ listStyle: 'none' }}>
                                       <ListItemButton
                                          onClick={() => handleNotificationClick(n)}
                                          sx={{
                                             px: 2.5,
                                             py: 1.5,
                                             bgcolor: n.read ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
                                             transition: 'background-color 150ms ease',
                                             '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.07)' },
                                             borderBottom: '1px solid #F1F5F9',
                                          }}>
                                          <ListItemIcon sx={{ minWidth: 40 }}>{TYPE_ICON_MAP[n.type]}</ListItemIcon>
                                          <ListItemText
                                             primary={
                                                <Typography variant="body2" sx={{ fontWeight: n.read ? 400 : 700, color: '#0F2D4A', fontSize: '0.85rem' }}>
                                                   {n.title}
                                                </Typography>
                                             }
                                             secondary={
                                                <>
                                                   <Typography variant="caption" sx={{ color: '#627D98', display: 'block', lineHeight: 1.4 }}>
                                                      {n.message}
                                                   </Typography>
                                                   <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                                                      {timeAgo(n.timestamp)}
                                                   </Typography>
                                                </>
                                             }
                                          />
                                          {!n.read && (
                                             <motion.div
                                                key="unread-dot"
                                                initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                                style={{
                                                   width: 8,
                                                   height: 8,
                                                   borderRadius: '50%',
                                                   backgroundColor: '#1976D2',
                                                   flexShrink: 0,
                                                   marginLeft: 8,
                                                }}
                                             />
                                          )}
                                       </ListItemButton>
                                    </motion.li>
                                 ))}
                              </AnimatePresence>
                           </List>
                        )}
                     </Paper>
                  </motion.div>
               )}
            </AnimatePresence>
         </Box>
      </ClickAwayListener>
   );
};
