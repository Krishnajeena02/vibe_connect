import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import styles from '@/components/navbar/styles.module.css'
import {Sun,Moon} from 'lucide-react'

 const  ThemeSwitcher = ()=> {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevents hydration mismatch 
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button className={styles.toggle_btn}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      style={{
        padding: '8px 16px',
        borderRadius: '100%',
        border: 'none',
        cursor: 'pointer',
        background: theme === 'dark' ? '#222' : '#cbc8c8',
        color: theme === 'dark' ? '#fff' : '#000',
        transition: 'all 0.4s ease',
        transform: 'rotate(0deg)',
      }}
    >
      {theme === 'dark' ? <Sun className={styles.toggle_btn} /> : <Moon className={styles.toggle_btn}/>}
    </button>
  );
}
export default ThemeSwitcher;