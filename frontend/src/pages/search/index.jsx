import React, { useEffect, useState } from 'react';
import UserLayout from '@/layout/userLayout';
import DashBoardLayout from '@/layout/dashBoardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser, getAllUser } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import styles from './index.module.css';
import { useRouter } from 'next/router';

const SearchPage = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter()
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
     
    dispatch(getAllUser());
    dispatch(getAboutUser());
  }, []);
useEffect(() => {
    
  setFilterData(authState.all_users);
}, [authState.all_users]);
  
 const searchFilter= (e)=>{
  const searchValue= e.target.value;
  if(searchValue==""){
    setFilterData(authState.all_users);
    return;

  }
   const filter = authState.all_users.filter((user) =>
    user.userId?.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  setFilterData(filter);
 }
  return (
    <UserLayout>
      <DashBoardLayout>
        <div >
          <input className={styles.searchUser} type="text" placeholder="search user by name" onChange={searchFilter} />
        </div>

        <div  className={styles.allusersProfile}>
          {filterData  .filter(user => user.userId)
  .map((user) => (
            <div  onClick={()=>{
              if(user.userId?._id === authState.user?.userId?._id){
                router.push("/profile")
              }
              else{

                router.push(`/view_profile/${user.userId.username}`)
              }
            }} key={user._id} className={styles.userCard}>
              <img
                className={styles.userCard_image}
                src={user.userId.profilePicture === "default.jpg"
      ? "/images/default.jpg"
      : user.userId.profilePicture}
                alt="profile"
              />
              <div>
                <h1>{user?.userId?.name}</h1>
                <p>{user?.userId?.username}</p>
              </div>
            </div>
          ))}
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
};

export default SearchPage;
