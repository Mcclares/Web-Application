//для извлечения роли из токена

export const getCurrentRole = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Декодируем payload из JWT
    const key = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      
    return payload[key] || null; // Извлекаем текущую роль из payload
  } catch (e) {
    console.error('Failed to parse token:', e);
    return null;
  }
};