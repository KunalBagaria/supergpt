'use client'
// Component Imports
import { useEffect, useState } from 'react'
import { HeadComponent } from '@/components/head';

// Stylesheet Imports
import styles from '@/styles/Home.module.scss'
import { User } from '@/lib/interfaces';
import { LoggedOutPage } from '@/components/logged-out'
import { useUser } from '@/components/context';

export default function Home() {
  const user = useUser();
  return (
    <>
      <HeadComponent />
      {!user && (
        <LoggedOutPage />
      )}
    </>
  );
}