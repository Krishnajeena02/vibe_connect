import { getAboutUser } from '@/config/redux/action/authAction';
import { createPost, deletePost, getAllPosts, deleteComment, increamentLike, getComments, postComments } from '@/config/redux/action/postAction';
import { getAllUser } from '@/config/redux/action/authAction';
import UserLayout from '@/layout/userLayout';
import DashBoardLayout from '@/layout/dashBoardLayout';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '@/config/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './index.module.css'
import { googleLoginSuccess } from '@/config/redux/reducer/authReducer';
import { setisToken } from '@/config/redux/reducer/authReducer';
import { format } from "timeago.js"
import { resetPostId } from '@/config/redux/reducer/postReducer';
import { BadgeCheck } from 'lucide-react';


const Dashboard = () => {
  // const [isToken, setIsToken] = useState(false);                                 
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth)
  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();
  const [commentText, setCommentText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);


  const postState = useSelector((state) => state.post);


  const handlePost = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }))
    setPostContent("")
    setFileContent(null)
    await dispatch(getAllPosts())
  }
  const handleOpenMedia = (media) => {
    setSelectedMedia(media);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMedia(null);
  };
  // ✅ Handle Google login token from URL
  useEffect(() => {
    const gid = localStorage.getItem('googleId');
    if (gid) {
      dispatch(getAboutUser({ googleId: gid }));
      dispatch(getAllPosts({ googleId: gid }));
    }
    if (!router.isReady) return;

    const tokenFromUrl = router.query.token;
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      dispatch(setisToken());
      dispatch(getAboutUser({ token: tokenFromUrl }));
      dispatch(getAllPosts());
      router.replace('/dashboard'); // remove token from URL
    }
  }, [router.isReady, router.query.token]);
  useEffect(() => {
    if (authState.isToken) {


      // console.log("auth state getting")
      dispatch(getAllPosts())
      dispatch(getAboutUser({ token: localStorage.getItem("token") }))

    }

    const token = localStorage.getItem("token");
    if (token && !authState.profileFetched) {
      dispatch(getAboutUser({ token }));
      dispatch(getAllPosts());
    }
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUser());
    }
  }, [authState.isToken])



  const userId = authState?.user?.userId;
  // console.log("Posts:", postState.posts);


  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.scrollComponent}>
          <div className={styles.createpostContainer}>

            <img className={styles.userProfile}
              width="50px"
              src={userId?.profilePicture}
              alt="profile"
            />
            <textarea onChange={(e) => { setPostContent(e.target.value) }} value={postContent} placeholder='Write Here' className={styles.textArea} name="" id=""></textarea>
            <label htmlFor="fileupload">
              <div className={styles.fab}>
                <FontAwesomeIcon className={styles.add} icon={faPlus} />
              </div>

            </label>
            <input onChange={(e) => { setFileContent(e.target.files[0]) }} hidden accept="image/*,video/*" type="file" id='fileupload' />

            {postContent.length > 0 &&
              <div onClick={handlePost}
                className={styles.uploadBtn}>Post</div>
            }




          </div>


          <div className={styles.postContainer}>
            {authState?.user?.userId && Array.isArray(postState.posts) && (
              postState.posts.map((post) => {
                return (
                  <div key={post._id} className={styles.card}>
                    <div className={styles.card_profileContainer} >

                      <img onClick={() => {
                         if(post.userId?._id === authState.user?.userId?._id){
                router.push("/profile")
              }
              else{

                router.push(`/view_profile/${user.userId.username}`)
              }

                      }} className={styles.userprofile} width="50px" src={post.userId.profilePicture === "default.jpg"
      ? "/images/default.jpg"
      : post.userId.profilePicture} alt="profile" />
                      <div>
                        <div style={{ display: "flex", gap: "1.2rem", justifyContent: "space-between", alignItems: "center" }}>
                          <p className={styles.name}>{post.userId.name}<BadgeCheck className={styles.badgeIcon} width={"16px"} /></p>
                          {post?.userId?._id === authState?.user?.userId?._id &&
                            <div onClick={async () => {
                              await dispatch(deletePost({ post_id: post._id }))
                              await dispatch(getAllPosts())
                            }}>

                              <FontAwesomeIcon style={{ display: "inline", backgroundColor: "transparent", color: "red", marginRight: "-40px", cursor: "pointer", }} icon={faTrash} />
                            </div>}
                        </div>
                        <div style={{ display: "flex", width: "fit-content", justifyContent: "center", alignItems: "center" }}>
                          <p style={{ color: "gray", marginLeft: "-8px" }}>@{post.userId.username}</p>
                          <span className={styles.createdAt} style={{ marginLeft: "1rem", }}>
                            {format(post.createdAt)}
                          </span>
                        </div>

                        <p style={{ paddingTop: "1rem" }}>{post.body}</p>

                        <div className={styles.card_image} onClick={() => handleOpenMedia(post.media)} style={{ cursor: "pointer" }}>
                          {post.media && (
                            <div
                              className={styles.card_image}
                              onClick={() => handleOpenMedia(post.media)}
                              style={{ cursor: "pointer" }}
                            >
                              {post.media?.match(/\.(mp4|webm|ogg)$/i) ? (
                                <video
                                  muted
                                  controls
                                  autoPlay
                                  playsInline
                                  width="100%"
                                  style={{ borderRadius: "10px" }}
                                >
                                  <source src={post.media} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <img
                                  src={post.media}
                                  alt="media"
                                  style={{ width: "100%", borderRadius: "10px" }}
                                />
                              )}
                            </div>
                          )}

                        </div>

                      </div>
                    </div>
                    <div className={styles.optionsContainer}>
                      {postState.postId !== "" &&
                        <div onClick={() => {
                          dispatch(resetPostId())
                        }} className={styles.commentContainer}>
                          <div onClick={(e) => {
                            e.stopPropagation()
                          }} className={styles.allCommentsContainer}>
                            {postState.comments.length === 0 && <h2>No Comments</h2>}

                            {postState.comments.length !== 0 &&

                              <div>
                                {postState.comments.map((postComment, index) => {
                                  return (
                                    <div className={styles.singleComment} key={postComment._id}>
                                      {/* {comment?.userId?._id === authState?.user?.userId?._id && */}
                                      {/* </div>} */}
                                      <div className={styles.comment_profileContainer}>
                                        {/* <img className={styles.userprofile} width="50px" src={`${BASE_URL}/${postComment.userId.profilePicture}`} alt="profile" /> */}
                                        <div>
                                          <div className={styles.commentOwner} style={{ marginTop: "1rem" }}>
                                            <p style={{ fontWeight: 'bold', fontSize: "1.2rem" }}>{postComment.userId.name}</p>
                                            <p >@{postComment.userId.username}</p>

                                          </div>
                                            {/* {  console.log("authstate",authState.user.userId._id)}
                                            {  console.log("poststate",postState.user.userId._id)} */}
                                            {/* {console.log(postState)} */}
                                          <p className={styles.comment}>{postComment.comment}  </p>
                                          {(authState?.user?.userId?._id?.toString() === postComment?.userId?._id?.toString() || 
  authState?.user?.userId?._id?.toString() === postState?.userId?._id?.toString() ) && (
                                              <div className={styles.delete_btn} onClick={async () => {
                                                await dispatch(deleteComment({ comment_id: postComment._id }))
                                                await dispatch(getComments({ post_id: postState.postId }))

                                              }}>

                                                <FontAwesomeIcon style={{
                                                  color: "red",
                                                  cursor: "pointer",
                                                  marginTop: "-5.1rem",
                                                  marginLeft: "auto", // pushes it to the right
                                                  backgroundColor: "transparent"
                                                }} icon={faTrash} />
                                              </div>
                                            )}

                                        </div>


                                      </div>

                                    </div>
                                  )
                                })}
                              </div>
                            }

                            <div className={styles.postCommentContainer}>
                              < input type='text' style={{ color: "black", fontWeight: "500" }} onChange={(e) => setCommentText(e.target.value)} placeholder="comments" value={commentText}   ></input>

                              <div className={styles.comment_btn} onClick={async () => {

                                await dispatch(postComments({ post_id: postState.postId, body: commentText }))
                                setCommentText("")
                                await dispatch(getComments({ post_id: postState.postId }))

                              }} > <p>comment</p></div>


                            </div>
                          </div>

                        </div>

                      }
                      <div onClick={async () => {
                        dispatch(increamentLike({ post_id: post._id })
                        )
                      }} className={styles.option} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16l-97.5 0c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8l97.5 0c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0z" /></svg>
                        <p>{post.likes}</p>
                      </div>
                      <div onClick={() => {
                        dispatch(getComments({ post_id: post._id }))
                      }} className={styles.option}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9l.3-.5z" /></svg>
                      </div>
                      <div  onClick={() => {
    const text = encodeURIComponent(post.body);
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`;
    window.open(shareUrl, "_blank");
     
  }} className={styles.option}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                        </svg>


                      </div>
                    </div>

                  </div>
                )


              }
              ))
            }
          </div>
        </div>
        {showModal && (
          <div className={styles.mediaModalOverlay} onClick={handleCloseModal}>
            <div className={styles.mediaModal} onClick={(e) => e.stopPropagation()}>
              {selectedMedia.endsWith(".mp4") || selectedMedia.endsWith(".webm") || selectedMedia.endsWith(".ogg") ? (
                <video
                  src={selectedMedia}
                  controls
                  autoPlay
                  className={styles.mediaModalVideo}
                />
              ) : (
                <img
                  src={selectedMedia}
                  alt="Full View"
                  className={styles.mediaModalImage}
                />
              )}
              <a href={selectedMedia} download className={styles.downloadButton}>Download</a>
            </div>
          </div>
        )}


      </DashBoardLayout>
    </UserLayout>
  )
}

export default Dashboard                                                                              