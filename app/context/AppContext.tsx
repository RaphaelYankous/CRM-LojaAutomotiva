'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface CompanyData {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  companyData: CompanyData;
  updateCompanyData: (data: CompanyData) => void;
}

const defaultCompanyData: CompanyData = {
  name: 'Concessionária Premium Ltda',
  cnpj: '12.345.678/0001-90',
  address: 'Av. das Américas, 1000 - Barra da Tijuca, Rio de Janeiro - RJ',
  phone: '(21) 99999-9999',
  email: 'contato@concessionariapremium.com.br',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData>(defaultCompanyData);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    
    const storedCompany = localStorage.getItem('companyData');
    if (storedCompany) {
      setCompanyData(JSON.parse(storedCompany));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      if (!isAuthenticated && pathname !== '/login') {
        router.push('/login');
      } else if (isAuthenticated && pathname === '/login') {
        router.push('/');
      }
    }
  }, [isAuthenticated, pathname, isLoaded, router]);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    router.push('/');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  const updateCompanyData = (data: CompanyData) => {
    setCompanyData(data);
    localStorage.setItem('companyData', JSON.stringify(data));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ isAuthenticated, login, logout, companyData, updateCompanyData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
