# MUI.md — Material UI v9 Usage Guide

คู่มือการใช้ Material UI v9 สำหรับ BookLoop โดยกำหนดให้ MUI เป็นแกนหลักของ Frontend ทั้งด้าน layout, design system, responsive behavior, form, navigation, feedback และ accessibility

## สถานะและขอบเขต

- **Project:** BookLoop
- **UI foundation:** Material UI v9
- **Styling:** MUI System (`sx`) + Emotion
- **Icons:** `@mui/icons-material`
- **Runtime:** React 19
- **Scope:** Frontend prototype / e-commerce marketplace demo

เอกสารนี้ไม่ครอบคลุม MUI X ที่ไม่จำเป็นต่อ prototype เช่น Data Grid, Charts และ Date/Time Pickers

## 1. MUI-first principles

ให้เลือกใช้ตามลำดับนี้:

```text
MUI component
→ MUI theme token
→ sx prop
→ Emotion styled component
→ plain CSS เฉพาะกรณีที่จำเป็นจริง
```

กฎหลัก:

- ใช้ MUI component ก่อนสร้าง HTML/CSS component เอง
- ใช้ `ThemeProvider` และ `createTheme` เป็น source of truth ของสี typography spacing radius shadow และ component variants
- ใช้ `@mui/icons-material` เป็น icon system กลาง
- custom component ต้อง compose จาก MUI และรักษา keyboard/focus/accessibility behavior
- ห้ามใช้ Bootstrap, Tailwind หรือ UI library อื่นมาทับ MUI
- ห้ามกำหนดสีและ spacing แบบกระจายตัวโดยไม่อิง theme
- ห้ามใช้ `!important` เพื่อแก้ specificity หากยังไม่ได้แก้โครงสร้าง style ให้ถูกต้อง
- อย่า override MUI component ทั้งระบบเพราะปัญหาเฉพาะหน้าเดียว ให้ใช้ `sx` หรือ variant ที่ scope ถูกต้อง

## 2. Installation

ติดตั้ง package หลัก:

```bash
npm install @mui/material@9 @mui/icons-material@9 @emotion/react @emotion/styled
```

BookLoop ใช้ package เพิ่มเติม:

```bash
npm install react-router-dom framer-motion sweetalert2
```

ถ้า project ถูก scaffold แล้ว ให้ตรวจ `package.json` ก่อนติดตั้งซ้ำ และตรวจว่า dependency ทั้งหมดอยู่บน major version ที่ compatible กัน

## 3. Theme setup

MUI theme ใช้กำหนด tone และ consistency ของแอป ส่วนประกอบที่อยู่ใต้ `ThemeProvider` จะรับ theme เดียวกันทั้งต้นไม้ของ React

### 3.1 Theme file

สร้าง `src/theme/theme.js`:

```jsx
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#102A43',
      dark: '#0B1F33',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#1769AA',
      light: '#E8F1F8',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F7F9FB',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#102A43',
      secondary: '#52606D'
    },
    divider: '#D9E2EC',
    success: { main: '#2E7D5B' },
    warning: { main: '#B7791F' },
    error: { main: '#B42318' }
  },
  typography: {
    fontFamily: '"Noto Sans Thai", "Inter", Arial, sans-serif',
    h1: { fontWeight: 800, lineHeight: 1.15 },
    h2: { fontWeight: 750, lineHeight: 1.2 },
    h3: { fontWeight: 700, lineHeight: 1.25 },
    button: { textTransform: 'none', fontWeight: 700 }
  },
  shape: {
    borderRadius: 12
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          minWidth: 320,
          backgroundColor: '#F7F9FB'
        },
        '*:focus-visible': {
          outline: '3px solid #1769AA',
          outlineOffset: 2
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 10,
          textTransform: 'none'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #D9E2EC',
          boxShadow: '0 4px 16px rgba(16, 42, 67, 0.06)'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true
      }
    },
    MuiDialog: {
      defaultProps: {
        fullWidth: true,
        maxWidth: 'sm'
      }
    }
  }
});

theme = responsiveFontSizes(theme);

export default theme;
```

หมายเหตุ: หาก `cssVariables` ไม่เหมาะกับ configuration ของ project ให้เอาออกได้ แต่ต้องยังใช้ `ThemeProvider` และ theme token กลางเสมอ

### 3.2 Theme provider

สร้าง `src/app/providers.jsx`:

