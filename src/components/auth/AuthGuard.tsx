import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/services/store/store';
import { clearUser } from '@/services/features/authSlice';
import { isTokenExpired } from '@/utils/tokenUtils';
import { toast } from 'react-toastify';
import { authService } from '@/services/features/auth.service';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (isTokenExpired()) {
        setIsTokenRefreshing(true);
        const newToken = await authService.refreshToken();
        setIsTokenRefreshing(false);

        if (!newToken) {
          clearUser();
          toast.dismiss();
          toast.error('Session expired. Please login again.');
        }
      }
    };

    checkAndRefreshToken();
  }, []);

  if (isTokenRefreshing) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
