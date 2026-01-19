import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const baseStyle = {
  customClass: {
    title: 'text-base font-semibold',       // smaller font
    popup: 'rounded-lg px-6 py-4',          // padding
    confirmButton: 'text-sm px-4 py-2 rounded bg-[#a51e28] text-white',
  },
  buttonsStyling: false, // use custom Tailwind classes
};

export const showSuccessAlert = (text: string, title = 'Success') => {
  return MySwal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'OK',
    ...baseStyle,
  });
};

export const showErrorAlert = (text: string, title = 'Error') => {
  return MySwal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Close',
    ...baseStyle,
  });
};

export const showWarningAlert = (text: string, title = 'Warning') => {
  return MySwal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'Got it',
    ...baseStyle,
  });
};
