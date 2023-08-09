'use client'
// Component Imports
import { useEffect, useState } from 'react'
import { HeadComponent } from '@/components/head';

// Stylesheet Imports
import styles from '@/styles/Home.module.scss'
import { User } from '@/lib/interfaces';
import { LoggedOutPage } from '@/components/logged-out'

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log(localStorage);
    const user = localStorage.getItem('user');
    if (user && typeof user === 'string') {
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <>
      <HeadComponent />
      {!user && (
        <LoggedOutPage setParentUser={setUser} />
      )}
    </>
  );
}