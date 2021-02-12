import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { ProfileProvider } from './context/profile'
import ProfileSidebar from './profile/ProfileSidebar'
import Settings from './settings/Settings'

const DMProfileSidebar = forwardRef(({ scheme, user, token, dev }, ref) => {
  const rProfile = useRef()
  const rSettings = useRef()

  const [showSettings, setShowSettings] = useState(false)

  useImperativeHandle(ref, () => ({
    load: () => {
      console.log("LOAD DATA!")
      rProfile.current.load()
    }
  }))

  const handleSettings = (state) => {
    console.log(state)
    setShowSettings(state)
  }

  return (
    <ProfileProvider token={token} dev={dev}>
      <ProfileSidebar ref={rProfile} scheme={scheme} onSettings={handleSettings}/>
      {showSettings && <Settings ref={rSettings} user={user} scheme={scheme} onSettings={handleSettings} />}
    </ProfileProvider>
  )
})

export default DMProfileSidebar
