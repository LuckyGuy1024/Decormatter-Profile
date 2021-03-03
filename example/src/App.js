import React, { useEffect, useRef } from 'react'

import { DMProfileSidebar, DMSettings } from 'dm-profile'
import 'dm-profile/dist/index.css'

const App = () => {
  const rProfile = useRef()
  const rProfile2 = useRef()
  useEffect(() => {
    rProfile2.current.load()
  }, [])

  const getCookie = cname => {
    let name = cname + '='
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }
    return false
  }

  const getUserToken = () => {
    const userCookie = getCookie('user')
    if (userCookie === false) return null
    const userCookieObject = JSON.parse(atob(userCookie))
    return userCookieObject.puser.sessionToken
  }

  const getUser = () => {
    const userCookie = getCookie('user')
    
    if (userCookie === false) return null
    const userCookieObject = JSON.parse(atob(userCookie))
    return userCookieObject.puser
  }

  const handleProfileUpdated = e => {
    console.log("DO SOMETHING AFTER PROFILE UPDATED")
  }

  const handleChangeMembership = e => {
    console.log("CHANGE MEMBERSHIP")
  }
  return (
    <>
      <DMProfileSidebar ref={rProfile2} user={getUser()} token={getUserToken()} scheme="dark" onUpdated={handleProfileUpdated} onChangeMembership={handleChangeMembership} minimizeShow={true} dev />
      {/*<DMSettings ref={rProfile} user={getUser()} token={getUserToken()} scheme="dark" dev />*/}
    </>
  )
}

export default App
