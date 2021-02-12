import React, { useState, createContext, useContext } from 'react'
import { api } from '../utils'
export const ProfileContext = createContext()

const ProfileProvider = ({dev, token, ...props}) => {
  const DEV_ENDPOINT = 'https://decormatters-dev.herokuapp.com/parse/functions/'
  const PROD_ENDPOINT = 'https://decormatters-prod.herokuapp.com/parse/functions/'

  const DEV_APPID = 1
  const PROD_APPID = 3

  const [endpoint, setEndpoint] = useState(DEV_ENDPOINT)
  const [appid, setAppid] = useState(DEV_APPID)

  const [profile, setProfile] = useState(null)
  const [user, setUser] = useState(null)
  const [membership, setMembership] = useState(null)
  //const [endpoint, setEndpoint] = useState(PROD_ENDPOINT)
  //const [appid, setAppid] = useState(PROD_APPID)
/*
  useEffect(() => {
    
    console.log(dev)
    if (!dev) {
      setEndpoint(PROD_ENDPOINT)
      setAppid(PROD_APPID)
      return
    }

    console.log("GOT HERE")
    setEndpoint(DEV_ENDPOINT)
    setAppid(DEV_APPID)
    console.log(endpoint)
  },[dev])
*/
  const loadProfile = async () => {
    let me = await api(endpoint + 'getMe1', appid, token, JSON.stringify({}))
    const result = me.result
    var pic = ''
      if(result.user && result.user.thumbProfileImageFile) {
        pic = result.user.thumbProfileImageFile.url
      } else if (result.user && result.user.cfTbImageUrl) {
        pic = result.user.cfTbImageUrl
      } else {
        pic = 'https://didr9pubr8qfh.cloudfront.net/mobile_other/profile_avatars/Profile5.png'
      }
    const d = {...result, pic}
    setProfile(d)

    let sub = await api(endpoint + 'getImageSubscription1', appid, token, JSON.stringify({}))

    if(!sub.result.imageSubscriptionInfo) setMembership(null)
    else if (Object.keys(sub.result.imageSubscriptionInfo).length === 0 && sub.result.imageSubscriptionInfo.constructor === Object) setMembership(null)
    else setMembership(sub.result.imageSubscriptionInfo)

    
    return d
  }

  const saveUsername = async (username) => {
    let data = await api(endpoint + 'updateUserUniqueDisplayName1', appid, token, JSON.stringify({uniqueDisplayName: username}))    
    return data
  }

  const saveProfile = async (body) => {
    let data = await api(endpoint + 'updateUser1', appid, token, JSON.stringify(body))    
    return data
  }

  const updateEmail = async (email) => {
    const body = {
      email
    }
    let data = await api(endpoint + 'updateUser1', appid, token, JSON.stringify(body))    
    return data
  }

  const resetPassword = async (email) => {
    const body = {
      email
    }
    let data = await api(endpoint + 'requestPasswordReset1', appid, token, JSON.stringify(body))    
    return data
  }

  return (
    <ProfileContext.Provider
      value={{ endpoint, appid, profile, membership, loadProfile, saveUsername, saveProfile, updateEmail, resetPassword }}
      {...props}
    />
  )
}

const useProfile = () => useContext(ProfileContext)
export { ProfileProvider, useProfile }
