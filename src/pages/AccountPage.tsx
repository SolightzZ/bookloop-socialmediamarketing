import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Stack,
  Tooltip,
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  PersonOutlined as ProfileIcon,
  ShoppingBagOutlined as OrdersIcon,
  FavoriteBorder as WishlistIcon,
  MenuBook as MyBooksIcon,
  SettingsOutlined as SettingsIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  LocalShippingRounded as ShippingIcon,
  AddShoppingCart as AddCartIcon,
  DeleteOutlined as DeleteIcon,
  Add as AddIcon,
  Lock as LockIcon,
  PauseCircleOutlined as PauseIcon,
  PlayCircleOutlined as PlayIcon,
  Tune as TuneIcon,
  ChevronRight as ChevronRightIcon,
  PhotoCamera as CameraIcon,
  Close as CloseIcon,
  VisibilityOutlined as ViewIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { authService, UserAccountData } from '../services/authService';
import { getApiBaseUrl } from '../services/apiClient';
import { orderService } from '../services/orderService';
import { listingService, resolveImageUrl } from '../services/listingService';
import { UserListedBook } from '../types/auth';
import { formatCurrency } from '../utils/formatCurrency';
import { logWarn } from '../utils/logger';
import { showSuccess, showConfirm, showToast } from '../utils/alerts';
import { compressImageToDataUrl } from '../utils/imageCompressor';
import { PasswordInput } from '../components/auth/PasswordInput';
import { BookCard } from '../components/BookCard';
import { getCategoryThaiName } from '../data/onboarding';
import { tokens } from '../theme/tokens';

/**
 * BOOKLOOP ACCOUNT PAGE — BLUE RING MOBILE-FIRST REDESIGN
 * Palette:
 * Primary Blue: #1976D2
 * Deep Navy: #102A43
 * Soft Blue: #EAF4FF
 * Page Background: #F7F9FC
 * Divider: #E5EAF0
 * Muted Text: #718096
 * Danger: #E53935
 */
const BLUE_RING = {
  primary: '#1976D2',
  navy: '#102A43',
  softBlue: '#EAF4FF',
  bg: '#F7F9FC',
  divider: '#E5EAF0',
  muted: '#718096',
  danger: '#E53935',
} as const;

/**
 * Subtle Blue Ring background decoration component
 * Thin circular geometry, translucent partial rings, soft radial glow
 */
const BlueRingGraphic: React.FC<{ variant?: 'hero' | 'card' }> = ({ variant = 'hero' }) => {
  if (variant === 'card') {
    return (
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 130,
          height: 130,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <svg width="130" height="130" viewBox="0 0 130 130" fill="none">
          <circle cx="65" cy="65" r="36" stroke="#1976D2" strokeWidth="1" strokeOpacity="0.12" />
          <circle cx="65" cy="65" r="54" stroke="#1976D2" strokeWidth="1" strokeOpacity="0.06" strokeDasharray="3 3" />
        </svg>
      </Box>
    );
  }

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id="heroBlueGlow" cx="50%" cy="32%" r="48%">
            <stop offset="0%" stopColor="#1976D2" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#1976D2" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroBlueGlow)" />
        <circle cx="200" cy="56" r="48" fill="none" stroke="#1976D2" strokeWidth="1.2" strokeOpacity="0.14" />
        <circle cx="200" cy="56" r="78" fill="none" stroke="#1976D2" strokeWidth="1" strokeOpacity="0.08" strokeDasharray="4 4" />
        <circle cx="200" cy="56" r="114" fill="none" stroke="#1976D2" strokeWidth="1" strokeOpacity="0.05" />
        <circle cx="20" cy="30" r="52" fill="none" stroke="#1976D2" strokeWidth="1" strokeOpacity="0.05" />
        <circle cx="380" cy="210" r="72" fill="none" stroke="#1976D2" strokeWidth="1" strokeOpacity="0.04" />
      </svg>
    </Box>
  );
};

