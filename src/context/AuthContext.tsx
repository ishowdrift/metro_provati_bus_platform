'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  authProvider?: 'phone' | 'google' | 'counter' | 'supervisor';
  role: UserRole;
  assignedBusId?: string;
  assignedCounterId?: string;
  counterName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginAs: (role: UserRole, customDetails?: Partial<AuthUser>) => void;
  loginWithGoogle: (googleProfile?: { name?: string; email?: string; photoUrl?: string }) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

const DEFAULT_USERS: Record<UserRole, AuthUser> = {
  super_admin: {
    id: 'usr-admin-1',
    name: 'মো. তারেক মাহমুদ (অ্যাডমিন)',
    phone: '01798542469',
    email: 'admin@metroprobati.com',
    role: 'super_admin',
  },
  operations_admin: {
    id: 'usr-ops-1',
    name: 'ফারুক হোসেন (অপারেশনস)',
    phone: '01918695599',
    email: 'ops@metroprobati.com',
    role: 'operations_admin',
  },
  counter_manager: {
    id: 'usr-cm-1',
    name: 'জুবায়ের হোসেন (কাউন্টার ইনচার্জ)',
    phone: '01711223344',
    role: 'counter_manager',
    assignedCounterId: 'booth-10',
    counterName: 'কাঠগড় মাস্টার টার্মিনাল কাউন্টার',
  },
  counter_representative: {
    id: 'usr-counter-1',
    name: 'আহমেদ কবির (কাউন্টার প্রতিনিধি)',
    phone: '01798542469',
    role: 'counter_representative',
    assignedCounterId: 'booth-1',
    counterName: 'কাপ্তাই রাস্তার মাথা মাস্টার কাউন্টার',
  },
  bus_supervisor: {
    id: 'usr-super-1',
    name: 'মো. হাবিবুর রহমান (সুপারভাইজার)',
    phone: '01712000001',
    role: 'bus_supervisor',
    assignedBusId: 'bus-mp-101',
  },
  driver: {
    id: 'usr-driver-1',
    name: 'মো. রফিকুল ইসলাম (চালক)',
    phone: '01819000000',
    role: 'driver',
    assignedBusId: 'bus-mp-101',
  },
  passenger: {
    id: 'usr-passenger-1',
    name: 'সম্মানিত যাত্রী',
    phone: '01812345678',
    email: 'passenger@gmail.com',
    role: 'passenger',
  },
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USERS.passenger,
  role: 'passenger',
  isAuthenticated: true,
  loginAs: () => {},
  loginWithGoogle: () => {},
  logout: () => {},
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(DEFAULT_USERS.passenger);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('metro_probati_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // Ignore localStorage parse errors
    }
  }, []);

  const loginAs = (role: UserRole, customDetails?: Partial<AuthUser>) => {
    const base = DEFAULT_USERS[role] || DEFAULT_USERS.passenger;
    const updated: AuthUser = {
      ...base,
      ...customDetails,
    };
    setUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('metro_probati_user', JSON.stringify(updated));
    }
  };

  const loginWithGoogle = (googleProfile?: { name?: string; email?: string; photoUrl?: string }) => {
    const rawEmail = googleProfile?.email?.trim() || 'passenger@gmail.com';
    let displayName = googleProfile?.name?.trim();
    if (!displayName) {
      const handle = rawEmail.split('@')[0] || 'passenger';
      displayName = handle.charAt(0).toUpperCase() + handle.slice(1);
    }

    const updated: AuthUser = {
      id: `usr-google-${Date.now()}`,
      name: displayName,
      email: rawEmail,
      phone: '',
      photoUrl: googleProfile?.photoUrl,
      authProvider: 'google',
      role: 'passenger',
    };

    setUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('metro_probati_user', JSON.stringify(updated));
      localStorage.setItem('metro_probati_google_email', rawEmail);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('metro_probati_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'passenger',
        isAuthenticated: !!user,
        loginAs,
        loginWithGoogle,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