```jsx
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../theme/theme';

export function AppProviders({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

ใช้ provider ที่ root เช่น `src/main.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProviders } from './app/providers';
import App from './app/App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
```

## 4. BookLoop design tokens

ใช้ token ผ่าน `theme.palette` หรือ `theme` ไม่ hard-code ในทุก component:

| Token | Value | ใช้กับ |
| --- | --- | --- |
| Ink / Navy | `#102A43` | primary text, header, primary button |
| Deep Navy | `#0B1F33` | dark surface และ hover |
| Action Blue | `#1769AA` | secondary action, focus, link |
| Soft Blue | `#E8F1F8` | selected state, soft background |
| Paper | `#FFFFFF` | card และ surface |
| Warm Surface | `#F7F9FB` | page background |
| Muted Text | `#52606D` | helper text, metadata |
| Border | `#D9E2EC` | divider และ card border |
| Success | `#2E7D5B` | status เท่านั้น ไม่ใช่สีหลัก |
| Warning | `#B7791F` | warning/condition |
| Danger | `#B42318` | error และ destructive action |

หลีกเลี่ยงสีรุ้ง, neon, gradient รุนแรง, 3D UI และ glassmorphism หนัก เพราะไม่สอดคล้องกับ BookLoop ที่ต้องการความน่าเชื่อถือและอ่านง่าย

## 5. Layout components

### Container, Box และ Stack

ใช้ `Container` ควบคุมความกว้าง ใช้ `Stack` จัดระยะห่าง และใช้ `Box` สำหรับ wrapper ขนาดเล็ก:

```jsx
import { Box, Container, Stack, Typography } from '@mui/material';

export function SectionIntro() {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Stack spacing={2}>
          <Typography component="h2" variant="h3">
            ค้นหาหนังสือในแบบของคุณ
          </Typography>
          <Typography color="text.secondary">
            ค้นพบหนังสือมือสองหลากหลายประเภทจากผู้ขายในชุมชน
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
```

### Grid

ใช้ responsive props เพื่อสร้าง grid ที่ไม่ทำให้เกิด horizontal scroll:

```jsx
import { Grid } from '@mui/material';

<Grid container spacing={{ xs: 2, md: 3 }}>
  {books.map((book) => (
    <Grid key={book.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
      <BookCard book={book} />
    </Grid>
  ))}
</Grid>;
```

ถ้า version/configuration ของ MUI ใช้ syntax Grid แบบ legacy ให้ใช้ syntax ที่ตรงกับ package จริงทั้ง project และอย่าผสมสองรูปแบบใน codebase เดียวกัน

## 6. Navigation

### Header

ใช้ `AppBar`, `Toolbar`, `Container`, `IconButton`, `Badge`, `Drawer` และ React Router:

```jsx
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {
  AppBar,
  Badge,
  Container,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material';

export function SiteHeader({ cartCount, onMenuOpen }) {
  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 72, gap: 2 }}>
          <IconButton
            edge="start"
            aria-label="เปิดเมนู"
            onClick={onMenuOpen}
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="a" href="/" color="primary" fontWeight={800}>
            BookLoop
          </Typography>
          <IconButton aria-label={`ตะกร้า มี ${cartCount} รายการ`}>
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
```

ใน application จริงให้ใช้ `Link`/`NavLink` ของ React Router แทน `href` เพื่อไม่ reload หน้าโดยไม่จำเป็น

### Drawer

ใช้สำหรับ mobile navigation และ mobile filters:

```jsx
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';

export function MobileNav({ open, onClose }) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List sx={{ width: 280 }} aria-label="เมนูหลัก">
        <ListItemButton component="a" href="/books" onClick={onClose}>
          <ListItemText primary="หนังสือ" />
        </ListItemButton>
        <ListItemButton component="a" href="/sell" onClick={onClose}>
          <ListItemText primary="ขายหนังสือ" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
```

Drawer ต้องปิดได้ด้วย close button, Escape, backdrop และหลังผู้ใช้เลือก route

## 7. Search และ form

### Search field

ใช้ `TextField` + `InputAdornment` และรองรับ Enter:

```jsx
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, TextField } from '@mui/material';

export function BookSearch({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} role="search">
      <TextField
        label="ค้นหาหนังสือ"
        placeholder="ชื่อหนังสือ ผู้เขียน หรือ ISBN..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" aria-label="ค้นหาหนังสือ">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          )
        }
      />
    </form>
  );
}
```

