import React, { useEffect } from 'react'
import UserLayout from '@/layout/userLayout'
import DashBoardLayout from '@/layout/dashBoardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { acceptConnectionRequest, getMyConnectionRequests } from '@/config/redux/action/authAction'
import { BASE_URL } from '@/config'
import styles from './index.module.css'
import { useRouter } from 'next/router'

const MyConnectionsPage = () => {

  const dispatch = useDispatch()
  const authState = useSelector((state)=>state.auth)
  const router = useRouter()
  // console.log(authState.user.userId)
  useEffect(()=>{
    dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}))
  },[])

  useEffect(()=>{
    if(authState.connectionRequest.length!=0){
  // console.log("connection request",authState.ConnectionRequests);
}
  },[authState.connectionRequest])
  return (
     <UserLayout>
    <DashBoardLayout >
           {/* <h3 style={{color:"red",background:"black"}}>my connections</h3> */}
         {authState.connectionRequest.length ===0 && <h1 >No connection requests</h1>}
       <div className={styles.myConnection}  >
           {authState.connectionRequest.length !=0 && authState.connectionRequest.filter((connection)=>connection.status_accepted===null).map((user,index)=>{
            return(
             <div className={styles.userCard} key={index} onClick={()=>{
              router.push(`/view_profile/${user.userId.username}`)
             }}>
              <div className={styles.user_profilePicture}>
                <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
              </div>
              <div className={styles.userInfo}>
                <h3>{user.userId.name}</h3>
                <p>{user.userId.username}</p>
              </div>
               <button onClick={(e)=>{
                e.stopPropagation()
        

                dispatch(acceptConnectionRequest({
                  requestId:user._id,
                  token:localStorage.getItem("token"),
                  action_type:"accept"
                })).then(()=>{

                  dispatch(acceptConnectionRequest({token:localStorage.getItem("token")}))
                })
               }} className={styles.connected_btn}>Accept</button>
          

             </div>
            )
           
           })}  

<h2 >Connections</h2>
            { authState.connectionRequest.filter((connection)=>connection.status_accepted==true).map((user,index)=>{
              return(

             
             <div className={styles.userCard} key={index} onClick={()=>{
              router.push(`/view_profile/${user.userId.username}`)
             }}>
              <div className={styles.user_profilePicture}>
                <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
              </div>
              <div className={styles.userInfo}>
                <h3>{user.userId.name}</h3>
                <p>{user.userId.username}</p>
              </div>
              
             </div>
            )           } )}

       </div>
     </DashBoardLayout>
      </UserLayout>
     
  )
}

export default MyConnectionsPage   