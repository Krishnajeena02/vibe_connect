import React, { useState } from 'react'
import styles from '@/components/navbar/styles.module.css'
import { useRouter } from 'next/router'
import { reset } from '@/config/redux/reducer/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '@/config/index';
import ThemeSwitcher from './darkmode';
const Navbar = () => {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
const dispatch = useDispatch();

  const handleLogout = ()=>{
    localStorage.removeItem('token');
    dispatch(reset());
    router.push("/login")
  }
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h2 style={{ cursor: "pointer",  }} onClick={() => router.push("/")}>Vibe</h2>


        {authState.profileFetched && authState.user.userId && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", position:"relative" }}>
       
          <p className={styles.name} >hey, {authState.user.userId.name||authState.user.userId.username}</p>
            <img onClick={()=>{
              router.push("/profile")
            }} style={{ borderRadius: "50%", border:"none", cursor: "pointer", width: "40px", height: "40px",  }}
             src={
    authState.user.userId.profilePicture?.trim()?
    authState.user.userId.profilePicture
      : "/images/default.jpg"
  } alt="" />
          
          <div onClick={handleLogout} className={styles.dropdown}>
            <button  className={styles.logout_btn}>

           Logout
            </button>

          </div>

          


        </div>}

        {!authState.profileFetched && <div onClick={() => {
          router.push("/login")
        }} className={styles.joinButton}>
          Be A Part
        </div>}
      </nav>
    </div>
  )
}

export default Navbar