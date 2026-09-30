import Swal from 'sweetalert2';

const primaryNavy = '#0F2D4A';
const actionBlue = '#1976D2';
const mutedBorder = '#52606D';

// SweetAlert2 ใส่ aria-hidden ให้พื้นหลังทั้งหน้า — ถ้า focus ยังค้างอยู่บนปุ่ม
// (เช่น ปุ่มปิด Drawer) Chrome จะฟ้อง "Blocked aria-hidden..." จึงย้าย focus ออกก่อนเปิดทุกครั้ง
const releaseFocus = () => {
  const el = document.activeElement as HTMLElement | null;
  if (el && typeof el.blur === 'function') el.blur();
};

// Non-blocking Toast (Bottom-Right, auto dismiss 2.5s, does not interrupt user)
const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  background: '#FFFFFF',
  color: '#0F2D4A',
  customClass: {
    popup: 'swal2-toast-bookloop',
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

/**
 * Non-blocking Toast notification for immediate user feedback
 */
export const showToast = (
  title: string,
  text?: string,
  icon: 'success' | 'info' | 'warning' | 'error' = 'success'
) => {
  releaseFocus();
  return Toast.fire({
    icon,
    title,
    text,
  });
};

/**
 * Success notification - Uses non-blocking toast by default
 * Pass isModal = true if you explicitly want a blocking modal
 */
export const showSuccess = (title: string, text?: string, isModal = false) => {
  releaseFocus();
  if (!isModal) {
    return Toast.fire({
      icon: 'success',
      title,
      text,
    });
  }

  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'ตกลง',
    confirmButtonColor: actionBlue,
    customClass: {
      popup: 'swal2-bookloop-popup',
    },
  });
};

export const showError = (title: string, text?: string, asToast = false) => {
  releaseFocus();
  if (asToast) {
    return Toast.fire({
      icon: 'error',
      title,
      text,
    });
  }

  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'ตกลง',
    confirmButtonColor: primaryNavy,
  });
};

export const showWarning = (title: string, text?: string, asToast = false) => {
  releaseFocus();
  if (asToast) {
    return Toast.fire({
      icon: 'warning',
      title,
      text,
    });
  }

  return Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'เข้าใจแล้ว',
    confirmButtonColor: actionBlue,
  });
};

export const showConfirm = (
  title: string,
  text?: string,
  confirmText = 'ยืนยัน',
  cancelText = 'ยกเลิก'
) => {
  releaseFocus();
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: actionBlue,
    cancelButtonColor: mutedBorder,
    focusCancel: true,
  });
};
