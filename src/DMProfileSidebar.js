import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { ProfileProvider } from './context/profile'
import ProfileSidebar from './profile/ProfileSidebar'
import Settings from './settings/Settings'

const DMProfileSidebar = forwardRef(({ scheme, user, token, dev, zIndex, top, minimizeShow, onClose, onRefill, onSettings, onUpdated, onChangeMembership }, ref) => {
  const rProfile = useRef()
  const rSettings = useRef()

  const [showSettings, setShowSettings] = useState(false)

  useImperativeHandle(ref, () => ({
    load: () => {
      rProfile.current.load()
    },
    closeSettings: () => {
      setShowSettings(false)
    },
    closeProfile: () => {

    }
  }))

  const handleSettings = (state) => {
    setShowSettings(state)
  }

  const handleUpdated = () => {
    //rProfile.current.load()
    if(onUpdated) onUpdated()
  }

  return (
    <ProfileProvider token={token} dev={dev}>
      <ProfileSidebar ref={rProfile} scheme={scheme} zIndex={zIndex} top={top} minimizeShow={minimizeShow} onSettings={handleSettings} onClose={onClose} onRefill={onRefill}/>
      {showSettings && <Settings ref={rSettings} user={user} scheme={scheme} onSettings={handleSettings} onUpdated={handleUpdated} onChangeMembership={onChangeMembership}/>}
    </ProfileProvider>
  )
})

export default DMProfileSidebar
