import Swal from 'sweetalert2';

const primaryNavy = '#102A43';
const actionBlue = '#1769AA';
const mutedBorder = '#52606D';

export const showSuccess = (title: string, text?: string) => {
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

export const showError = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'ตกลง',
    confirmButtonColor: primaryNavy,
  });
};

export const showWarning = (title: string, text?: string) => {
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
