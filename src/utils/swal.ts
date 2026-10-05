import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

/**
 * Custom dark boxing theme styled Swal instance
 */
export const BoxingSwal = Swal.mixin({
  background: '#15171E',
  color: '#F8FAFC',
  buttonsStyling: false,
  customClass: {
    popup: 'border border-[#282C3A] rounded-2xl shadow-2xl backdrop-blur-md',
    title: 'text-lg font-black text-[#F8FAFC]',
    htmlContainer: 'text-sm text-[#94A3B8]',
    confirmButton: 'px-5 py-2.5 rounded-xl font-bold bg-[#FF2E54] hover:bg-[#E02647] text-white shadow-lg shadow-red-500/20 active:scale-95 transition-all text-sm mx-1',
    cancelButton: 'px-5 py-2.5 rounded-xl font-bold bg-[#282C3A] hover:bg-[#323749] text-[#94A3B8] hover:text-white active:scale-95 transition-all text-sm mx-1',
    denyButton: 'px-5 py-2.5 rounded-xl font-bold bg-[#EF4444] hover:bg-[#DC2626] text-white active:scale-95 transition-all text-sm mx-1',
  },
});

/**
 * Standard confirmation dialog (e.g. quit workout, delete combo, reset logs)
 */
export async function showConfirmDialog(options: {
  title: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isDestructive?: boolean;
}): Promise<boolean> {
  const {
    title,
    text,
    confirmButtonText = '확인',
    cancelButtonText = '취소',
    isDestructive = false,
  } = options;

  const result = await BoxingSwal.fire({
    title,
    text,
    icon: isDestructive ? 'warning' : 'question',
    iconColor: isDestructive ? '#EF4444' : '#38BDF8',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    customClass: {
      popup: 'border border-[#282C3A] rounded-2xl shadow-2xl',
      title: 'text-lg font-black text-[#F8FAFC]',
      htmlContainer: 'text-sm text-[#94A3B8]',
      confirmButton: isDestructive
        ? 'px-5 py-2.5 rounded-xl font-bold bg-[#EF4444] hover:bg-[#DC2626] text-white active:scale-95 transition-all text-sm mx-1'
        : 'px-5 py-2.5 rounded-xl font-bold bg-[#FF2E54] hover:bg-[#E02647] text-white active:scale-95 transition-all text-sm mx-1',
      cancelButton:
        'px-5 py-2.5 rounded-xl font-bold bg-[#282C3A] hover:bg-[#323749] text-[#94A3B8] hover:text-white active:scale-95 transition-all text-sm mx-1',
    },
  });

  return result.isConfirmed;
}

/**
 * Simple alert modal (e.g. success or error or warning message)
 */
export async function showAlert(
  title: string,
  text?: string,
  icon: 'success' | 'error' | 'warning' | 'info' = 'info',
  confirmButtonText: string = '확인'
): Promise<SweetAlertResult> {
  const iconColor =
    icon === 'success'
      ? '#10B981'
      : icon === 'error'
      ? '#EF4444'
      : icon === 'warning'
      ? '#F59E0B'
      : '#38BDF8';

  return BoxingSwal.fire({
    title,
    text,
    icon,
    iconColor,
    confirmButtonText,
  });
}
