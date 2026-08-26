import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
} from '@mui/material';
import {
  ViewQuilt as LayoutIcon,
  Navigation as NavIcon,
  ShoppingCartOutlined as CartIcon,
  RateReviewOutlined as FeedbackIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';

export const MuiComponentsCatalog: React.FC = () => {
  const muiComponents = [
    {
      category: 'Layout & Foundation (โครงสร้างหลัก)',
      icon: <LayoutIcon sx={{ color: 'primary.main', fontSize: 24 }} />,
      items: [
        { name: 'CssBaseline', desc: 'รีเซ็ตและปรับมาตรฐาน CSS Baseline ให้สอดคล้องกันทุกเบราว์เซอร์' },
        { name: 'ThemeProvider', desc: 'ส่งผ่าน Design Tokens, Typography และ Color Palette กลางให้ทุกหน้า' },
        { name: 'Container', desc: 'กำหนดขอบเขตความกว้างสูงสุด (Max-width: XL/LG) และ Padding ซ้าย-ขวา' },
        { name: 'Grid (v2)', desc: 'ระบบกริด 12 คอลัมน์ที่ตอบสนองทุกขนาดหน้าจอ (xs, sm, md, lg, xl)' },
        { name: 'Box & Stack', desc: 'Flexbox Containers สำหรับจัดวางตำแหน่งและควบคุมระยะห่าง (gap/spacing)' },
        { name: 'Paper', desc: 'พื้นผิวแสดงข้อมูลพร้อม Elevation หรือ Flat Border Style' },
        { name: 'Divider', desc: 'เส้นแบ่งสัดส่วนเนื้อหาและแถบสรุปยอดราคา' },
      ],
    },
    {
      category: 'Navigation & Navigation Controls',
      icon: <NavIcon sx={{ color: 'secondary.main', fontSize: 24 }} />,
      items: [
        { name: 'AppBar & Toolbar', desc: 'แถบ Navigation Bar ด้านบนแบบ Sticky พร้อม Brand Logo และ Links' },
        { name: 'Drawer', desc: 'เมนูด้านข้างแบบ Off-canvas สำหรับอุปกรณ์มือถือและแท็บเล็ต' },
        { name: 'Breadcrumbs', desc: 'บอกเส้นทางโครงสร้างหน้าปัจจุบัน (หน้าแรก > ค้นหา > รายละเอียด)' },
        { name: 'Tabs & Tab', desc: 'สลับดูข้อมูล เรื่องราวผู้ขาย และรีวิวหนังสืออย่างเป็นระเบียบ' },
        { name: 'Pagination', desc: 'ระบบแบ่งหน้าสำหรับผลลัพธ์การค้นหารายการหนังสือ (แสดง 9 เล่ม/หน้า)' },
        { name: 'Accordion', desc: 'กล่องย่อ-ขยายสำหรับคำถามที่พบบ่อย (FAQ) และเกณฑ์สภาพหนังสือ' },
      ],
    },
    {
      category: 'E-Commerce & Data Display',
      icon: <CartIcon sx={{ color: '#059669', fontSize: 24 }} />,
      items: [
        { name: 'Card, CardContent, CardMedia', desc: 'การ์ดแสดงรายการหนังสือ (BookCard) ป้ายราคา และภาพปก' },
        { name: 'Typography', desc: 'ลำดับขั้นตัวอักษร Display, H1-H6, Body1, Body2, Overline, Caption' },
        { name: 'Chip & Badge', desc: 'ป้ายแท็กหมวดหมู่ สภาพหนังสือ และตัวนับสินค้าในตะกร้า/รายการโปรด' },
        { name: 'Avatar', desc: 'รูปโปรไฟล์ผู้ส่งต่อหนังสือ ผู้ซื้อ และสมาชิกชุมชน' },
        { name: 'Rating', desc: 'คะแนนดาวหนังสือและคะแนนความน่าเชื่อถือของผู้ขาย' },
        { name: 'List & ListItem', desc: 'รายการสินค้าในตะกร้า รายการตำหนิ และคอมเมนต์รีวิว' },
        { name: 'Tooltip', desc: 'คำอธิบาย Action ไอคอน เช่น กดเพื่อบันทึกในรายการโปรด' },
      ],
    },
    {
      category: 'Form, Filters & Interaction',
      icon: <FeedbackIcon sx={{ color: '#D97706', fontSize: 24 }} />,
      items: [
        { name: 'TextField & InputBase', desc: 'ช่องค้นหาหนังสือ และฟอร์มลงขายหนังสือหลายขั้นตอน' },
        { name: 'InputAdornment', desc: 'ไอคอนนำหน้าช่องค้นหา และสัญลักษณ์สกุลเงินบาท (฿)' },
        { name: 'Select & MenuItem', desc: 'ตัวเลือกหมวดหมู่หนังสือ สภาพหนังสือ และการเรียงลำดับ' },
        { name: 'Slider', desc: 'ตัวปรับเลือกช่วงราคาต่ำสุด-สูงสุด (Price Range Filter)' },
        { name: 'Button & IconButton', desc: 'ปุ่ม CTA สั่งซื้อ เพิ่มลงตะกร้า บันทึก และปุ่มเปลี่ยนจำนวน' },
        { name: 'Alert & Snackbar', desc: 'แถบข้อความแจ้งเตือนสถานะความสำเร็จและข้อผิดพลาด' },
      ],
    },
  ];

  const handleDemoSweetAlert = () => {
    Swal.fire({
      icon: 'success',
      title: 'SweetAlert2 x MUI Integration',
      text: 'ระบบแจ้งเตือนแบบ Modal/Dialog ตามสเปกของ BookLoop สำหรับ Action สำคัญ (สั่งซื้อ, เพิ่มตะกร้า, ลงขาย)',
      confirmButtonText: 'เข้าใจแล้ว',
      confirmButtonColor: '#1769AA',
      background: '#FFFFFF',
      customClass: {
        popup: 'rounded-2xl',
      },
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5, fontSize: { xs: '1.5rem', md: '1.85rem' } }}>
          MUI Components Catalog ที่ใช้ใน BookLoop
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 3 }}>
          ระบบส่วนประกอบหน้าจอที่ถูกคัดเลือกและปรับแต่งให้ตอบโจทย์ e-commerce สำหรับตลาดหนังสือมือสอง โดยใช้ Component มาตรฐานของ Material UI ทั้งหมด
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {muiComponents.map((group, idx) => (
          <Grid size={{ xs: 12, md: 6 }} key={idx}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 2.5,
                border: '1px solid #D9E2EC',
                bgcolor: '#FFFFFF',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  {group.icon}
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {group.category}
                  </Typography>
                </Box>
                <Stack spacing={1.5}>
                  {group.items.map((item, i) => (
                    <Box
                      key={i}
                      sx={{
                        p: 1.5,
                        bgcolor: '#F8FAFC',
                        borderRadius: 1.5,
                        border: '1px solid #EDF2F7',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'secondary.main', fontFamily: 'monospace' }}>
                        &lt;{item.name} /&gt;
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.5, lineHeight: 1.5 }}>
                        {item.desc}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Responsive UI Architecture in MUI (v9 Standards) */}
      <Box sx={{ mt: 5, p: 3.5, bgcolor: '#FFFFFF', borderRadius: 3, border: '1px solid #D9E2EC' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <LayoutIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
            MUI Responsive Layout Architecture
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 3 }}>
          แนวทางและมาตรฐานการทำ Responsive UI สำหรับหน้าจอ PC (Desktop), Tablet และ Mobile ในระบบ BookLoop:
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0', height: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                1. ระบบ Breakpoints มาตรฐาน
              </Typography>
              <Stack spacing={0.8} sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                <Box><strong>xs (Mobile):</strong> 0px ขึ้นไป (1 คอลัมน์)</Box>
                <Box><strong>sm (Tablet):</strong> 600px ขึ้นไป (2 คอลัมน์)</Box>
                <Box><strong>md (Laptop/PC):</strong> 900px ขึ้นไป (3 คอลัมน์ / Sidebar แสดง)</Box>
                <Box><strong>lg (Desktop):</strong> 1200px ขึ้นไป (4 คอลัมน์ / Full View)</Box>
                <Box><strong>xl (Large Screen):</strong> 1536px ขึ้นไป (Max-width bounds)</Box>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0', height: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                2. Grid (2D) vs Stack (1D)
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 1.5 }}>
                • <strong>&lt;Grid&gt;:</strong> จัดวางตาราง 2 มิติ (ห้ามใช้ direction="column" บน Grid)<br />
                • <strong>&lt;Stack&gt;:</strong> จัดวางแนวตั้ง/แนวนอน 1 มิติ เช่น รายการ, ปุ่ม, ขั้นตอน<br />
                • <strong>&lt;Container&gt;:</strong> ครอบความกว้างสูงสุดและกึ่งกลางหน้า
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0', height: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                3. การใช้ Responsive sx Object
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                กำหนดค่า CSS ตาม Breakpoints ผ่าน <code>sx</code> เช่น:<br />
                • <code>display: &#123; xs: 'none', md: 'block' &#125;</code> (ซ่อนใน Mobile แสดงใน PC)<br />
                • <code>fontSize: &#123; xs: '1.2rem', md: '2rem' &#125;</code><br />
                • <code>direction: &#123; xs: 'column', md: 'row' &#125;</code> บน Stack
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Interactive Demo Action */}
      <Box sx={{ mt: 4, p: 3.5, bgcolor: '#F0F9FF', borderRadius: 2.5, border: '1px solid #BAE6FD' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ maxWidth: 700 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
              ทดสอบการทำงานของ SweetAlert2 + MUI Modal Flow
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              ใช้ SweetAlert2 ร่วมกับระบบ MUI Theme เพื่อให้ Modal แจ้งเตือนสอดรับกับสีและสไตล์ของระบบ
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDemoSweetAlert}
            sx={{ borderRadius: 2, fontWeight: 700, px: 3, py: 1 }}
          >
            ทดสอบ SweetAlert2 Popup
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