export default function AccountPage() {
  const { user, updateProfile, changePassword, logout, deleteAccount } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL path
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/orders')) return 1;
    if (path.includes('/wishlist')) return 2;
    if (path.includes('/books')) return 3;
    if (path.includes('/settings')) return 4;
    return 0; // profile
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());
  const [userData, setUserData] = useState<UserAccountData | null>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio && user.bio !== 'สมาชิกรักการอ่านแห่ง BookLoop' ? user.bio : '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [subdistrict, setSubdistrict] = useState(user?.address?.subdistrict || '');
  const [district, setDistrict] = useState(user?.address?.district || '');
  const [province, setProvince] = useState(user?.address?.province || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notification Settings State
  const [notifyOrder, setNotifyOrder] = useState(true);
  const [notifyPromo, setNotifyPromo] = useState(false);
  const [notifyBookUpdates, setNotifyBookUpdates] = useState(true);

  // Newsletter Subscribe State
  const [isEmailSubscribed, setIsEmailSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');

  // Delete Account State
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Seller Listing Management State
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editPriceInput, setEditPriceInput] = useState<string>('');

  // Edit Listing Dialog State
  const [editingBook, setEditingBook] = useState<UserListedBook | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editCondition, setEditCondition] = useState('');
  const [editCover, setEditCover] = useState('');
  const [isUpdatingListing, setIsUpdatingListing] = useState(false);

  // View listing detail modal state
  const [viewingBook, setViewingBook] = useState<UserListedBook | null>(null);

  const handleOpenViewDetails = (item: UserListedBook) => {
    setViewingBook(item);
  };

  const handleEditFromViewModal = (item: UserListedBook) => {
    setViewingBook(null);
    handleOpenEditDialog(item);
  };

  const handleOpenEditDialog = (item: UserListedBook) => {
    setEditingBook(item);
    setEditTitle(item.title);
    setEditAuthor(item.author || '');
    setEditPrice(String(item.price));
    setEditOriginalPrice(item.originalPrice ? String(item.originalPrice) : '');
    setEditCategory(item.category || 'ทั่วไป');
    setEditCondition(item.condition || 'ดีมาก');
    setEditCover(item.cover || '');
  };

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageToDataUrl(file, {
        maxDimension: 1280,
        maxSizeBytes: 480 * 1024,
      });
      setEditCover(compressed);
    } catch (err: any) {
      showToast('เกิดข้อผิดพลาด', err?.message || 'ไม่สามารถประมวลผลรูปภาพได้', 'error');
    }
  };

  const handleSaveListingDetails = async () => {
    if (!user || !userData || !editingBook) return;
    const parsedPrice = parseFloat(editPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      showToast('กรุณากรอกราคาที่ถูกต้อง', 'ราคาต้องมากกว่า 0 บาท', 'warning');
      return;
    }
    if (!editTitle.trim()) {
      showToast('กรุณากรอกชื่อหนังสือ', 'ชื่อหนังสือต้องไม่เว้นว่าง', 'warning');
      return;
    }

    setIsUpdatingListing(true);
    try {
      const parsedOriginal = editOriginalPrice ? parseFloat(editOriginalPrice) : undefined;
      // 1. ส่งไปอัปเดตที่ backend
      await listingService.updateListing(editingBook.id, {
        title: editTitle.trim(),
        author: editAuthor.trim(),
        price: Math.round(parsedPrice),
        originalPrice: parsedOriginal && !isNaN(parsedOriginal) ? Math.round(parsedOriginal) : undefined,
        category: editCategory,
        condition: editCondition,
        image: editCover,
      });

      // 2. อัปเดตในเครื่อง
      const updatedBooks: UserListedBook[] = userData.listedBooks.map((b) => {
        if (b.id === editingBook.id) {
          return {
            ...b,
            title: editTitle.trim(),
            author: editAuthor.trim(),
            price: Math.round(parsedPrice),
            originalPrice: parsedOriginal && !isNaN(parsedOriginal) ? Math.round(parsedOriginal) : undefined,
            category: editCategory,
            condition: editCondition,
            cover: editCover || b.cover,
          };
        }
        return b;
      });

      const updatedData: UserAccountData = { ...userData, listedBooks: updatedBooks };
      setUserData(updatedData);
      authService.saveUserData(user.id, { listedBooks: updatedBooks });
      showToast('บันทึกการแก้ไขสำเร็จ', 'อัปเดตข้อมูลและรูปภาพหนังสือเรียบร้อยแล้ว');
      setEditingBook(null);
    } catch (err: any) {
      logWarn('handleSaveListingDetails error', err);
      showToast('เกิดข้อผิดพลาด', err?.message || 'ไม่สามารถบันทึกการแก้ไขได้', 'error');
    } finally {
      setIsUpdatingListing(false);
    }
  };

  const handleToggleListingStatus = (bookId: string) => {
    if (!user || !userData) return;
    const updatedBooks: UserListedBook[] = userData.listedBooks.map((b) => {
      if (b.id === bookId) {
        const nextStatus: 'active' | 'paused' = b.status === 'active' ? 'paused' : 'active';
        return { ...b, status: nextStatus };
      }
      return b;
    });

    const newStatus = updatedBooks.find((b) => b.id === bookId)?.status;
    const updatedData: UserAccountData = { ...userData, listedBooks: updatedBooks };
    setUserData(updatedData);
    authService.saveUserData(user.id, { listedBooks: updatedBooks });
    showToast(
      'อัปเดตสถานะสำเร็จ',
      newStatus === 'active' ? 'เปิดวางขายหนังสือเล่มนี้แล้ว' : 'พักการขายหนังสือเล่มนี้ชั่วคราว'
    );
  };

  const handleSaveListingPrice = (bookId: string) => {
    if (!user || !userData) return;
    const parsedPrice = parseFloat(editPriceInput);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      showToast('กรุณากรอกราคาที่ถูกต้อง', 'ราคาต้องมากกว่า 0 บาท', 'warning');
      return;
    }

    const updatedBooks: UserListedBook[] = userData.listedBooks.map((b) => {
      if (b.id === bookId) {
        return { ...b, price: Math.round(parsedPrice) };
      }
      return b;
    });

    const updatedData: UserAccountData = { ...userData, listedBooks: updatedBooks };
    setUserData(updatedData);
    authService.saveUserData(user.id, { listedBooks: updatedBooks });
    showToast('แก้ไขราคาสำเร็จ', `ปรับราคาเป็น ฿${Math.round(parsedPrice).toLocaleString()} เรียบร้อยแล้ว`);
    setEditingBookId(null);
  };

  const handleDeleteListing = async (bookId: string, bookTitle: string) => {
    if (!user || !userData) return;
    const result = await showConfirm(
      'ยืนยันการลบรายการ?',
      `คุณแน่ใจหรือไม่ว่าต้องการลบ "${bookTitle}" ออกจากรายการวางขาย การดำเนินการนี้ไม่สามารถยกเลิกได้`,
      'ลบรายการ',
      'ยกเลิก'
    );

    if (result.isConfirmed) {
      const updatedBooks = userData.listedBooks.filter((b) => b.id !== bookId);
      const updatedData = { ...userData, listedBooks: updatedBooks };
      setUserData(updatedData);
      authService.saveUserData(user.id, { listedBooks: updatedBooks });
      showToast('ลบรายการสำเร็จ', 'นำหนังสือออกจากรายการขายแล้ว');
    }
  };

  // Sync tab with path
  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  // Load user data
  useEffect(() => {
    if (user) {
      const data = authService.getUserData(user.id);
      setUserData(data);
      setName(user.name || '');
      setPhone(user.phone || '');
      setBio(user.bio && user.bio !== 'สมาชิกรักการอ่านแห่ง BookLoop' ? user.bio : '');
      setStreet(user.address?.street || '');
      setSubdistrict(user.address?.subdistrict || '');
      setDistrict(user.address?.district || '');
      setProvince(user.address?.province || '');
      setPostalCode(user.address?.postalCode || '');

      // Check newsletter status
      const API_BASE = getApiBaseUrl();
      fetch(`${API_BASE}/newsletter_status.php?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            setIsEmailSubscribed(result.subscribed);
          }
        })
        .catch((e) => {
          logWarn('AccountPage: newsletter_status check failed', e);
        });

      // Refresh orders
      orderService
        .refreshUserOrders(user.id)
        .then(() => {
          setUserData(authService.getUserData(user.id));
        })
        .catch((e) => {
          logWarn('AccountPage: refreshUserOrders failed', e);
        });

      // Refresh my listed books from backend
      listingService
        .getMyListings()
        .then((myListings) => {
          if (myListings && myListings.length > 0) {
            const currentData = authService.getUserData(user.id);
            const existingMap = new Map((currentData.listedBooks || []).map((b) => [b.id, b]));
            const mergedListedBooks: UserListedBook[] = myListings.map((l) => {
              const existing = existingMap.get(l.id);
              return {
                id: l.id,
                title: l.title,
                author: l.author || 'ไม่ระบุผู้แต่ง',
                price: Number(l.price),
                originalPrice: l.originalPrice ? Number(l.originalPrice) : undefined,
                condition: l.condition,
                category: l.category,
                cover: l.image && l.image.trim() !== '' ? l.image : 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80',
                dateListed: l.createdAt ? l.createdAt.split('T')[0] : (existing?.dateListed || '2026-10-04'),
                status: l.status,
                views: existing?.views || 0,
              };
            });
            authService.saveUserData(user.id, { listedBooks: mergedListedBooks });
            setUserData(authService.getUserData(user.id));
          }
        })
        .catch((e) => {
          logWarn('AccountPage: refreshMyListings failed', e);
        });
    }
  }, [user]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    const paths = ['/account/profile', '/account/orders', '/account/wishlist', '/account/books', '/account/settings'];
    navigate(paths[newValue] || '/account');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSavingProfile(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        address: {
          recipientName: name.trim(),
          phone: phone.trim(),
          street: street.trim(),
          subdistrict: subdistrict.trim(),
          district: district.trim(),
          province: province.trim(),
          postalCode: postalCode.trim(),
        },
      });
      setIsEditingProfile(false);
      showSuccess('บันทึกข้อมูลเรียบร้อย', 'อัปเดตข้อมูลบัญชีของคุณแล้ว');
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!oldPassword || !newPassword) {
      setPasswordError('กรุณากรอกรหัสผ่านให้ครบถ้วน');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('รหัสผ่านยืนยันไม่ตรงกัน');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(oldPassword, newPassword);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showSuccess('เปลี่ยนรหัสผ่านสำเร็จ', 'รหัสผ่านของคุณได้รับการอัปเดตแล้ว');
    } catch (err: any) {
      setPasswordError(err.message || 'รหัสผ่านปัจจุบันไม่ถูกต้อง');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSubscribeNewsletter = async () => {
    setIsSubscribing(true);
    setSubscribeMessage('');
    try {
      const API_BASE_URL = getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/subscribe_newsletter.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        credentials: 'include',
        body: JSON.stringify({ email: user?.email }),
      });
      const result = await response.json();
      if (result.success) {
        setIsEmailSubscribed(true);
        setSubscribeMessage('สมัครสำเร็จ! กรุณาตรวจสอบอีเมลของคุณ');
        showSuccess('สมัครสำเร็จ', 'ส่งอีเมลต้อนรับไปยังกล่องจดหมายของคุณแล้ว');
      } else {
        setSubscribeMessage(result.message || 'เกิดข้อผิดพลาด');
      }
    } catch (e) {
      logWarn('AccountPage: subscribe_newsletter failed', e);
      setSubscribeMessage('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleUnsubscribeNewsletter = async () => {
    setIsSubscribing(true);
    setSubscribeMessage('');
    try {
      const API_BASE_URL = getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/newsletter_status.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        credentials: 'include',
        body: JSON.stringify({ email: user?.email, _method: 'DELETE' }),
      });
      const result = await response.json();
      if (result.success) {
        setIsEmailSubscribed(false);
        setSubscribeMessage('ยกเลิกการสมัครรับข่าวสารแล้ว');
        showSuccess('ยกเลิกสำเร็จ', 'คุณจะไม่ได้รับข่าวสารจาก BookLoop อีก');
      } else {
        setSubscribeMessage(result.message || 'เกิดข้อผิดพลาด');
      }
    } catch (e) {
      logWarn('AccountPage: unsubscribe_newsletter failed', e);
      setSubscribeMessage('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);

    if (!deletePassword) {
      setDeleteError('กรุณากรอกรหัสผ่านเพื่อยืนยันการลบบัญชี');
      return;
    }

    const result = await showConfirm(
      'ลบบัญชีถาวร?',
      'การลบบัญชีจะลบข้อมูลส่วนตัว ประวัติคำสั่งซื้อ รายการโปรด และหนังสือที่ลงขายทั้งหมดออกจากระบบอย่างถาวร การดำเนินการนี้ไม่สามารถย้อนกลับได้',
      'ลบบัญชีถาวร',
      'ยกเลิก'
    );

    if (!result.isConfirmed) return;

    setIsDeletingAccount(true);
    try {
      await deleteAccount(deletePassword);
      setDeletePassword('');
      showSuccess('ลบบัญชีสำเร็จ', 'ขอบคุณที่ใช้บริการ BookLoop ของเรา');
      navigate('/');
    } catch (err: any) {
      setDeleteError(err.message || 'ไม่สามารถลบบัญชีได้ รหัสผ่านอาจไม่ถูกต้อง');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (!user) return null;

  // Mobile Vertical Account Menu: 1 to 5 in exact order
  const mobileNavItems = [
    { id: 0, label: 'ข้อมูลบัญชี', path: '/account/profile', icon: ProfileIcon },
    { id: 1, label: `คำสั่งซื้อ (${userData?.orders?.length || 0})`, path: '/account/orders', icon: OrdersIcon },
    { id: 2, label: `รายการโปรด (${wishlist.length})`, path: '/account/wishlist', icon: WishlistIcon },
    { id: 3, label: `หนังสือของฉัน (${userData?.listedBooks?.length || 0})`, path: '/account/books', icon: MyBooksIcon },
    { id: 4, label: 'ตั้งค่าบัญชี', path: '/account/settings', icon: SettingsIcon },
  ];

  return (
    <Box sx={{ bgcolor: BLUE_RING.bg, minHeight: '100vh', pt: { xs: 2, sm: 3, md: 4 }, pb: { xs: 6, sm: 7, md: 8 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* ================================================== */}
        {/* 4. PROFILE HERO                                   */}
        {/* ================================================== */}
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            p: { xs: 3, sm: 3.5, md: 4 },
            borderRadius: '20px',
            border: `1px solid ${BLUE_RING.divider}`,
            bgcolor: '#FFFFFF',
            mb: { xs: 2, sm: 2.5 },
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(16, 42, 67, 0.03)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <BlueRingGraphic variant="hero" />

          {/* Circular Avatar with Navy circle & overlapping small blue edit icon */}
          <Box sx={{ position: 'relative', mb: 1.75 }}>
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{
                width: { xs: 72, sm: 76 },
                height: { xs: 72, sm: 76 },
                bgcolor: BLUE_RING.navy,
                color: '#FFFFFF',
                fontSize: '1.85rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(16, 42, 67, 0.12)',
                border: '3px solid #FFFFFF',
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'W'}
            </Avatar>

            <IconButton
              size="small"
              onClick={() => {
                setActiveTab(0);
                setIsEditingProfile(true);
              }}
              aria-label="แก้ไขโปรไฟล์"
              sx={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 28,
                height: 28,
                bgcolor: BLUE_RING.primary,
                color: '#FFFFFF',
                border: '2px solid #FFFFFF',
                boxShadow: '0 2px 6px rgba(25, 118, 210, 0.3)',
                '&:hover': { bgcolor: '#1565C0' },
              }}
            >
              <EditIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Box>

          {/* User Name */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: BLUE_RING.navy,
              fontSize: { xs: '1.25rem', sm: '1.4rem' },
              lineHeight: 1.3,
              mb: 0.5,
              wordBreak: 'break-word',
            }}
          >
            {user.name}
          </Typography>

          {/* User Email */}
          <Typography
            variant="body2"
            sx={{
              color: BLUE_RING.muted,
              fontSize: '0.875rem',
              mb: 1,
              wordBreak: 'break-word',
            }}
          >
            {user.email}
          </Typography>

          {/* Join Date */}
          <Typography
            variant="caption"
            sx={{
              color: '#94A3B8',
              fontSize: '0.75rem',
              display: 'block',
            }}
          >
            เข้าร่วมเมื่อ:{' '}
            {new Date(user.createdAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Paper>

        {/* ================================================== */}
        {/* 5. MOBILE VERTICAL ACCOUNT MENU (< 768px / md:none) */}
        {/* Dedicated full-width vertical menu with 5 items     */}
        {/* Order: 1.ข้อมูลบัญชี 2.คำสั่งซื้อ 3.รายการโปรด       */}
        {/*        4.หนังสือของฉัน 5.ตั้งค่าบัญชี                */}
        {/* ================================================== */}
        <Paper
          elevation={0}
          component="nav"
          aria-label="เมนูบัญชีผู้ใช้บนมือถือ"
          sx={{
            display: { xs: 'flex', md: 'none' },
            flexDirection: 'column',
            borderRadius: '16px',
            border: `1px solid ${BLUE_RING.divider}`,
            bgcolor: '#FFFFFF',
            overflow: 'hidden',
            mb: 2.5,
            boxShadow: '0 2px 8px rgba(16, 42, 67, 0.02)',
          }}
        >
          {mobileNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLast = index === mobileNavItems.length - 1;

            return (
              <React.Fragment key={item.id}>
                <ButtonBase
                  onClick={() => {
                    setActiveTab(item.id);
                    navigate(item.path);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  sx={{
                    width: '100%',
                    minHeight: { xs: '54px', sm: '56px' },
                    px: 2, // 16px horizontal padding
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: isActive ? BLUE_RING.softBlue : 'transparent',
                    transition: 'background-color 160ms ease',
                    // STRICTLY FORBIDDEN:
                    // NO left border, NO accent bar, NO vertical blue line, NO Offset Outline, NO double border, NO heavy outline
                    borderLeft: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    textAlign: 'left',
                    '&:hover': {
                      bgcolor: isActive ? BLUE_RING.softBlue : 'rgba(16, 42, 67, 0.02)',
                    },
                    '&:active': {
                      bgcolor: isActive ? '#E2EEFC' : 'rgba(16, 42, 67, 0.05)',
                    },
                    '&:focus-visible': {
                      outline: '2px solid rgba(25, 118, 210, 0.3)',
                      outlineOffset: '-2px',
                    },
                  }}
                >
                  {/* Left: Icon area (40-44px) + Label */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                    {/* Icon area: 40px circular container with Blue Ring on active */}
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: isActive ? '#FFFFFF' : '#F7F9FC',
                        border: isActive
                          ? '1.5px solid rgba(25, 118, 210, 0.28)'
                          : `1px solid ${BLUE_RING.divider}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: isActive ? '0 1px 4px rgba(25, 118, 210, 0.12)' : 'none',
                        transition: 'all 160ms ease',
                      }}
                    >
                      <Icon
                        sx={{
                          fontSize: 20,
                          color: isActive ? BLUE_RING.primary : BLUE_RING.muted,
                          transition: 'color 160ms ease',
                        }}
                      />
                    </Box>

                    {/* Label */}
                    <Typography
                      sx={{
                        fontSize: '0.925rem',
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? BLUE_RING.navy : BLUE_RING.navy,
                        lineHeight: 1.4,
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>

                  {/* Right: Chevron */}
                  <ChevronRightIcon
                    sx={{
                      fontSize: 20,
                      color: isActive ? BLUE_RING.primary : '#A0AEC0',
                      flexShrink: 0,
                      transition: 'color 160ms ease',
                    }}
                  />
                </ButtonBase>

                {/* Subtle row separation */}
                {!isLast && <Divider sx={{ borderColor: BLUE_RING.divider }} />}
              </React.Fragment>
            );
          })}
        </Paper>

        {/* ================================================== */}
        {/* DESKTOP ACCOUNT NAVIGATION TABS (>= 768px)         */}
        {/* ================================================== */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 3 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: `1px solid ${BLUE_RING.divider}`,
              bgcolor: '#FFFFFF',
              overflow: 'hidden',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: 2,
                '& .MuiTabs-indicator': {
                  bgcolor: BLUE_RING.primary,
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.925rem',
                  py: 2,
                  px: 3,
                  minHeight: 52,
                  color: BLUE_RING.muted,
                  '&.Mui-selected': {
                    color: BLUE_RING.primary,
                    fontWeight: 700,
                  },
                },
              }}
            >
              <Tab icon={<ProfileIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="ข้อมูลบัญชี" />
              <Tab
                icon={<OrdersIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label={`คำสั่งซื้อ (${userData?.orders?.length || 0})`}
              />
              <Tab
                icon={<WishlistIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label={`รายการโปรด (${wishlist.length})`}
              />
              <Tab
                icon={<MyBooksIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label={`หนังสือของฉัน (${userData?.listedBooks?.length || 0})`}
              />
              <Tab icon={<SettingsIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="ตั้งค่าบัญชี" />
            </Tabs>
          </Paper>
        </Box>

        {/* ================================================== */}
        {/* TAB 0: ข้อมูลบัญชี (Profile View & Edit)            */}
        {/* ================================================== */}
        {activeTab === 0 && (
          <Stack spacing={{ xs: 2, sm: 2.5 }}>
            {/* 6. PERSONAL INFORMATION */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: '20px',
                border: `1px solid ${BLUE_RING.divider}`,
                bgcolor: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(16, 42, 67, 0.02)',
              }}
            >
              {/* Header: Title + Edit Button */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  mb: 2.5,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: BLUE_RING.navy,
                    fontSize: { xs: '1.05rem', sm: '1.2rem' },
                  }}
                >
                  ข้อมูลส่วนตัวและที่อยู่จัดส่ง
                </Typography>

                {!isEditingProfile ? (
                  <ButtonBase
                    onClick={() => setIsEditingProfile(true)}
                    sx={{
                      minHeight: '44px',
                      px: 2,
                      borderRadius: '12px',
                      bgcolor: BLUE_RING.softBlue,
                      color: BLUE_RING.primary,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      border: '1px solid rgba(25, 118, 210, 0.15)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      transition: 'background-color 160ms ease',
                      '&:hover': { bgcolor: '#DBECFF' },
                    }}
                  >
                    <EditIcon sx={{ fontSize: 16 }} />
                    <span>แก้ไขข้อมูล</span>
                  </ButtonBase>
                ) : (
                  <ButtonBase
                    onClick={() => setIsEditingProfile(false)}
                    sx={{
                      minHeight: '44px',
                      px: 2,
                      borderRadius: '12px',
                      bgcolor: '#F1F5F9',
                      color: BLUE_RING.muted,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      '&:hover': { bgcolor: '#E2E8F0' },
                    }}
                  >
                    <CancelIcon sx={{ fontSize: 16 }} />
                    <span>ยกเลิก</span>
                  </ButtonBase>
                )}
              </Box>

              {!isEditingProfile ? (
                <Grid container spacing={{ xs: 2.5, md: 4 }}>
                  {/* Left Column: Personal Information (One-column layout on mobile) */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: BLUE_RING.muted, fontWeight: 600, display: 'block', mb: 0.5 }}>
                        ชื่อ-นามสกุล
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: BLUE_RING.navy }}>
                        {user.name}
                      </Typography>
                    </Box>
                    <Divider sx={{ borderColor: BLUE_RING.divider, my: 1.5 }} />

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: BLUE_RING.muted, fontWeight: 600, display: 'block', mb: 0.5 }}>
                        อีเมล
                      </Typography>
                      <Typography variant="body1" sx={{ color: BLUE_RING.navy, fontWeight: 600 }}>
                        {user.email}
                      </Typography>
                    </Box>
                    <Divider sx={{ borderColor: BLUE_RING.divider, my: 1.5 }} />

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: BLUE_RING.muted, fontWeight: 600, display: 'block', mb: 0.5 }}>
                        เบอร์โทรศัพท์
                      </Typography>
                      <Typography variant="body1" sx={{ color: user.phone ? BLUE_RING.navy : BLUE_RING.muted, fontWeight: 600 }}>
                        {user.phone || 'ยังไม่ได้ระบุ'}
                      </Typography>
                    </Box>
                    <Divider sx={{ borderColor: BLUE_RING.divider, my: 1.5 }} />

                    <Box>
                      <Typography variant="caption" sx={{ color: BLUE_RING.muted, fontWeight: 600, display: 'block', mb: 0.5 }}>
                        คำแนะนำตัว (Bio)
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: user.bio && user.bio !== 'สมาชิกรักการอ่านแห่ง BookLoop' ? BLUE_RING.navy : BLUE_RING.muted,
                          fontWeight: 600,
                        }}
                      >
                        {user.bio && user.bio !== 'สมาชิกรักการอ่านแห่ง BookLoop' ? user.bio : 'ยังไม่ได้ระบุ'}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Right Column: 7. SHIPPING ADDRESS (Compact informational surface with Blue Ring) */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        p: { xs: 2.5, sm: 3 },
                        borderRadius: '16px',
                        bgcolor: BLUE_RING.softBlue,
                        border: '1px solid rgba(25, 118, 210, 0.15)',
                      }}
                    >
                      <BlueRingGraphic variant="card" />

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            bgcolor: '#FFFFFF',
                            border: '1px solid rgba(25, 118, 210, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ShippingIcon sx={{ color: BLUE_RING.primary, fontSize: 20 }} />
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: BLUE_RING.navy, fontSize: '0.95rem' }}>
                          ที่อยู่เริ่มต้นสำหรับจัดส่งหนังสือ
                        </Typography>
                      </Box>

                      {user.address?.street ? (
                        <Typography variant="body2" sx={{ color: BLUE_RING.navy, lineHeight: 1.65 }}>
                          <strong>{user.address.recipientName || user.name}</strong>
                          <br />
                          {user.address.street} {user.address.subdistrict}
                          <br />
                          {user.address.district} {user.address.province} {user.address.postalCode}
                          <br />
                          โทร: {user.address.phone || user.phone || '-'}
                        </Typography>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#486581', lineHeight: 1.6, fontSize: '0.875rem' }}>
                          ยังไม่มีที่อยู่จัดส่งที่บันทึกไว้ กดปุ่ม "แก้ไขข้อมูล" เพื่อเพิ่มที่อยู่สำหรับการสั่งซื้อที่รวดเร็วยิ่งขึ้น
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              ) : (
                /* Profile Edit Form */
                <Box component="form" onSubmit={handleSaveProfile}>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="ชื่อ-นามสกุล"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="เบอร์โทรศัพท์"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08X-XXX-XXXX"
                        size="small"
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="คำแนะนำตัว (Bio)"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        multiline
                        rows={2}
                        size="small"
                      />
                    </Grid>

                    <Grid size={12}>
                      <Divider sx={{ my: 1 }}>
                        <Chip label="ที่อยู่จัดส่งสินค้า" size="small" />
                      </Divider>
                    </Grid>

                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="ที่อยู่ (บ้านเลขที่ / ถนน / ซอย / หมู่บ้าน)"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="แขวง / ตำบล"
                        value={subdistrict}
                        onChange={(e) => setSubdistrict(e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="เขต / อำเภอ"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="จังหวัด"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="รหัสไปรษณีย์"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        size="small"
                      />
                    </Grid>

                    <Grid size={12} sx={{ mt: 1, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSavingProfile}
                        startIcon={isSavingProfile ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                        sx={{
                          borderRadius: '12px',
                          px: 3,
                          minHeight: '48px',
                          fontWeight: 700,
                          bgcolor: BLUE_RING.primary,
                          '&:hover': { bgcolor: '#1565C0' },
                        }}
                      >
                        {isSavingProfile ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setIsEditingProfile(false)}
                        sx={{
                          borderRadius: '12px',
                          px: 2.5,
                          minHeight: '44px',
                          color: BLUE_RING.muted,
                          borderColor: BLUE_RING.divider,
                        }}
                      >
                        ยกเลิก
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>

            {/* 8. INTEREST SECTION */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: '16px',
                bgcolor: '#FFFFFF',
                border: `1px solid ${BLUE_RING.divider}`,
                boxShadow: '0 2px 8px rgba(16, 42, 67, 0.02)',
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: BLUE_RING.navy,
                    fontSize: '1rem',
                    mb: 0.5,
                  }}
                >
                  ความสนใจของฉัน
                </Typography>
                {user.preferences?.categories && user.preferences.categories.length > 0 ? (
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ color: BLUE_RING.muted, fontSize: '0.85rem', mb: 1 }}>
                      หมวดที่คุณเลือกไว้สำหรับแนะนำหนังสือ:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {user.preferences.categories.map((catId) => (
                        <Chip
                          key={catId}
                          label={getCategoryThaiName(catId)}
                          size="small"
                          sx={{
                            bgcolor: BLUE_RING.softBlue,
                            color: BLUE_RING.primary,
                            border: '1px solid rgba(25, 118, 210, 0.2)',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            borderRadius: '8px',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography sx={{ color: BLUE_RING.navy, fontWeight: 600, fontSize: '0.9rem', mb: 0.25 }}>
                      ยังไม่ได้เลือกหมวดที่ชอบ
                    </Typography>
                    <Typography sx={{ color: BLUE_RING.muted, fontSize: '0.85rem', lineHeight: 1.5 }}>
                      เลือกความสนใจเพื่อให้ BookLoop แนะนำหนังสือที่ตรงกับคุณมากขึ้น
                    </Typography>
                  </Box>
                )}
              </Box>

              <ButtonBase
                onClick={() => navigate('/onboarding?edit=1')}
                sx={{
                  minHeight: '48px',
                  width: '100%',
                  p: 1.5,
                  borderRadius: '12px',
                  border: `1px solid ${BLUE_RING.divider}`,
                  bgcolor: '#F7F9FC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 160ms ease',
                  '&:hover': {
                    bgcolor: BLUE_RING.softBlue,
                    borderColor: 'rgba(25, 118, 210, 0.25)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TuneIcon sx={{ fontSize: 18, color: BLUE_RING.primary }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: BLUE_RING.navy }}>
                    ปรับความสนใจของคุณ
                  </Typography>
                </Box>
                <ChevronRightIcon sx={{ fontSize: 18, color: BLUE_RING.muted }} />
              </ButtonBase>
            </Paper>
          </Stack>
        )}

        {/* ================================================== */}
        {/* TAB 1: ประวัติคำสั่งซื้อ (Orders History)             */}
        {/* ================================================== */}
        {activeTab === 1 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5, md: 4 },
              borderRadius: '20px',
              border: `1px solid ${BLUE_RING.divider}`,
              bgcolor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(16, 42, 67, 0.02)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: BLUE_RING.navy, mb: 3 }}>
              ประวัติคำสั่งซื้อ ({userData?.orders?.length || 0} รายการ)
            </Typography>

            {!userData?.orders || userData.orders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <OrdersIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: BLUE_RING.muted, mb: 1 }}>
                  ยังไม่มีประวัติคำสั่งซื้อ
                </Typography>
                <Typography variant="body2" sx={{ color: BLUE_RING.muted, mb: 3 }}>
                  เลือกชมหนังสือดีๆ สภาพเหมือนใหม่ในราคาประหยัดได้เลย
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/books')}
                  sx={{
                    borderRadius: '12px',
                    minHeight: '48px',
                    px: 3,
                    fontWeight: 700,
                    bgcolor: BLUE_RING.primary,
                    '&:hover': { bgcolor: '#1565C0' },
                  }}
                >
                  สำรวจหนังสือทั้งหมด
                </Button>
              </Box>
            ) : (
              <Stack spacing={2.5}>
                {userData.orders.map((order) => {
                  const statusConfig = {
                    delivered: { label: 'จัดส่งสำเร็จแล้ว', color: 'success' as const },
                    shipped: { label: 'อยู่ระหว่างจัดส่ง', color: 'info' as const },
                    processing: { label: 'กำลังเตรียมจัดส่ง', color: 'warning' as const },
                    pending: { label: 'รอดำเนินการ', color: 'default' as const },
                    cancelled: { label: 'ยกเลิกแล้ว', color: 'error' as const },
                  }[order.status] || { label: order.status, color: 'default' as const };

                  return (
                    <Paper
                      key={order.id}
                      elevation={0}
                      sx={{
                        p: { xs: 2.5, sm: 3 },
                        borderRadius: '16px',
                        border: `1px solid ${BLUE_RING.divider}`,
                        bgcolor: '#FFFFFF',
                      }}
                    >
                      {/* Order Header */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 1.5,
                          pb: 2,
                          borderBottom: '1px solid #F1F5F9',
                          mb: 2,
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: BLUE_RING.navy }}>
                            คำสั่งซื้อ {order.id}
                          </Typography>
                          <Typography variant="caption" sx={{ color: BLUE_RING.muted }}>
                            สั่งซื้อเมื่อ:{' '}
                            {new Date(order.date).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Chip
                            label={statusConfig.label}
                            color={statusConfig.color}
                            size="small"
                            sx={{ fontWeight: 700, borderRadius: '8px' }}
                          />
                          {order.trackingNumber && (
                            <Tooltip title={`พัสดุ: ${order.shippingCarrier || ''}`}>
                              <Chip
                                icon={<ShippingIcon sx={{ fontSize: 16 }} />}
                                label={`เลขพัสดุ: ${order.trackingNumber}`}
                                variant="outlined"
                                size="small"
                                sx={{ borderRadius: '8px', fontSize: '0.75rem' }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </Box>

                      {/* Order Items */}
                      <Stack spacing={2} sx={{ mb: 2.5 }}>
                        {order.items.map((item, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <Box
                              component="img"
                              src={item.cover}
                              alt={item.title}
                              sx={{
                                width: 50,
                                height: 68,
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: `1px solid ${BLUE_RING.divider}`,
                              }}
                            />
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: BLUE_RING.navy }} noWrap>
                                {item.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: BLUE_RING.muted, display: 'block' }}>
                                ผู้เขียน: {item.author} {item.condition ? `• ${item.condition}` : ''}
                              </Typography>
                              <Typography variant="caption" sx={{ color: BLUE_RING.muted }}>
                                จำนวน: {item.quantity} เล่ม
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: BLUE_RING.primary, flexShrink: 0 }}>
                              {formatCurrency(item.price * item.quantity)}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>

                      {/* Order Footer */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 1.5,
                          pt: 2,
                          borderTop: '1px solid #F1F5F9',
                        }}
                      >
                        <Typography variant="caption" sx={{ color: BLUE_RING.muted }}>
                          ชำระโดย: {order.paymentMethod || 'PromptPay QR'}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: { xs: 'space-between', sm: 'flex-end' },
                            width: { xs: '100%', sm: 'auto' },
                            gap: 2,
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: BLUE_RING.navy }}>
                            ยอดรวม: {formatCurrency(order.total)}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/account/orders/${order.id}`)}
                            sx={{
                              borderRadius: '10px',
                              minHeight: '44px',
                              px: 2,
                              fontSize: '0.8rem',
                              textTransform: 'none',
                              fontWeight: 700,
                              borderColor: BLUE_RING.divider,
                              color: BLUE_RING.navy,
                            }}
                          >
                            ดูรายละเอียด
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}
              </Stack>
            )}
          </Paper>
        )}

        {/* ================================================== */}
        {/* TAB 2: รายการโปรด (Wishlist)                       */}
        {/* ================================================== */}
        {activeTab === 2 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3.5, md: 4 },
              borderRadius: '20px',
              border: `1px solid ${BLUE_RING.divider}`,
              bgcolor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(16, 42, 67, 0.02)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: BLUE_RING.navy,
                  fontSize: { xs: '1.05rem', sm: '1.25rem' },
                }}
              >
                หนังสือที่บันทึกไว้ในรายการโปรด ({wishlist.length} เล่ม)
              </Typography>
              {wishlist.length > 0 && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/books')}
                  sx={{
                    borderRadius: '10px',
                    minHeight: '44px',
                    px: 2,
                    borderColor: BLUE_RING.divider,
                    color: BLUE_RING.navy,
                  }}
                >
                  ดูหนังสือเพิ่มเติม
                </Button>
              )}
            </Box>

            {wishlist.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <WishlistIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: BLUE_RING.muted, mb: 1 }}>
                  ยังไม่มีหนังสือในรายการโปรด
                </Typography>
                <Typography variant="body2" sx={{ color: BLUE_RING.muted, mb: 3 }}>
                  กดปุ่มไอคอนหัวใจที่การ์ดหนังสือที่คุณสนใจเพื่อบันทึกเก็บไว้ดูในภายหลัง
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/books')}
                  sx={{
                    borderRadius: '12px',
                    minHeight: '48px',
                    px: 3,
                    fontWeight: 700,
                    bgcolor: BLUE_RING.primary,
                    '&:hover': { bgcolor: '#1565C0' },
                  }}
                >
                  เริ่มค้นหาหนังสือ
                </Button>
              </Box>
            ) : (
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {wishlist.map((book) => (
                  <Grid size={{ xs: 6, sm: 6, md: 4 }} key={book.id}>
                    <BookCard book={book} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        )}

        {/* ================================================== */}
        {/* TAB 3: หนังสือของฉัน (My Listed Books)              */}
        {/* ================================================== */}
        {activeTab === 3 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3.5, md: 4 },
              borderRadius: '20px',
              border: `1px solid ${BLUE_RING.divider}`,
              bgcolor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(16, 42, 67, 0.02)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: BLUE_RING.navy,
                  fontSize: { xs: '1.05rem', sm: '1.25rem' },
                }}
              >
                หนังสือที่คุณลงขาย ({userData?.listedBooks?.length || 0} เล่ม)
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/sell')}
                sx={{
                  borderRadius: '12px',
                  minHeight: '44px',
                  px: 2.5,
                  fontWeight: 700,
                  bgcolor: BLUE_RING.primary,
                  '&:hover': { bgcolor: '#1565C0' },
                }}
              >
                ลงขายหนังสือเพิ่ม
              </Button>
            </Box>

            {!userData?.listedBooks || userData.listedBooks.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <MyBooksIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: BLUE_RING.muted, mb: 1 }}>
                  คุณยังไม่ได้ลงขายหนังสือ
                </Typography>
                <Typography variant="body2" sx={{ color: BLUE_RING.muted, mb: 3 }}>
                  ส่งต่อหนังสือที่คุณอ่านจบแล้วให้คนถัดไปได้ง่ายๆ ในไม่กี่ขั้นตอน
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/sell')}
                  sx={{
                    borderRadius: '12px',
                    minHeight: '48px',
                    px: 3,
                    fontWeight: 700,
                    bgcolor: BLUE_RING.primary,
                    '&:hover': { bgcolor: '#1565C0' },
                  }}
                >
                  ลงขายเล่มแรกของคุณ
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2.5}>
                {userData.listedBooks.map((item) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={item.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        border: `1px solid ${BLUE_RING.divider}`,
                        bgcolor: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Tooltip title="คลิกเพื่อดูรายละเอียด" arrow>
                          <Box
                            component="img"
                            src={resolveImageUrl(item.cover)}
                            alt={item.title}
                            onClick={() => handleOpenViewDetails(item)}
                            sx={{
                              width: 70,
                              height: 95,
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: `1px solid ${BLUE_RING.divider}`,
                              flexShrink: 0,
                              cursor: 'pointer',
                              transition: 'transform 0.15s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.05)',
                              },
                            }}
                          />
                        </Tooltip>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                            <Tooltip title="คลิกเพื่อดูรายละเอียด" arrow>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 700,
                                  color: BLUE_RING.navy,
                                  cursor: 'pointer',
                                  transition: 'color 0.15s',
                                  '&:hover': { color: BLUE_RING.primary },
                                }}
                                noWrap
                                onClick={() => handleOpenViewDetails(item)}
                              >
                                {item.title}
                              </Typography>
                            </Tooltip>
                            <Chip
                              label={
                                item.status === 'sold'
                                  ? 'ขายแล้ว'
                                  : item.status === 'paused'
                                  ? 'พักการขาย'
                                  : item.status === 'pending'
                                  ? 'รอตรวจสอบ'
                                  : item.status === 'rejected'
                                  ? 'ไม่ผ่านอนุมัติ'
                                  : 'กำลังวางขาย'
                              }
                              color={
                                item.status === 'sold'
                                  ? 'default'
                                  : item.status === 'paused' || item.status === 'pending'
                                  ? 'warning'
                                  : item.status === 'rejected'
                                  ? 'error'
                                  : 'success'
                              }
                              size="small"
                              sx={{ borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ color: BLUE_RING.muted, display: 'block' }}>
                            {item.author} • {item.condition}
                          </Typography>

                          {/* Price or Edit Price */}
                          {editingBookId === item.id ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <TextField
                                size="small"
                                type="number"
                                label="ราคา (บาท)"
                                value={editPriceInput}
                                onChange={(e) => setEditPriceInput(e.target.value)}
                                sx={{ width: 110 }}
                                autoFocus
                              />
                              <IconButton
                                size="small"
                                onClick={() => handleSaveListingPrice(item.id)}
                                sx={{ bgcolor: BLUE_RING.softBlue, color: BLUE_RING.primary }}
                              >
                                <SaveIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => setEditingBookId(null)}
                                sx={{ bgcolor: '#F1F5F9' }}
                              >
                                <CancelIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ fontWeight: 800, color: BLUE_RING.primary, mt: 0.75 }}>
                              {formatCurrency(item.price)}
                            </Typography>
                          )}

                          <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.5 }}>
                            ผู้เข้าชม {item.views} ครั้ง • ลงเมื่อ {new Date(item.dateListed).toLocaleDateString('th-TH')}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Seller Listing Management Actions */}
                      <Box
                        sx={{
                          pt: 1.25,
                          borderTop: '1px solid #F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<ViewIcon sx={{ fontSize: 14 }} />}
                            onClick={() => handleOpenViewDetails(item)}
                            sx={{
                              borderRadius: '8px',
                              minHeight: '40px',
                              fontSize: '0.75rem',
                              px: 1.5,
                              textTransform: 'none',
                              borderColor: BLUE_RING.divider,
                              color: BLUE_RING.navy,
                              fontWeight: 700,
                              '&:hover': { bgcolor: '#F8FAFC', borderColor: '#94A3B8' },
                            }}
                          >
                            ดูรายละเอียด
                          </Button>

                          {item.status !== 'sold' && (
                            <>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                                onClick={() => handleOpenEditDialog(item)}
                                sx={{
                                  borderRadius: '8px',
                                  minHeight: '40px',
                                  fontSize: '0.75rem',
                                  px: 1.5,
                                  textTransform: 'none',
                                  borderColor: BLUE_RING.primary,
                                  color: BLUE_RING.primary,
                                  fontWeight: 700,
                                  '&:hover': { bgcolor: BLUE_RING.softBlue },
                                }}
                              >
                                แก้ไขข้อมูล / รูปภาพ
                              </Button>

                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={item.status === 'active' ? <PauseIcon sx={{ fontSize: 14 }} /> : <PlayIcon sx={{ fontSize: 14 }} />}
                                onClick={() => handleToggleListingStatus(item.id)}
                                sx={{
                                  borderRadius: '8px',
                                  minHeight: '40px',
                                  fontSize: '0.75rem',
                                  px: 1.5,
                                  textTransform: 'none',
                                  borderColor: item.status === 'active' ? '#F59E0B' : '#10B981',
                                  color: item.status === 'active' ? '#B45309' : '#047857',
                                }}
                              >
                                {item.status === 'active' ? 'พักการขาย' : 'เปิดขาย'}
                              </Button>
                            </>
                          )}
                        </Box>

                        {item.status !== 'sold' && (
                          <Button
                            size="small"
                            startIcon={<DeleteIcon sx={{ fontSize: 14 }} />}
                            onClick={() => handleDeleteListing(item.id, item.title)}
                            sx={{
                              borderRadius: '8px',
                              minHeight: '40px',
                              fontSize: '0.75rem',
                              px: 1.5,
                              textTransform: 'none',
                              color: BLUE_RING.danger,
                              '&:hover': { bgcolor: '#FEE2E2' },
                            }}
                          >
                            ลบ
                          </Button>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* View Listing Details Modal */}
            <Dialog
              open={Boolean(viewingBook)}
              onClose={() => setViewingBook(null)}
              maxWidth="sm"
              fullWidth
              slotProps={{
                paper: {
                  sx: { borderRadius: '16px', p: 1 },
                },
              }}
            >
              {viewingBook && (
                <>
                  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: BLUE_RING.navy }}>
                      รายละเอียดหนังสือที่ลงขาย
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setViewingBook(null)}
                      sx={{ color: '#94A3B8' }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>

                  <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 2.5 }}>
                    {/* Header preview row */}
                    <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                      <Box
                        component="img"
                        src={resolveImageUrl(viewingBook.cover)}
                        alt={viewingBook.title}
                        sx={{
                          width: 100,
                          height: 135,
                          objectFit: 'cover',
                          borderRadius: '10px',
                          border: `1px solid ${BLUE_RING.divider}`,
                          bgcolor: '#F8FAFC',
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        }}
                      />
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            label={
                              viewingBook.status === 'sold'
                                ? 'ขายแล้ว'
                                : viewingBook.status === 'paused'
                                ? 'พักการขาย'
                                : viewingBook.status === 'pending'
                                ? 'รอตรวจสอบ'
                                : viewingBook.status === 'rejected'
                                ? 'ไม่ผ่านอนุมัติ'
                                : 'กำลังวางขาย'
                            }
                            color={
                              viewingBook.status === 'sold'
                                ? 'default'
                                : viewingBook.status === 'paused' || viewingBook.status === 'pending'
                                ? 'warning'
                                : viewingBook.status === 'rejected'
                                ? 'error'
                                : 'success'
                            }
                            size="small"
                            sx={{ borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}
                          />
                          <Typography variant="caption" sx={{ color: '#94A3B8', fontFamily: 'monospace' }}>
                            ID: {viewingBook.id}
                          </Typography>
                        </Box>

                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: BLUE_RING.navy, lineHeight: 1.3 }}>
                          {viewingBook.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: BLUE_RING.muted, mt: 0.5 }}>
                          โดย {viewingBook.author || 'ไม่ระบุผู้แต่ง'}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mt: 1.5 }}>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: BLUE_RING.primary }}>
                            {formatCurrency(viewingBook.price)}
                          </Typography>
                          {viewingBook.originalPrice && (
                            <Typography variant="body2" sx={{ color: '#94A3B8', textDecoration: 'line-through' }}>
                              {formatCurrency(viewingBook.originalPrice)}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    {/* Metadata details grid */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        bgcolor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>หมวดหมู่</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: BLUE_RING.navy }}>{viewingBook.category || 'ทั่วไป'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>สภาพหนังสือ</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: BLUE_RING.navy }}>{viewingBook.condition || 'ดีมาก'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>วันที่ลงขาย</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: BLUE_RING.navy }}>
                          {new Date(viewingBook.dateListed).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>สถิติเข้าชม</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: BLUE_RING.navy }}>{viewingBook.views} ครั้ง</Typography>
                      </Box>
                      {viewingBook.isbn && (
                        <Box sx={{ gridColumn: 'span 2' }}>
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>เลข ISBN</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: BLUE_RING.navy, fontFamily: 'monospace' }}>{viewingBook.isbn}</Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Story or defects */}
                    {(viewingBook.defects || viewingBook.story) && (
                      <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFFBEB', border: '1px solid #FDE68A' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#92400E', mb: 0.5 }}>
                          เรื่องราวหรือตำหนิที่ระบุไว้
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#78350F', whiteSpace: 'pre-line' }}>
                          {viewingBook.defects || viewingBook.story}
                        </Typography>
                      </Box>
                    )}
                  </DialogContent>

                  <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                      onClick={() => {
                        const targetId = viewingBook.id;
                        setViewingBook(null);
                        navigate(`/books/${targetId}`);
                      }}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 700,
                        borderColor: BLUE_RING.divider,
                        color: BLUE_RING.navy,
                        '&:hover': { bgcolor: '#F8FAFC' },
                      }}
                    >
                      เปิดดูหน้าร้าน (/books/{viewingBook.id})
                    </Button>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {viewingBook.status !== 'sold' && (
                        <Button
                          variant="outlined"
                          startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                          onClick={() => handleEditFromViewModal(viewingBook)}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 700,
                            borderColor: BLUE_RING.primary,
                            color: BLUE_RING.primary,
                          }}
                        >
                          แก้ไขข้อมูล
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        onClick={() => setViewingBook(null)}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 700,
                          bgcolor: BLUE_RING.primary,
                          '&:hover': { bgcolor: '#1565C0' },
                        }}
                      >
                        ปิด
                      </Button>
                    </Box>
                  </DialogActions>
                </>
              )}
            </Dialog>

            {/* Edit Listing Modal */}
            <Dialog
              open={Boolean(editingBook)}
              onClose={() => !isUpdatingListing && setEditingBook(null)}
              maxWidth="sm"
              fullWidth
              slotProps={{
                paper: {
                  sx: { borderRadius: '16px', p: 1 },
                },
              }}
            >
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: BLUE_RING.navy }}>
                  แก้ไขข้อมูลและรูปภาพหนังสือ
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setEditingBook(null)}
                  disabled={isUpdatingListing}
                  sx={{ color: '#94A3B8' }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 2.5 }}>
                {/* Cover image upload & preview */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Box
                    component="img"
                    src={editCover ? resolveImageUrl(editCover) : 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80'}
                    alt="พรีวิวรูปหนังสือ"
                    sx={{
                      width: 90,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: '10px',
                      border: `1px solid ${BLUE_RING.divider}`,
                      bgcolor: '#F8FAFC',
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      รูปภาพปกหนังสือ
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1.5 }}>
                      รองรับไฟล์ JPG, PNG หรือ WebP (ระบบจะบีบอัดรูปให้อัตโนมัติ &lt; 500KB)
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      size="small"
                      startIcon={<CameraIcon />}
                      disabled={isUpdatingListing}
                      sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                    >
                      เลือกรูปภาพใหม่
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        hidden
                        onChange={handleCoverFileChange}
                      />
                    </Button>
                  </Box>
                </Box>

                <TextField
                  label="ชื่อหนังสือ"
                  fullWidth
                  size="small"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  disabled={isUpdatingListing}
                  required
                />

                <TextField
                  label="ผู้แต่ง / สำนักพิมพ์"
                  fullWidth
                  size="small"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  disabled={isUpdatingListing}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="ราคาขาย (บาท)"
                    type="number"
                    fullWidth
                    size="small"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    disabled={isUpdatingListing}
                    required
                  />
                  <TextField
                    label="ราคาปก (ถ้ามี)"
                    type="number"
                    fullWidth
                    size="small"
                    value={editOriginalPrice}
                    onChange={(e) => setEditOriginalPrice(e.target.value)}
                    disabled={isUpdatingListing}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>หมวดหมู่</InputLabel>
                    <Select
                      value={editCategory}
                      label="หมวดหมู่"
                      onChange={(e) => setEditCategory(e.target.value)}
                      disabled={isUpdatingListing}
                    >
                      <MenuItem value="นิยาย">นิยาย</MenuItem>
                      <MenuItem value="พัฒนาตนเอง">พัฒนาตนเอง</MenuItem>
                      <MenuItem value="ธุรกิจ">ธุรกิจ / การเงิน</MenuItem>
                      <MenuItem value="ความรู้ทั่วไป">ความรู้ทั่วไป</MenuItem>
                      <MenuItem value="การ์ตูน">การ์ตูน / มังงะ</MenuItem>
                      <MenuItem value="การศึกษา">การศึกษา / ตำรา</MenuItem>
                      <MenuItem value="เด็ก">เด็กและเยาวชน</MenuItem>
                      <MenuItem value="หายาก">หนังสือสะสม / หายาก</MenuItem>
                      <MenuItem value="ทั่วไป">ทั่วไป</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>สภาพหนังสือ</InputLabel>
                    <Select
                      value={editCondition}
                      label="สภาพหนังสือ"
                      onChange={(e) => setEditCondition(e.target.value)}
                      disabled={isUpdatingListing}
                    >
                      <MenuItem value="เหมือนใหม่">เหมือนใหม่ (Excellent)</MenuItem>
                      <MenuItem value="ดีมาก">ดีมาก (Very Good)</MenuItem>
                      <MenuItem value="ดี">ดี (Good)</MenuItem>
                      <MenuItem value="พอใช้">พอใช้ (Acceptable)</MenuItem>
                      <MenuItem value="มีตำหนิ">มีตำหนิ</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </DialogContent>
              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                  onClick={() => setEditingBook(null)}
                  disabled={isUpdatingListing}
                  sx={{ color: '#64748B', borderRadius: '8px' }}
                >
                  ยกเลิก
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveListingDetails}
                  disabled={isUpdatingListing}
                  sx={{
                    borderRadius: '8px',
                    fontWeight: 700,
                    bgcolor: BLUE_RING.primary,
                    '&:hover': { bgcolor: '#1565C0' },
                    px: 3,
                  }}
                >
                  {isUpdatingListing ? 'กำลังบันทึก…' : 'บันทึกการเปลี่ยนแปลง'}
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        )}

        {/* ================================================== */}
        {/* TAB 4: ตั้งค่าบัญชี (Settings)                     */}
        {/* ================================================== */}
        {activeTab === 4 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3.5, md: 4 },
              borderRadius: '20px',
              border: `1px solid ${BLUE_RING.divider}`,
              bgcolor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(16, 42, 67, 0.02)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: BLUE_RING.navy, mb: 3 }}>
              ตั้งค่าความปลอดภัยและการแจ้งเตือน
            </Typography>

            <Grid container spacing={{ xs: 2.5, sm: 3, md: 4 }}>
              {/* Row 1: Password Change */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: '16px',
                    border: `1px solid ${BLUE_RING.divider}`,
                    bgcolor: '#FFFFFF',
                    height: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LockIcon sx={{ color: BLUE_RING.primary, fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: BLUE_RING.navy }}>
                      เปลี่ยนรหัสผ่าน
                    </Typography>
                  </Box>

                  {passwordError && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.85rem' }}>
                      {passwordError}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleChangePasswordSubmit}>
                    <input
                      type="text"
                      name="username"
                      autoComplete="username"
                      value={user?.email || user?.name || ''}
                      readOnly
                      style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                    <PasswordInput
                      id="setting-old-password"
                      name="oldPassword"
                      label="รหัสผ่านปัจจุบัน"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />

                    <PasswordInput
                      id="setting-new-password"
                      name="newPassword"
                      label="รหัสผ่านใหม่"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      showStrengthMeter={true}
                    />

                    <PasswordInput
                      id="setting-confirm-password"
                      name="confirmPassword"
                      label="ยืนยันรหัสผ่านใหม่"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={isChangingPassword}
                      startIcon={isChangingPassword ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                      sx={{
                        borderRadius: '12px',
                        minHeight: '48px',
                        fontWeight: 700,
                        bgcolor: BLUE_RING.primary,
                        '&:hover': { bgcolor: '#1565C0' },
                      }}
                    >
                      {isChangingPassword ? 'กำลังบันทึก...' : 'อัปเดตรหัสผ่านใหม่'}
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              {/* Email Notifications */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: '16px',
                    border: `1px solid ${BLUE_RING.divider}`,
                    bgcolor: '#FFFFFF',
                    height: '100%',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: BLUE_RING.navy, mb: 2 }}>
                    การแจ้งเตือนทางอีเมล
                  </Typography>

                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifyOrder}
                          onChange={(e) => {
                            setNotifyOrder(e.target.checked);
                            showSuccess('บันทึกการตั้งค่าแล้ว');
                          }}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: BLUE_RING.navy }}>
                            สถานะคำสั่งซื้อและการจัดส่ง
                          </Typography>
                          <Typography variant="caption" sx={{ color: BLUE_RING.muted }}>
                            รับอีเมลเมื่อหนังสือของคุณถูกจัดส่งหรือมีผู้ซื้อหนังสือที่คุณลงขาย
                          </Typography>
                        </Box>
                      }
                    />

                    <Divider sx={{ borderColor: BLUE_RING.divider }} />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifyBookUpdates}
                          onChange={(e) => {
                            setNotifyBookUpdates(e.target.checked);
                            showSuccess('บันทึกการตั้งค่าแล้ว');
                          }}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: BLUE_RING.navy }}>
                            หนังสือในรายการโปรดลดราคา
                          </Typography>
                          <Typography variant="caption" sx={{ color: BLUE_RING.muted }}>
                            แจ้งเตือนเมื่อมีผู้ลงขายหนังสือที่คุณบันทึกไว้ในราคาพิเศษ
                          </Typography>
                        </Box>
                      }
                    />

                    <Divider sx={{ borderColor: BLUE_RING.divider }} />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifyPromo}
                          onChange={(e) => {
                            setNotifyPromo(e.target.checked);
                            showSuccess('บันทึกการตั้งค่าแล้ว');
                          }}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: BLUE_RING.navy }}>
                            แคมเปญและข่าวสารพิเศษ
                          </Typography>
                          <Typography variant="caption" sx={{ color: BLUE_RING.muted }}>
                            รับข่าวสารกิจกรรมส่งต่อหนังสือและคูปองส่วนลดพิเศษ
                          </Typography>
                        </Box>
                      }
                    />
                  </Stack>
                </Paper>
              </Grid>

              {/* Newsletter */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: '16px',
                    border: `1px solid ${BLUE_RING.divider}`,
                    bgcolor: '#FFFFFF',
                    height: '100%',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: BLUE_RING.navy, mb: 1 }}>
                    ติดตามข่าวสาร BookLoop
                  </Typography>
                  <Typography variant="body2" sx={{ color: BLUE_RING.muted, mb: 2 }}>
                    รับข่าวสาร หนังสือแนะนำ และโปรโมชั่นพิเศษจาก BookLoop ทางอีเมล
                  </Typography>

                  {isEmailSubscribed ? (
                    <Box>
                      <Alert severity="success" sx={{ borderRadius: '10px', mb: 1.5 }}>
                        สมัครรับข่าวสารแล้ว คุณจะได้รับข่าวสารและโปรโมชั่นพิเศษทางอีเมล
                      </Alert>
                      <Button
                        variant="outlined"
                        color="error"
                        disabled={isSubscribing}
                        startIcon={isSubscribing ? <CircularProgress size={18} color="inherit" /> : undefined}
                        onClick={handleUnsubscribeNewsletter}
                        sx={{ borderRadius: '12px', minHeight: '44px', fontWeight: 700 }}
                      >
                        {isSubscribing ? 'กำลังยกเลิก...' : 'ยกเลิกการสมัคร'}
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="caption" sx={{ color: BLUE_RING.muted, display: 'block', mb: 1.5 }}>
                        สมัครบัญชีครั้งแรกจะปิดไว้ กดปุ่มด้านล่างเพื่อเปิดรับข่าวสารเอง
                      </Typography>
                      <Button
                        variant="contained"
                        disabled={isSubscribing}
                        startIcon={isSubscribing ? <CircularProgress size={18} color="inherit" /> : undefined}
                        onClick={handleSubscribeNewsletter}
                        sx={{
                          borderRadius: '12px',
                          minHeight: '44px',
                          fontWeight: 700,
                          bgcolor: BLUE_RING.primary,
                          '&:hover': { bgcolor: '#1565C0' },
                        }}
                      >
                        {isSubscribing ? 'กำลังสมัคร...' : 'สมัครรับข่าวสาร'}
                      </Button>
                      {subscribeMessage && (
                        <Alert
                          severity={subscribeMessage.includes('สำเร็จ') ? 'success' : 'error'}
                          sx={{ mt: 1.5, borderRadius: '10px' }}
                        >
                          {subscribeMessage}
                        </Alert>
                      )}
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Logout Button */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: '16px',
                    border: '1px solid #FEE2E2',
                    bgcolor: '#FEF2F2',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: BLUE_RING.danger, mb: 0.5 }}>
                      ออกจากระบบ
                    </Typography>
                    <Typography variant="body2" sx={{ color: BLUE_RING.muted }}>
                      ออกจากระบบของ BookLoop ในอุปกรณ์นี้
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      showConfirm('ต้องการออกจากระบบหรือไม่?').then((r) => {
                        if (r.isConfirmed) {
                          logout();
                          showSuccess('ออกจากระบบแล้ว');
                          navigate('/');
                        }
                      });
                    }}
                    sx={{ borderRadius: '12px', minHeight: '44px', fontWeight: 700, alignSelf: 'flex-start' }}
                  >
                    ออกจากระบบ
                  </Button>
                </Paper>
              </Grid>

              {/* Danger Zone */}
              <Grid size={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: '16px',
                    border: '1px solid #FECACA',
                    bgcolor: '#FFFFFF',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <DeleteIcon sx={{ color: BLUE_RING.danger, fontSize: 22 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: BLUE_RING.danger }}>
                      โซนอันตราย
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: BLUE_RING.muted, mb: 2 }}>
                    การลบบัญชีจะลบข้อมูลทั้งหมดของคุณออกจาก BookLoop อย่างถาวร รวมถึงประวัติคำสั่งซื้อ รายการโปรด และหนังสือที่ลงขาย
                  </Typography>

                  {deleteError && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.85rem' }}>
                      {deleteError}
                    </Alert>
                  )}

                  <Box
                    component="form"
                    onSubmit={handleDeleteAccount}
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'flex-end' },
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <PasswordInput
                        id="setting-delete-password"
                        name="deletePassword"
                        label="กรอกรหัสผ่านเพื่อยืนยัน"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        required
                      />
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      color="error"
                      disabled={isDeletingAccount}
                      startIcon={isDeletingAccount ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
                      sx={{
                        borderRadius: '12px',
                        minHeight: '48px',
                        px: 3,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {isDeletingAccount ? 'กำลังลบบัญชี...' : 'ลบบัญชีถาวร'}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
