const useLocal = false; // CAMBIAR A true PARA USAR LOCALHOST

export const environment = {
  production: true,
  local: useLocal,
  apiUrl: process.env['API_URL'] || (useLocal ? 'http://127.0.0.1:8000' : '')
};
