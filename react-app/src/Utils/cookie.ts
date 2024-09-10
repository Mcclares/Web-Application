//получение access tokena
export const getCookie = (name: string): string | undefined => {
  const cookieRow = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
  return cookieRow ? cookieRow.split('=')[1] : undefined;
};