สำหรับ MUI v9 ให้ตรวจ API ของ `TextField` ใน version ที่ติดตั้ง หาก project ใช้ slot props รุ่นใหม่ ให้ใช้ API นั้นตาม package จริงและอย่าผสมรูปแบบโดยไม่จำเป็น

### Sell form

ทุก field ต้องมี label, required state และ error message:

```jsx
import { Button, MenuItem, Stack, TextField } from '@mui/material';

export function SellBookForm({ values, errors, onChange, onSubmit }) {
  return (
    <Stack component="form" spacing={2} onSubmit={onSubmit} noValidate>
      <TextField
        label="ชื่อหนังสือ"
        name="title"
        value={values.title}
        onChange={onChange}
        error={Boolean(errors.title)}
        helperText={errors.title || 'กรอกชื่อหนังสือที่ต้องการส่งต่อ'}
        required
      />
      <TextField
        select
        label="สภาพหนังสือ"
        name="condition"
        value={values.condition}
        onChange={onChange}
        error={Boolean(errors.condition)}
        helperText={errors.condition}
        required
      >
        <MenuItem value="Excellent">Excellent</MenuItem>
        <MenuItem value="Very Good">Very Good</MenuItem>
        <MenuItem value="Good">Good</MenuItem>
        <MenuItem value="Acceptable">Acceptable</MenuItem>
      </TextField>
      <Button type="submit" variant="contained">
        ลงขายแบบ Demo
      </Button>
    </Stack>
  );
}
```

## 8. Book Card

Book Card ต้องใช้ MUI `Card`, `CardMedia`, `CardContent`, `CardActions`, `Chip`, `Rating` และ `IconButton`:

```jsx
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Rating,
  Stack,
  Typography
} from '@mui/material';

export function BookCard({ book, onFavorite, onAddToCart }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        image={book.cover}
        alt={`ปกหนังสือ ${book.title}`}
        sx={{ aspectRatio: '3 / 4', objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1}>
          <Chip label={book.condition} size="small" sx={{ alignSelf: 'flex-start' }} />
          <Typography component="h3" variant="h6">
            {book.title}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {book.author}
          </Typography>
          <Rating value={book.rating} precision={0.1} size="small" readOnly />
          <Typography variant="h6" color="primary" fontWeight={800}>
            ฿{book.price.toLocaleString('th-TH')}
          </Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <IconButton aria-label={`เพิ่ม ${book.title} ในรายการโปรด`} onClick={onFavorite}>
          <FavoriteBorderIcon />
        </IconButton>
        <IconButton aria-label={`เพิ่ม ${book.title} ลงตะกร้า`} onClick={onAddToCart}>
          <AddShoppingCartIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
```

ใน production component ต้องใช้ `Link` ไปยัง `/books/:id` และต้องมี fallback เมื่อ image โหลดไม่ได้

## 9. Feedback และ dialogs

### MUI Alert / Snackbar

ใช้สำหรับ feedback ที่ไม่ต้องหยุด flow:

```jsx
import { Alert, Snackbar } from '@mui/material';

export function CartSnackbar({ open, onClose }) {
  return (
    <Snackbar open={open} autoHideDuration={3500} onClose={onClose}>
      <Alert onClose={onClose} severity="success" variant="filled">
        เพิ่มหนังสือลงตะกร้าแล้ว
      </Alert>
    </Snackbar>
  );
}
```

### SweetAlert2

ใช้สำหรับ confirmation หรือ feedback ที่ต้องเด่นกว่า Snackbar:

```jsx
import Swal from 'sweetalert2';

export async function confirmDemoCheckout() {
  const result = await Swal.fire({
    icon: 'question',
    title: 'ยืนยันการสั่งซื้อแบบ Demo หรือไม่?',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน Demo',
    cancelButtonText: 'ยกเลิก',
    focusCancel: true,
    confirmButtonColor: '#1769AA'
  });

  return result.isConfirmed;
}
```

ห้ามใช้ native `alert()`, `confirm()` หรือ `prompt()` และอย่าใช้ MUI Dialog กับ SweetAlert2 ซ้อนกันเพื่อ action เดียว

## 10. Responsive design

