// src/components/providers/auth-provider.tsx
// AuthProvider — client-side Firebase Auth synchronization and route protection

'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthChanged, type AuthenticatedUser } from '@/lib/firebase/auth';
import { useUserStore } from '@/store/user-store';

interface AuthContextType {
  user: AuthenticatedUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Zustand Store sync
  const setRole = useUserStore((s) => s.setRole);
  const setDisplayName = useUserStore((s) => s.setDisplayName);
  const setLanguage = useUserStore((s) => s.setLanguage);
  const setAuthenticated = useUserStore((s) => s.setAuthenticated);
  const resetUser = useUserStore((s) => s.resetUser);

  useEffect(() => {
    // Listen to Firebase/Mock authentication state changes
    const unsubscribe = onAuthChanged((authUser) => {
      setUser(authUser);
      setLoading(false);

      if (authUser) {
        setAuthenticated(true);
        setRole(authUser.role);
        setDisplayName(authUser.displayName);
        if (authUser.language) {
          setLanguage(authUser.language);
        }
      } else {
        resetUser();
      }
    });

    return () => unsubscribe();
  }, [setAuthenticated, setRole, setDisplayName, setLanguage, resetUser]);

  useEffect(() => {
    if (loading) return;

    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (!user && !isPublic) {
      // User is not logged in and trying to access a protected page
      router.replace('/login');
    } else if (user && isPublic && pathname !== '/') {
      // User is logged in and trying to access login/register/forgot-password
      router.replace(`/${user.role}`);
    } else if (user && !isPublic) {
      // Role-based authorization check
      const currentRole = user.role;
      
      // Prevent cross-access to other roles' dashboards unless they are 'admin'
      if (currentRole !== 'admin') {
        if (pathname.startsWith('/fan') && currentRole !== 'fan') {
          router.replace(`/${currentRole}`);
        } else if (pathname.startsWith('/volunteer') && currentRole !== 'volunteer') {
          router.replace(`/${currentRole}`);
        } else if (pathname.startsWith('/staff') && currentRole !== 'volunteer') {
          // If staff/volunteer conflict, redirect
          router.replace(`/${currentRole}`);
        } else if (pathname.startsWith('/security') && currentRole !== 'security') {
          router.replace(`/${currentRole}`);
        } else if (pathname.startsWith('/organizer') && currentRole !== 'organizer') {
          router.replace(`/${currentRole}`);
        } else if (pathname.startsWith('/admin')) {
          router.replace(`/${currentRole}`);
        }
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-4">
        {/* Sleek, premium loader conforming to design instructions */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-xs font-semibold tracking-wider text-muted-foreground animate-pulse">
          INITIALIZING FIFA STADIUMOS...
        </p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
