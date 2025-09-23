import React, { useEffect } from 'react';
import UserLayout from '@/layout/userLayout';
import DashBoardLayout from '@/layout/dashBoardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getMyConnectionRequests } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import styles from './index.module.css';
import { useRouter } from 'next/router';

const MessagesPage = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
  }, []);

  return (
    <UserLayout>
      <DashBoardLayout>
        <h2 style={{ marginBottom: "1rem" }}>Start a Chat</h2>

        {/* {authState.connectionRequest.length === 0 && <h3>No connections available</h3>} */}
            <h1>coming soon </h1>
        <div className={styles.myConnection}>
          {/* {authState.connectionRequest
            .filter((connection) => connection.status_accepted != null)
            .map((user, index) => (
              <div
                className={styles.userCard}
                key={index}
                onClick={() => {
                  router.push(`/message/${user.userId._id}`);
                }}
              >
                <div className={styles.user_profilePicture}>
                  <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="Profile" />
                </div>
                <div className={styles.userInfo}>
                  <h3>{user.userId.name}</h3>
                  <p>{user.userId.username}</p>
                </div>
              </div>
            ))} */}
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
};

export default MessagesPage;
