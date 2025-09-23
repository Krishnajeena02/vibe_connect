import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css"

import UserLayout from "@/layout/userLayout";


export default function Home() {
  const router = useRouter();
  return (
    // <UserLayout >
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.mainContainer_left}>
          <p>Connect with friends without Exaggeration</p>

          <p>A True social media platform, with stories no blufs !</p>

          <div onClick={()=>{
            router.push("/login")
          }} className={styles.joinButton}>
            Join Now
          </div>

        </div>
        <div className={styles.mainContainer_right}>
        {/* <img className={styles.social_img}
              src="/images/istockphoto-1014903134-612x612.jpg"
              alt="Social Media" 
            /> */}
        </div>
      </div>
    </div>
     
    // </UserLayout>
  );
}
