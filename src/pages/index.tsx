'use client'
// Component Imports
import { useEffect, useState } from 'react'
import { HeadComponent } from '@/components/head';

// Stylesheet Imports
import styles from '@/styles/Home.module.scss'
import { LoggedOutPage } from '@/components/logged-out'

interface User {
  id: string;
  auth: string;
  credits: number;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log(localStorage);
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  async function handleRegister() {

  }

  return (
    <>
      <HeadComponent />
      {!user && (
        <LoggedOutPage />
      )}
    </>
  );
}