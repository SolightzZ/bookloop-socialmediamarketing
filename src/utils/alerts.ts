import type { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

// sweetalert2 (~17KB gzip) is only needed after a user action (toast/confirm),
// so it is dynamically imported and lives in its own chunk instead of the
// initial vendor bundle — first paint stays lean on mobile connections.
let swalPromise: Promise<typeof import('sweetalert2').default> | null = null;
const loadSwal = () => {
   if (!swalPromise) {
      swalPromise = import('sweetalert2').then((m) => m.default);
   }
   return swalPromise;
};

const primaryNavy = '#0F2D4A';
const actionBlue = '#1976D2';
const mutedBorder = '#52606D';

// SweetAlert2 ใส่ aria-hidden ให้พื้นหลังทั้งหน้า — ถ้า focus ยังค้างอยู่บนปุ่ม
// (เช่น ปุ่มปิด Drawer) Chrome จะฟ้อง "Blocked aria-hidden..." จึงย้าย focus ออกก่อนเปิดทุกครั้ง
const releaseFocus = () => {
   const el = document.activeElement as HTMLElement | null;
   if (el && typeof el.blur === 'function') el.blur();
};

type SwalModule = typeof import('sweetalert2').default;

// Non-blocking Toast config (Bottom-Right, auto dismiss 2.5s, does not interrupt user)
const toastConfig = (Swal: SwalModule): SweetAlertOptions => ({
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

const fireToast = async (icon: 'success' | 'info' | 'warning' | 'error', title: string, text?: string): Promise<SweetAlertResult> => {
   const Swal = await loadSwal();
   return Swal.mixin(toastConfig(Swal)).fire({ icon, title, text });
};

/**
 * Non-blocking Toast notification for immediate user feedback
 */
export const showToast = (title: string, text?: string, icon: 'success' | 'info' | 'warning' | 'error' = 'success'): Promise<SweetAlertResult> => {
   releaseFocus();
   return fireToast(icon, title, text);
};

/**
 * Success notification - Uses non-blocking toast by default
 * Pass isModal = true if you explicitly want a blocking modal
 */
export const showSuccess = (title: string, text?: string, isModal = false): Promise<SweetAlertResult> => {
   releaseFocus();
   if (!isModal) {
      return fireToast('success', title, text);
   }

   return loadSwal().then((Swal) =>
      Swal.fire({
         icon: 'success',
         title,
         text,
         confirmButtonText: 'ตกลง',
         confirmButtonColor: actionBlue,
         customClass: {
            popup: 'swal2-bookloop-popup',
         },
      } satisfies SweetAlertOptions),
   );
};

export const showError = (title: string, text?: string, asToast = false): Promise<SweetAlertResult> => {
   releaseFocus();
   if (asToast) {
      return fireToast('error', title, text);
   }

   return loadSwal().then((Swal) =>
      Swal.fire({
         icon: 'error',
         title,
         text,
         confirmButtonText: 'ตกลง',
         confirmButtonColor: primaryNavy,
      } satisfies SweetAlertOptions),
   );
};

export const showWarning = (title: string, text?: string, asToast = false): Promise<SweetAlertResult> => {
   releaseFocus();
   if (asToast) {
      return fireToast('warning', title, text);
   }

   return loadSwal().then((Swal) =>
      Swal.fire({
         icon: 'warning',
         title,
         text,
         confirmButtonText: 'เข้าใจแล้ว',
         confirmButtonColor: actionBlue,
      } satisfies SweetAlertOptions),
   );
};

export const showConfirm = (title: string, text?: string, confirmText = 'ยืนยัน', cancelText = 'ยกเลิก', isDanger = false): Promise<SweetAlertResult> => {
   releaseFocus();
   return loadSwal().then((Swal) =>
      Swal.fire({
         icon: 'warning',
         title,
         text,
         showCancelButton: true,
         confirmButtonText: confirmText,
         cancelButtonText: cancelText,
         confirmButtonColor: isDanger ? '#DC2626' : actionBlue,
         cancelButtonColor: mutedBorder,
         focusCancel: true,
         customClass: {
            popup: 'swal2-bookloop-popup',
         },
      } satisfies SweetAlertOptions),
   );
};
