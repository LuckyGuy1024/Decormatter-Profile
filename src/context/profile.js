import React, { useState, createContext, useContext } from 'react'
import { api } from '../utils'
export const ProfileContext = createContext()

const ProfileProvider = ({ dev, token, ...props }) => {
  const DEV_STRIPE_AUTH_TOKEN = 'Bearer sk_test_51HDYfWDVqvipRL9ob3kdcUigXUpeeSFyyyyEY1ZwXkHjQQNujXEknQWVzElhT4i2sCml2yRprWFTutNF9U38CZlb00ey2MvCe1'
  const PROD_STRIPE_AUTH_TOKEN = 'Bearer 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'

  const DEV_REVENUS_CAT_AUTH_TOKEN = 'Bearer TmhuQZnVUunBqhidvCeHWJsZKXqJGFaN'
  const PROD_REVENUS_CAT_AUTH_TOKEN = 'Bearer fcmwBtEumrGWgLxrCNEAmNfclksYaooR'

  const DEV_ENDPOINT = 'https://decormatters-dev.herokuapp.com/parse/functions/'
  const PROD_ENDPOINT = 'https://decormatters-prod.herokuapp.com/parse/functions/'

  const DEV_APPID = 1
  const PROD_APPID = 3

  const [endpoint, setEndpoint] = useState(DEV_ENDPOINT)
  const [appid, setAppid] = useState(DEV_APPID)

  const [profile, setProfile] = useState(null)
  const [user, setUser] = useState(null)
  const [membership, setMembership] = useState(null)
 
  const loadMembership = async userid => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: !dev ? PROD_REVENUS_CAT_AUTH_TOKEN : DEV_REVENUS_CAT_AUTH_TOKEN
      }
    }

    const url = 'https://api.revenuecat.com/v1/subscribers/' + userid
    const response = await fetch(url, options)
    const result = await response.json()

    return result
  }

  const loadMembershipProduct = async prodid => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: !dev ? PROD_STRIPE_AUTH_TOKEN : DEV_STRIPE_AUTH_TOKEN
      }
    }

    const produrl = 'https://api.stripe.com/v1/products/' + prodid
    const rprod = await fetch(produrl, options)
    const resprod = await rprod.json()

    const priceurl = 'https://api.stripe.com/v1/prices'
    const rprice = await fetch(priceurl, options)
    const resprice = await rprice.json()

    for (var x = 0; x < resprice.data.length; x++) {
      if (resprice.data[x].product === resprod.id) {
        resprod['price'] = resprice.data[x]
        resprod['nickname'] = resprice.data[x].nickname
      }
    }

    return resprod
  }

  const loadProfile = async () => {
    let me = await api(endpoint + 'getMe1', appid, token, JSON.stringify({}))
    const result = me.result
    var pic = ''
    if (result.user && result.user.thumbProfileImageFile) {
      pic = result.user.thumbProfileImageFile.url
    } else if (result.user && result.user.cfTbImageUrl) {
      pic = result.user.cfTbImageUrl
    } else {
      pic = 'https://didr9pubr8qfh.cloudfront.net/mobile_other/profile_avatars/Profile5.png'
    }
    const d = { ...result, pic }
    setProfile(d)

    let sub = await api(endpoint + 'getImageSubscription1', appid, token, JSON.stringify({}))

    if (!sub.result.imageSubscriptionInfo) setMembership(null)
    else if (Object.keys(sub.result.imageSubscriptionInfo).length === 0 && sub.result.imageSubscriptionInfo.constructor === Object) setMembership(null)
    else setMembership(sub.result.imageSubscriptionInfo)

    return d
  }

  const saveUsername = async username => {
    let data = await api(endpoint + 'updateUserUniqueDisplayName1', appid, token, JSON.stringify({ uniqueDisplayName: username }))
    return data
  }

  const saveProfile = async body => {
    let data = await api(endpoint + 'updateUser1', appid, token, JSON.stringify(body))
    return data
  }

  const updateEmail = async email => {
    const body = {
      email
    }
    let data = await api(endpoint + 'updateUser1', appid, token, JSON.stringify(body))
    return data
  }

  const resetPassword = async email => {
    const body = {
      email
    }
    let data = await api(endpoint + 'requestPasswordReset1', appid, token, JSON.stringify(body))
    return data
  }

  return <ProfileContext.Provider value={{ endpoint, appid, profile, membership, loadMembership, loadMembershipProduct, loadProfile, saveUsername, saveProfile, updateEmail, resetPassword }} {...props} />
}

const useProfile = () => useContext(ProfileContext)
export { ProfileProvider, useProfile }
