import React, { Children, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons'
import styles from './index.module.css'
import { setisToken } from '@/config/redux/reducer/authReducer'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser, getAllUser } from '@/config/redux/action/authAction'
import { baseURL } from '@/config/index'
import { Home, Search, Users, CircleUserRound, Sun, MessageCircleMore } from "lucide-react"
import ThemeSwitcher from '@/components/navbar/darkmode';

const DashBoardLayout = ({ children }) => {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth)
    const postState = useSelector((state) => state.post)


    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            router.push("/login")
        }

        dispatch(setisToken());
        dispatch(getAllUser())
        dispatch(getAboutUser())
    }, [])
    const router = useRouter();
    if (
        authState.isLoading ||

        !authState.all_profiles_fetched
    ) {
        return (
            <>
                <div className={styles.loadingWrapper}>
                    <div className={styles.spinner}></div>
                    <p className={styles.message}>Loading....</p>
                </div>
            </>
        )
    }
    return (
        <div className={styles.container}>

            <div className={styles.homeContainer}>
                <div className={styles.homeContainer_leftBar}>
                    <div onClick={() => {
                        router.push("/dashboard")
                    }} className={`${styles.sideBar_option} ${router.pathname === "/dashboard" ? styles.active : ""}`}>

                        <Home className={styles.home_icon} />
                        <p>Home</p>
                    </div>
                    <div onClick={() => {
                        router.push("/search")
                    }} className={`${styles.sideBar_option} ${router.pathname === "/search" ? styles.active : ""}`}>

                        <Search className={styles.home_icon} />
                        <p>Search</p>
                    </div>
                    {/* <div onClick={() => {
                        router.push("/message")
                    }} className={`${styles.sideBar_option} ${router.pathname === "/message" ? styles.active : ""}`}>

                        <MessageCircleMore strokeWidth={1.5} className={styles.home_icon}  />
                        <p>Message</p>
                    </div> */}
                    <div onClick={() => {
                        router.push("/myConnection")
                    }} className={`${styles.sideBar_option} ${router.pathname === "/myConnection" ? styles.active : ""}`}>

                        <Users className={styles.home_icon} />
                        <p style={{ width: "220px" }} >My Connections</p>


                    </div>
                    <div onClick={() => {
                        router.push("/profile")
                    }} className={`${styles.sideBar_option} ${router.pathname === "/profile" ? styles.active : ""}`}>

                        <CircleUserRound className={styles.home_icon} />
                        <p  >Profile</p>


                    </div>


                </div>
                <div className={styles.feedContainer}>
                    {children}
                </div>
                <div className={styles.extraContainer}>
                    <h2>Top Profile</h2>


                    {authState.all_profiles_fetched && Array.isArray(authState.all_users) && (
                        authState.all_users.slice(0, 10).map(profile => (
                            <div key={profile._id}>
                                <p>{profile?.userId?.name}</p>

                            </div>
                        ))
                    )}


                </div>
                <div className={styles.toggle_button}>

                    <ThemeSwitcher />
                </div>
            </div>

            <div className={styles.phoneView_navbar}>
                <div onClick={() => {
                    router.push("/dashboard")
                }} className={`${styles.navbar_singleItem_phoneView_navbar} ${router.pathname === "/dashboard" ? styles.active : ""}`} >
                    <Home className={styles.home_icon} />



                </div>
                <div onClick={() => {
                    router.push("/search")
                }} className={`${styles.navbar_singleItem_phoneView_navbar} ${router.pathname === "/search" ? styles.active : ""}`}>
                    <Search className={styles.home_icon} />




                </div>
                {/* <div onClick={() => {
                        router.push("/message")
                    }} className={`${styles.navbar_singleItem_phoneView_navbar} ${router.pathname === "/message" ? styles.active : ""}`}>
                                           <MessageCircleMore strokeWidth={1.5} className={styles.home_icon}  />




                </div> */}

                <div onClick={() => {
                    router.push("/myConnection")
                }} className={`${styles.navbar_singleItem_phoneView_navbar} ${router.pathname === "/myConnection" ? styles.active : ""}`}>
                    <Users className={styles.home_icon} />




                </div>
                <div onClick={() => {
                    router.push("/profile")
                }} className={`${styles.navbar_singleItem_phoneView_navbar} ${router.pathname === "/profile" ? styles.active : ""}`}>
                    <CircleUserRound className={styles.home_icon} />




                </div>
            </div>
        </div>
    )
}

export default DashBoardLayout