import { toast } from 'react-toastify';

export const notify = {
  success: (m: string) => toast.success(m),
  error: (m: string) => toast.error(m),
  warn: (m: string) => toast.warning(m),
  info: (m: string) => toast.info(m),
};

// Dùng cho các trang admin: toast rồi mới chuyển trang
export function denyAndRedirect(to = '/') {
  toast.error('Bạn không có quyền truy cập trang này!');
  setTimeout(() => { window.location.href = to; }, 1500);
}