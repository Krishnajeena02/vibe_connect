import { BASE_URL, clientServer } from '@/config';
import DashBoardLayout from '@/layout/dashBoardLayout';
import UserLayout from '@/layout/userLayout';
import styles from './index.module.css'
import React, { useEffect, useState } from 'react'
import { getAllPosts } from '@/config/redux/action/postAction';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { getAboutUser } from '@/config/redux/action/authAction';
import ThemeSwitcher from '@/components/navbar/darkmode';
const Profile = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const authState = useSelector((state) => state.auth)
  const postState = useSelector((state) => state.post)
  const [userPost, setUserPost] = useState([])
  const [userProfile, setuserProfile] = useState({
    userId: {
      name: "",
      username: "",
      profilePicture: ""
    },
    bio: "",
    pastWork: [],
    // education:[]
  });

  const getUserPost = async () => {
    dispatch(getAllPosts());

  }

  const updateProfilePicture = async (file) => {
    const formData = new FormData;
    formData.append("profile_picture", file)
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post("/update/profile_picture", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
    dispatch(getAboutUser({ token: localStorage.getItem("token") }))
  }

  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name
    })
    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,


    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }))

  }
  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }))
    dispatch(getAllPosts())
  }, [])
  useEffect(() => {
    if (authState.user != undefined) {
      setuserProfile(authState.user)


      const post = postState.posts.filter((p) => {
        return p.userId.username === authState.user.userId.username
      })
      // console.log(post, authState.user.userId.username)
      setUserPost(post)
    }
  }, [authState.user, postState.posts])


  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer} >
            <img className={styles.backDropImage} src={
              userProfile.userId.profilePicture
                ? userProfile.userId.profilePicture
                : "/default.jpg"
            } alt="" />

            <label htmlFor='profilePictureUpload' className={styles.backDrop_overlay}>
              <p >edit</p>
            </label>
            <input onChange={(e) => updateProfilePicture(e.target.files[0])} type="file" hidden id="profilePictureUpload" />
            <img className={styles.img} src={
              userProfile.userId.profilePicture?.trim()
                ? userProfile.userId.profilePicture
                : "images/default.jpg"
            } alt="" />


          </div>
          <div className={styles.toggle_button}>

            <ThemeSwitcher />
          </div>
          <div className={styles.profileDetail_Container}>
            <div className={styles.profileDetail_flex} style={{ display: "flex", gap: "0.7rem" }}>
              <div style={{ flex: "0.8" }}>
                <div style={{ display: "flex", width: "fit-content", justifyContent: "space-around", alignItems: "center" }}>
                  <input className={styles.editName} type="text" value={userProfile.userId.name || userProfile.userId.username} onChange={(e) => setuserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })} id="" />
                  <p className={styles.username} style={{ color: "gray", }}>@{userProfile.userId.username}</p>
                </div>


                <div>
                  <textarea placeholder='write bio' className={styles.bio} value={userProfile.bio} onChange={(e) => setuserProfile({ ...userProfile, bio: e.target.value })} rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))} style={{ width: "100%" }}></textarea>

                </div>
                {userProfile != authState.user && <div onClick={updateProfileData} className={styles.updateBtn}>
                  Update
                </div>}
                <div  >
                  <h3>recent activity</h3>
                  <div className={styles.recentPostsGrid}>
                    {userPost.slice(0, 6).map((post) => {
                      // {console.log(post)}
                      return (
                        <div key={post._id} className={styles.postCard}>

                          <div className={styles.card}>
                            <div className={styles.card_profileContainer}>
                              {post.media?.match(/\.(mp4|webm|ogg)$/i) ? (
                                <video className={styles.effect}
                                  muted
                                  controls
                                  autoPlay
                                  playsInline
                                  width="100%"
                                  style={{ borderRadius: "10px" }}
                                >
                                  <source src={`${BASE_URL}/${post.media}`} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              ) : (



                                <img className={styles.effect} style={{ borderRadius: "20px 0 " }} src={`${BASE_URL}/${post.media}`} alt='' ></img>
                              )}
                            </div>
                            <p className={styles.caption} style={{ fontSize: "0.8rem", padding: "0.6rem", width: "100%", borderRadius: "0 10px 20px 10px", backgroundColor: "#DEE0EC" }}><b>Caption: </b> {post.body}</p>

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
export default Profile;

