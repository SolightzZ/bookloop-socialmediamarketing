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
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Stack,
  Tooltip,
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
  LocalShipping as ShippingIcon,
  AddShoppingCart as AddCartIcon,
  DeleteOutlined as DeleteIcon,
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { authService, UserAccountData } from '../services/authService';
import { formatCurrency } from '../utils/formatCurrency';
import { showSuccess, showConfirm } from '../utils/alerts';
import { PasswordInput } from '../components/auth/PasswordInput';
import { BookCard } from '../components/BookCard';

export default function AccountPage() {
  const { user, updateProfile, changePassword, logout } = useAuth();
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
  const [bio, setBio] = useState(user?.bio || '');
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

  // Sync tab with path
  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  // Load user data (orders, listed books)
  useEffect(() => {
    if (user) {
      const data = authService.getUserData(user.id);
      setUserData(data);
      setName(user.name || '');
      setPhone(user.phone || '');
      setBio(user.bio || '');
      setStreet(user.address?.street || '');
      setSubdistrict(user.address?.subdistrict || '');
      setDistrict(user.address?.district || '');
      setProvince(user.address?.province || '');
      setPostalCode(user.address?.postalCode || '');
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

  if (!user) return null;

  return (
    <Box sx={{ bgcolor: '#F7F9FB', minHeight: '100vh', py: { xs: 4, sm: 6 } }}>
      <Container maxWidth="lg">
        {/* User Top Profile Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            mb: 4,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 3,
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{
              width: { xs: 72, sm: 84 },
              height: { xs: 72, sm: 84 },
              bgcolor: 'primary.main',
              fontSize: '2rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(15, 41, 66, 0.08)',
            }}
          >
            {user.name.charAt(0)}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  {user.email}
                </Typography>
              </Box>

              <Chip
                label="สมาชิกชุมชน BookLoop"
                color="primary"
                variant="outlined"
                size="small"
                sx={{ borderRadius: 1.5, fontWeight: 600, fontSize: '0.78rem' }}
              />
            </Box>

            {user.bio && (
              <Typography variant="body2" sx={{ color: 'text.primary', mt: 0.5, maxWidth: 650 }}>
                "{user.bio}"
              </Typography>
            )}

            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 1 }}>
              เข้าร่วมเมื่อ:{' '}
              {new Date(user.createdAt).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>
        </Paper>

        {/* Tab Navigation */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ borderBottom: '1px solid #E2E8F0', px: { xs: 1, sm: 2 } }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.925rem',
                  py: 2,
                  px: { xs: 2, sm: 3 },
                  minHeight: 52,
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
          </Box>

          {/* Tab 0: Profile View / Edit */}
          {activeTab === 0 && (
            <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  ข้อมูลส่วนตัวและที่อยู่จัดส่ง
                </Typography>
                {!isEditingProfile ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditingProfile(true)}
                    size="small"
                    sx={{ borderRadius: 2 }}
                  >
                    แก้ไขข้อมูล
                  </Button>
                ) : (
                  <Button
                    variant="text"
                    color="inherit"
                    startIcon={<CancelIcon />}
                    onClick={() => setIsEditingProfile(false)}
                    size="small"
                  >
                    ยกเลิก
                  </Button>
                )}
              </Box>

              {!isEditingProfile ? (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      ชื่อ-นามสกุล
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                      {user.name}
                    </Typography>

                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      อีเมล
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.primary', mb: 2 }}>
                      {user.email}
                    </Typography>

                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      เบอร์โทรศัพท์
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.primary', mb: 2 }}>
                      {user.phone || 'ยังไม่ได้ระบุ'}
                    </Typography>

                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      คำแนะนำตัว (Bio)
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.primary' }}>
                      {user.bio || 'ยังไม่มีคำแนะนำตัว'}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        bgcolor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <ShippingIcon sx={{ color: 'secondary.main', fontSize: 22 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          ที่อยู่เริ่มต้นสำหรับจัดส่งหนังสือ
                        </Typography>
                      </Box>
                      {user.address?.street ? (
                        <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                          {user.address.recipientName || user.name}
                          <br />
                          {user.address.street} {user.address.subdistrict}
                          <br />
                          {user.address.district} {user.address.province} {user.address.postalCode}
                          <br />
                          โทร: {user.address.phone || user.phone || '-'}
                        </Typography>
                      ) : (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          ยังไม่มีที่อยู่จัดส่งที่บันทึกไว้ กดปุ่ม "แก้ไขข้อมูล" เพื่อเพิ่มที่อยู่สำหรับการสั่งซื้อที่รวดเร็วยิ่งขึ้น
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              ) : (
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

                    <Grid size={12} sx={{ mt: 1 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSavingProfile}
                        startIcon={isSavingProfile ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                        sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
                      >
                        {isSavingProfile ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}

          {/* Tab 1: Orders History */}
          {activeTab === 1 && (
            <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
                ประวัติคำสั่งซื้อ ({userData?.orders?.length || 0} รายการ)
              </Typography>

              {!userData?.orders || userData.orders.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <OrdersIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                    ยังไม่มีประวัติคำสั่งซื้อ
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    เลือกชมหนังสือดีๆ สภาพเหมือนใหม่ในราคาประหยัดได้เลย
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/books')}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                  >
                    สำรวจหนังสือทั้งหมด
                  </Button>
                </Box>
              ) : (
                <Stack spacing={3}>
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
                          p: 3,
                          borderRadius: 2.5,
                          border: '1px solid #E2E8F0',
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
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                              คำสั่งซื้อ {order.id}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
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
                              sx={{ fontWeight: 700, borderRadius: 1.5 }}
                            />
                            {order.trackingNumber && (
                              <Tooltip title={`พัสดุ: ${order.shippingCarrier || ''}`}>
                                <Chip
                                  icon={<ShippingIcon sx={{ fontSize: 16 }} />}
                                  label={`เลขพัสดุ: ${order.trackingNumber}`}
                                  variant="outlined"
                                  size="small"
                                  sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}
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
                                  borderRadius: 1.5,
                                  border: '1px solid #E2E8F0',
                                }}
                              />
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                  {item.title}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                  ผู้เขียน: {item.author} {item.condition ? `• ${item.condition}` : ''}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  จำนวน: {item.quantity} เล่ม
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
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
                            fontSize: '0.9rem',
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            ชำระโดย: {order.paymentMethod || 'PromptPay QR'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                              ยอดรวมสุทธิ: {formatCurrency(order.total)}
                            </Typography>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/account/orders/${order.id}`)}
                              sx={{
                                borderRadius: 1.5,
                                fontSize: '0.78rem',
                                textTransform: 'none',
                                fontWeight: 700,
                              }}
                            >
                              ดูรายละเอียดคำสั่งซื้อ
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </Box>
          )}

          {/* Tab 2: Wishlist */}
          {activeTab === 2 && (
            <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  หนังสือที่บันทึกไว้ในรายการโปรด ({wishlist.length} เล่ม)
                </Typography>
                {wishlist.length > 0 && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/books')}
                    sx={{ borderRadius: 2 }}
                  >
                    ดูหนังสือเพิ่มเติม
                  </Button>
                )}
              </Box>

              {wishlist.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <WishlistIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                    ยังไม่มีหนังสือในรายการโปรด
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    กดปุ่มไอคอนหัวใจที่การ์ดหนังสือที่คุณสนใจเพื่อบันทึกเก็บไว้ดูในภายหลัง
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/books')}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                  >
                    เริ่มค้นหาหนังสือ
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {wishlist.map((book) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={book.id}>
                      <BookCard book={book} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* Tab 3: My Listed Books */}
          {activeTab === 3 && (
            <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  หนังสือที่คุณลงขาย ({userData?.listedBooks?.length || 0} เล่ม)
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/sell')}
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                  ลงขายหนังสือเพิ่ม
                </Button>
              </Box>

              {!userData?.listedBooks || userData.listedBooks.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <MyBooksIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                    คุณยังไม่ได้ลงขายหนังสือ
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    ส่งต่อหนังสือที่คุณอ่านจบแล้วให้คนถัดไปได้ง่ายๆ ในไม่กี่ขั้นตอน
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/sell')}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
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
                          borderRadius: 2.5,
                          border: '1px solid #E2E8F0',
                          display: 'flex',
                          gap: 2,
                        }}
                      >
                        <Box
                          component="img"
                          src={item.cover}
                          alt={item.title}
                          sx={{
                            width: 70,
                            height: 95,
                            objectFit: 'cover',
                            borderRadius: 1.5,
                            border: '1px solid #E2E8F0',
                          }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              {item.title}
                            </Typography>
                            <Chip
                              label={item.status === 'sold' ? 'ขายแล้ว' : 'กำลังวางขาย'}
                              color={item.status === 'sold' ? 'default' : 'success'}
                              size="small"
                              sx={{ borderRadius: 1.5, fontSize: '0.75rem', fontWeight: 600 }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                            {item.author} • {item.condition}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.main', mt: 1 }}>
                            {formatCurrency(item.price)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                            ผู้เข้าชม {item.views} ครั้ง • ลงเมื่อ {new Date(item.dateListed).toLocaleDateString('th-TH')}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* Tab 4: Settings */}
          {activeTab === 4 && (
            <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
                ตั้งค่าความปลอดภัยและการแจ้งเตือน
              </Typography>

              <Grid container spacing={4}>
                {/* Password Change Section */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2.5,
                      border: '1px solid #E2E8F0',
                      bgcolor: '#FFFFFF',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LockIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        เปลี่ยนรหัสผ่าน
                      </Typography>
                    </Box>

                    {passwordError && (
                      <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.85rem' }}>
                        {passwordError}
                      </Alert>
                    )}

                    <Box component="form" onSubmit={handleChangePasswordSubmit}>
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
                        color="primary"
                        fullWidth
                        disabled={isChangingPassword}
                        startIcon={isChangingPassword ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                        sx={{ borderRadius: 2, py: 1, fontWeight: 700 }}
                      >
                        {isChangingPassword ? 'กำลังบันทึก...' : 'อัปเดตรหัสผ่านใหม่'}
                      </Button>
                    </Box>
                  </Paper>
                </Grid>

                {/* Notifications & Account Actions */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2.5,
                      border: '1px solid #E2E8F0',
                      bgcolor: '#FFFFFF',
                      mb: 3,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                      การแจ้งเตือนทางอีเมล
                    </Typography>

                    <Stack spacing={1.5}>
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
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              สถานะคำสั่งซื้อและการจัดส่ง
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              รับอีเมลเมื่อหนังสือของคุณถูกจัดส่งหรือมีผู้ซื้อหนังสือที่คุณลงขาย
                            </Typography>
                          </Box>
                        }
                      />

                      <Divider sx={{ my: 0.5 }} />

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
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              หนังสือในรายการโปรดลดราคา
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              แจ้งเตือนเมื่อมีผู้ลงขายหนังสือที่คุณบันทึกไว้ในราคาพิเศษ
                            </Typography>
                          </Box>
                        }
                      />

                      <Divider sx={{ my: 0.5 }} />

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
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              แคมเปญ Read-Share-Repeat และข่าวสาร
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              รับข่าวสารกิจกรรมส่งต่อหนังสือและคูปองส่วนลดพิเศษ
                            </Typography>
                          </Box>
                        }
                      />
                    </Stack>
                  </Paper>

                  {/* Logout Button */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      border: '1px solid #FEE2E2',
                      bgcolor: '#FEF2F2',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'error.main' }}>
                        ออกจากระบบ
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        สิ้นสุดเซสชันการใช้งานปัจจุบันบนอุปกรณ์นี้
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
                      sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                      ออกจากระบบ
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
