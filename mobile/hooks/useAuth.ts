import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
  } = useAuthStore();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPin, setRegisterPin] = useState('');
  const [registerGender, setRegisterGender] = useState('');
  
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      return false;
    }

    await login(loginEmail, loginPassword);
    if (isAuthenticated) {
      router.replace('/(tabs)');
      return true;
    }
    return false;
  };

  const handleRegister = async () => {
    if (!registerName || !registerEmail || !registerPassword || !registerGender || !registerUsername || !registerPin) {
      return false;
    }
  
    await register(registerName, registerEmail, registerPassword, registerGender, registerUsername, registerPin);
    
    // Ganti redirect setelah register:
    router.replace('/auth/login'); // <-- langsung ke halaman login
    return true;
  };
  
  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    registerName,
    setRegisterName,
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    registerUsername,
    setRegisterUsername,
    registerPin,
    setRegisterPin,
    registerGender,
    setRegisterGender,
    handleLogin,
    handleRegister,
    handleLogout,
    updateUser,
  };
}
