import React, { useImperativeHandle, forwardRef, useRef } from 'react'
import { ProfileProvider } from './context/profile'
import Settings from './settings/Settings'

const DMSettings = forwardRef(({ scheme, user, token, dev }, ref) => {
  const rProfile = useRef()

  useImperativeHandle(ref, () => ({
    load: () => {
      console.log("LOAD DATA!")
      rProfile.current.load()
    }
  }))

  return (
    <ProfileProvider token={token} dev={dev}>
      <Settings ref={rProfile} scheme={scheme} user={user}/>
    </ProfileProvider>
  )
})

export default DMSettings
