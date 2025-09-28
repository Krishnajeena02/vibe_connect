import { BASE_URL, clientServer } from '@/config';
import DashBoardLayout from '@/layout/dashBoardLayout';
import UserLayout from '@/layout/userLayout';
import styles from './index.module.css'
import {  useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getAllPosts } from '@/config/redux/action/postAction';
import { useDispatch,useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { sendConnectionRequest,getConnectionRequest, getMyConnectionRequests } from '@/config/redux/action/authAction';



const User = ({userProfile}) => {

   const dispatch = useDispatch()
 const router  = useRouter()
 const authState = useSelector((state)=>state.auth)
 const postState = useSelector((state)=>state.post)
 const [userPost, setUserPost] = useState([])
 const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false)
 const [isConnectionNull, setIsConnectionNull] = useState(true)
 
const getUserPost = async()=>{
 dispatch(getAllPosts());
 dispatch(getConnectionRequest({token:localStorage.getItem("token")}))
    dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}))

}
useEffect(()=>{
  const post = postState.posts.filter((p)=>{
    return p.userId.username === router.query.username
  })
  setUserPost(post)
},[postState.posts])

useEffect(() => {
  // console.log("connections", authState.connections);
if (!authState.connections.length) return;
  const foundConnection = authState.connections.find(
    user => user.connectionId?._id === userProfile.userId._id
  );

  if (foundConnection) {
    setIsCurrentUserInConnection(true);
    setIsConnectionNull(!foundConnection.status_accepted); 
  } else {
    setIsCurrentUserInConnection(false);
    setIsConnectionNull(true);
  }
  //NOTE:this code is pending i will work on latter
  // const isMyProfile = authState.connectionRequest.find(user=>user.userId._id===userProfile.userId._id);
  
  // if(isMyProfile){
  //   setIsCurrentUserInConnection(true); 
  //    setIsConnectionNull(!isMyProfile.status_accepted);
    
  // }
  // else{
  //   setIsCurrentUserInConnection(false)
  //   setIsConnectionNull(true)
  // }

}, [authState.connections, authState.connectionRequest]);

useEffect(() => {
  getUserPost()

}, []);


  return (
   <UserLayout>
    <DashBoardLayout>
  <div className={styles.container}>
    <div className={styles.backDropContainer}>
                  <img className={styles.backDropImage} src={userProfile.userId.profilePicture} alt="" />
      
    </div>
    <div className={styles.profileDetail_Container}>
                 <img className={styles.img} src={userProfile.userId.profilePicture} alt="" />

      <div className={styles.profileDetail_flex} style={{display:"flex", gap:"0.7rem"}}>
        <div style={{flex:"0.8"}}>
        <div style={{display:"flex", gap:"1rem", width:"fit-content", justifyContent:"center", alignItems:"center"}}>
          <h2>{userProfile.userId.name}</h2>
          <p style={{color:"gray"}}>@{userProfile.userId.username}</p>
        </div>

        <div style={{display:"flex", alignItems:"center", gap:"1rem"}}>
     {isCurrentUserInConnection ? 
  <button className={styles.connected_btn}>
    {isConnectionNull ? "Pending" : "Connected"}
  </button> :
  <button className={styles.connect_btn} onClick={ async () => {
    dispatch(sendConnectionRequest({ 
      token: localStorage.getItem("token"), 
      connectionId: userProfile.userId._id 
    }));
    setIsCurrentUserInConnection(true);  // Update UI instantly
    setIsConnectionNull(true);           // Assume request is pending
  }}>
    Connect
  </button>
}
<div onClick={async()=>{
  const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`)
  window.open(`${BASE_URL}/${response.data.message}` , "_blank")
}}>
                <FontAwesomeIcon style={{cursor:"pointer",width:"1.2em"}} className={styles.downlaod} icon={faDownload} />
</div>
</div>
           <div>
          {userProfile.bio}
        </div>
        
        <div style={{flex:"0.2"}}>
          <h3>recent activity</h3>
                         <div className={styles.recentPostsGrid}>

          {userPost.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,6).map((post)=>{
            // {console.log(post)}
            return(
              <div key={post._id} className={styles.postCard}>

                <div className={styles.card}>
                  <div className={styles.card_profileContainer}>
                    
                    {post.media !== "" ? <img style={{borderRadius:"10px"}} src={`${BASE_URL}/${post.media}`} alt='' ></img>: <div > </div> }
                     </div> 
                     <p style={{fontSize:"0.8rem",textAlign:"center",padding:"0.6rem",width:"100%", borderRadius:"0 10px 20px 10px", backgroundColor:"#DEE0EC"}}><b>Caption: </b> {post.body}</p>

                </div>
              </div>
            )
          })}
          </div>  
          </div> 
        
        </div>
        
     
      </div>
    </div>
    
  </div>
    </DashBoardLayout>
   </UserLayout>
  )
}

export default User


export const getServerSideProps = async (context) => {
  const { username } = context.params;

  try {
    const response = await clientServer.get('/user/get_profile_based_on_username', {
      params:  {username }
    });

    const profile = response.data.Profile[0];

    if (!profile) {
      return { notFound: true };
    }

    // Fix: ensure profile is serializable
    const serializableProfile = JSON.parse(JSON.stringify(profile));

    return {
      props: {
        userProfile: serializableProfile,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};