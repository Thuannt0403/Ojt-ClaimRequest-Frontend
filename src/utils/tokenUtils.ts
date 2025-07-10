export const decodeToken = (token: string): any => {
  try {
    // Split the token at the dots
    const tokenParts = token.split('.');
    
    // Base64 decode the payload (second part)
    const base64Url = tokenParts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Parse the decoded payload as JSON
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const isTokenExpired = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return true;
  
  try {
    const decoded = decodeToken(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    
    return decoded.exp <= currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If there's an error, consider the token expired
  }
}; 