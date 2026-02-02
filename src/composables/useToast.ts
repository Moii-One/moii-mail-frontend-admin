import Swal from 'sweetalert2';
import { useAppStore } from '@/stores/index';

export type ToastType = 'success' | 'error';

let currentToast: any = null;

export function useToast() {
  const showToast = (message: string, type: ToastType = 'success') => {
    const appStore = useAppStore();
    const icon = type === 'success' ? '✓' : '✕';
    const isDark = appStore.isDarkMode;
    
    // Close previous toast if exists
    if (currentToast) {
      currentToast.close();
    }
    
    currentToast = Swal.fire({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      showClass: {
        popup: 'swal2-noanimation'
      },
      hideClass: {
        popup: ''
      },
      customClass: { 
        container: 'toast',
        popup: 'toast-custom'
      },
      background: isDark ? '#0e1726' : '#ffffff',
      html: `<div style="display: flex; align-items: center; gap: 6px; font-size: 14px; color: ${isDark ? '#d1d5db' : '#1f2937'}; line-height: 1;">
          <span style="font-size: 16px;">${icon}</span>
          <span>${message}</span>
      </div>`,
      didOpen: (popup) => {
        popup.style.padding = '6px 10px';
        const htmlContainer = popup.querySelector('.swal2-html-container');
        if (htmlContainer) {
          (htmlContainer as HTMLElement).style.padding = '0';
          (htmlContainer as HTMLElement).style.margin = '0';
        }
      },
      didClose: () => {
        currentToast = null;
      }
    });
  };

  return {
    showToast
  };
}
