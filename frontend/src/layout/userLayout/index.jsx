import React from 'react'
import Navbar from '@/components/navbar/navbar'
const UserLayout = ({children,className}) => {
  return (
    <>
    <Navbar/>
    <div className={className}>{children}</div>
    </>
  )
}

export default UserLayout