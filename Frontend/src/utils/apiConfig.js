export const VITE_API_BASE_KEY = import.meta.env.VITE_API_BASE_KEY;

export const getAuthHeaders = () => {
  const token = localStorage.getItem('x-access-token');
  const refreshToken = localStorage.getItem('x-refresh-token');
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `JWT ${token}`,
    'x-refresh-token': refreshToken
  };
};