MUI มี default breakpoints `xs`, `sm`, `md`, `lg`, `xl` ให้ใช้กับ `sx`, Grid และ `useMediaQuery` ตามความเหมาะสม [MUI Breakpoints](https://mui.com/material-ui/customization/breakpoints/)

### Responsive `sx`

```jsx
<Box
  sx={{
    px: { xs: 2, sm: 3, md: 4 },
    py: { xs: 6, md: 10 },
    display: { xs: 'block', md: 'grid' },
    gridTemplateColumns: { md: '1fr 1fr' },
    gap: { xs: 3, md: 6 }
  }}
>
  {/* Hero content */}
</Box>
```

### `useMediaQuery`

ใช้เมื่อจำเป็นต้องเปลี่ยน component tree เช่น desktop navigation กับ mobile drawer:

```jsx
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export function ResponsiveNav() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return isMobile ? <MobileNav /> : <DesktopNav />;
}
```

ถ้าเปลี่ยนแค่ layout หรือ spacing ให้ใช้ responsive `sx` แทนการ render ซ้ำสองชุด

## 11. Styling strategy

### ใช้ `sx` เมื่อ

- style ใช้เฉพาะ component เดียว
- ต้องใช้ responsive value
- ต้องอ้างอิง theme token
- ต้องปรับ spacing, color หรือ layout เฉพาะ instance

```jsx
<Button sx={{ px: 3, borderRadius: 2 }} variant="contained">
  ค้นหาหนังสือ
</Button>
```

### ใช้ Emotion `styled` เมื่อ

- มี custom component ที่นำกลับมาใช้หลายหน้า
- ต้องสร้าง style API ที่เป็นระบบ
- style มี logic มากจน `sx` อ่านยาก

```jsx
import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

export const StoryPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.palette.secondary.light
}));
```

### หลีกเลี่ยง

```jsx
// ❌ hard-code style ซ้ำและไม่ใช้ theme
<div style={{ padding: 37, color: '#123456' }} />

// ✅ ใช้ MUI และ theme
<Box sx={{ p: 4, color: 'text.primary' }} />
```

## 12. Icons

ติดตั้งจาก `@mui/icons-material` และ import icon ที่ต้องใช้เท่านั้น:

```jsx
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
```

Icons ที่ใช้บ่อยใน BookLoop:

| กลุ่ม | Icons |
| --- | --- |
| Navigation | `Menu`, `Close`, `ArrowBack`, `ArrowForward`, `ChevronLeft`, `ChevronRight` |
| Search | `Search`, `FilterList`, `Sort`, `Tune`, `Clear` |
| Commerce | `ShoppingCartOutlined`, `AddShoppingCart`, `FavoriteBorder`, `Favorite`, `Add`, `Remove`, `DeleteOutline` |
| Seller | `PersonOutline`, `Storefront`, `Verified`, `LocalOfferOutlined` |
| Feedback | `CheckCircleOutline`, `ErrorOutline`, `WarningAmber`, `InfoOutlined` |

กฎ:

- icon-only button ต้องมี `aria-label`
- ปุ่มหลักควรมี text ร่วมกับ icon
- ใช้ `Tooltip` เมื่อความหมายของ icon ไม่ชัดเจน
- ใช้ `currentColor`/theme color ไม่กำหนดสีสุ่ม
- logo BookLoop ใช้ custom brand asset ได้ ไม่ต้องฝืนใช้ MUI icon

## 13. Accessibility

- ใช้ semantic `component` prop เช่น `component="header"`, `component="main"`, `component="section"`
- กำหนด heading hierarchy ด้วย `Typography component="h1"` เป็นต้น
- ทุก image มี alt text ที่อธิบายภาพ
- ทุก input มี label ที่มองเห็นหรือ accessible label
- error message ต้องเชื่อมกับ input และบอกวิธีแก้
- icon-only control มี `aria-label`
- ตรวจ visible focus state ด้วย keyboard
- Drawer/Dialog ต้องปิดด้วย Escape และจัดการ focus อย่างเหมาะสม
- อย่าสื่อความหมายด้วยสีอย่างเดียว เช่น condition ต้องมี text label ด้วย
- รองรับ `prefers-reduced-motion`
- ตรวจ contrast ของ text, button และ disabled state

## 14. Page-level MUI mapping

| Page | MUI foundation |
| --- | --- |
| Home / Landing | `AppBar`, `Container`, `Stack`, `Grid`, `Card`, `Button`, `Paper`, `Typography` |
| Books | `TextField`, `InputAdornment`, `Select`, `Slider`, `Chip`, `Drawer`, `Grid`, `Pagination` |
| Product Detail | `Breadcrumbs`, `Grid`, `ImageList`, `IconButton`, `Chip`, `Rating`, `Tabs`, `Accordion`, `Avatar` |
| Sell | `TextField`, `Select`, `FormControl`, `InputLabel`, `RadioGroup`, `Button`, `Alert`, `Paper` |
| About | `Container`, `Stack`, `Paper`, `Card`, `Stepper`, `Button` |
| Campaign | `Container`, `Card`, `Chip`, `Stack`, `Button`, `Avatar`, `Divider` |
| Cart | `List`, `ListItem`, `IconButton`, `Divider`, `Paper`, `Alert`, `Button`, `Badge` |

## 15. Performance และ maintainability

- import component และ icon แบบ named path เพื่อให้ bundle tree-shaking ทำงานได้ดี
- อย่า import icon ทั้งชุดหรือสร้าง barrel file ขนาดใหญ่โดยไม่จำเป็น
- ใช้ `Skeleton` รักษาขนาด layout ระหว่าง loading
- ใช้ image aspect ratio ให้ card ไม่กระโดด
- ใช้ responsive `sx` แทนการสร้าง duplicate layout โดยไม่จำเป็น
- กำหนด component variants ใน theme เมื่อ pattern ถูกใช้ซ้ำหลายหน้า
- เก็บ theme ไว้ใน `src/theme` ไม่สร้าง theme ซ้ำใน page
- ตรวจ bundle และ build ก่อนเพิ่ม package ใหม่

## 16. Anti-patterns

### ❌ สร้าง layout ด้วย CSS เองทั้งหมด

```jsx
<div className="book-grid">
  {/* custom CSS ซ้ำกับ MUI Grid */}
</div>
```

### ✅ ใช้ MUI Grid และ theme

```jsx
<Grid container spacing={3}>
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <BookCard book={book} />
  </Grid>
</Grid>
```

### ❌ ใช้สีและ spacing แบบกระจัดกระจาย

```jsx
<Button sx={{ backgroundColor: '#173A5E', margin: '19px' }} />
```

### ✅ ใช้ token ของ theme

```jsx
<Button sx={{ bgcolor: 'primary.main', m: 2 }} variant="contained" />
```

### ❌ ใช้ icon-only action โดยไม่มี label

```jsx
<IconButton>
  <FavoriteBorderIcon />
</IconButton>
```

### ✅ ระบุ accessible label

```jsx
<IconButton aria-label="เพิ่มหนังสือในรายการโปรด">
  <FavoriteBorderIcon />
</IconButton>
```

## 17. Verification checklist

- [ ] ทุกหน้าอยู่ใต้ `ThemeProvider`
- [ ] ใช้ MUI components เป็น layout และ interaction foundation
- [ ] ไม่มี Bootstrap/Tailwind หรือ UI library ซ้ำโดยไม่มีเหตุผล
- [ ] สี, typography, spacing และ radius มาจาก theme
- [ ] MUI icons มี accessible label
- [ ] Header และ mobile drawer ใช้งานได้
- [ ] Search field submit ด้วย Enter ได้
- [ ] Form มี label, validation และ helper/error text
- [ ] Book cards responsive และมี fallback image
- [ ] Product Detail ใช้ rating, condition, seller และ CTA ครบ
- [ ] Cart ใช้ list, quantity control และ feedback ที่เหมาะสม
- [ ] SweetAlert2 ใช้กับ confirmation/success ที่จำเป็น
- [ ] ไม่มี native `alert()`, `confirm()` หรือ `prompt()`
- [ ] ไม่มี horizontal scroll ที่ mobile
- [ ] keyboard tab ผ่าน header, search, cards, filters และ cart ได้
- [ ] `npm run build` และ `npm run lint` ผ่าน

## 18. Official references

- [Material UI — All Components](https://mui.com/material-ui/all-components/)
- [Material UI — Theming](https://mui.com/material-ui/customization/theming/)
- [Material UI — Breakpoints](https://mui.com/material-ui/customization/breakpoints/)
- [Material UI — Icons](https://mui.com/material-ui/icons/)
- [Material UI — Text Field](https://mui.com/material-ui/react-text-field/)
- [Material UI — Drawer](https://mui.com/material-ui/react-drawer/)
- [Material UI — Dialog](https://mui.com/material-ui/react-dialog/)
- [BookLoop Technology Stack](./TechnologyStack.md)
