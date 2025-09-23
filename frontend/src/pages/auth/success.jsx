// pages/dashboard/auth/success.jsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getAboutUser } from '@/config/redux/action/authAction';
import { setisToken } from '@/config/redux/reducer/authReducer';

const AuthSuccess = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!router.isReady) return; // Wait until router is fully ready

    const token = router.query.token;
    if (token) {
      localStorage.setItem("token", token);
      dispatch(setisToken());
     
      router.push('/dashboard');
    }
  }, [router.isReady, router.query, dispatch]);
  return <p>Logging you in...</p>;
};

export default AuthSuccess;