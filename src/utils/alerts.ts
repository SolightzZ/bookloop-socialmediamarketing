import Swal from 'sweetalert2';

const primaryNavy = '#0F2D4A';
const actionBlue = '#1976D2';
const mutedBorder = '#52606D';

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
