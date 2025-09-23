
import React, { useEffect, useState } from 'react'
import UserLayout from '@/layout/userLayout/index'
import { useDispatch, useSelector } from 'react-redux'
import styles from './styles.module.css'
import { loginUser, registerUser } from '@/config/redux/action/authAction/index'; // <-- fix this line
import { emptyMessage } from '@/config/redux/reducer/authReducer';
import { useRouter } from 'next/router'

const LoginComponent = () => {
  const router = useRouter()
  const authState = useSelector((state) => state.auth)
  const [isLogin, setIsLogin] = useState(false);
  

  const dispatch = useDispatch();
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard")
    }


  }, [authState.loggedIn])
  useEffect(() => {
    dispatch(emptyMessage())

  }, [isLogin])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push("/dashboard")
    }
  }, [])
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
  });

  const handleRegister = () => {
    // console.log("registering")
    const { username, name, email, password } = formData;
    dispatch(registerUser({ username, password, email, name }))
  }

  const handleLogin = () => {
    // console.log("login")
    const { email, password } = formData;
    dispatch(loginUser({ email, password }))
  }
   const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/api/auth/google`;
 // backend endpoint
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <  UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>

          <div className={styles.cardContainer_left}>
            <p className={styles.cardLeft_heading} >{isLogin ? "sign in" : "sign up"}</p>

            <p style={{ color: authState.isError ? "red" : "green" }}>{authState.message}</p>


            <form onSubmit={handleSubmit} >
              <div className={styles.inputContainers}>
                {!isLogin && <div className={styles.inputRow}>
                  <input onChange={handleChange} name="username" value={formData.username} className={styles.inputFields} type='text' placeholder='User Name' />
                  <input onChange={handleChange} name="name" value={formData.name} className={styles.inputFields} type='text' placeholder='Name' />
                </div>}
                <input onChange={handleChange} name="email" value={formData.email} className={styles.inputFields} type='email' placeholder='Email' />
                <input onChange={handleChange} name="password" value={formData.password} className={styles.inputFields} type='password' placeholder='Password' />
                <div onClick={() => {
                  if (isLogin) {
                    handleLogin();
                  }
                  else {
                    handleRegister();
                  }
                }} className={styles.btn}>
                  <p >{isLogin ? "sign in" : "sign up"}</p>

                </div>
              </div>

            </form>
          </div>
          <div className={styles.cardContainer_right}>

            <div >
   <button onClick={handleGoogleLogin} class={styles.googlebtn}>
  <img src="\images\icons8-google-48.png" alt="" />
  Continue with Google
</button>
              {isLogin ? <p style={{ color: "white", fontSize: "1.2rem", fontWeight: "bold" }} >don't have an account</p> : <p style={{ color: "white", fontSize: "1.2rem", fontWeight: "bold" }}>already have an account</p>}
           
     

     
              <div onClick={() => {
                setIsLogin(!isLogin)
                setFormData({
                  username: '',
                  name: '',
                  email: '',
                  password: '',
                });
              }}
              
              style={{ color: "white", textAlign: "center", backgroundColor: "black", marginTop: "1rem" }} className={styles.btn}>
                <p >{isLogin ? "sign up" : "sign in"}</p>

              </div>
            </div>
          </div>
        </div>


      </div>
    </UserLayout>

  )
}

export default LoginComponent