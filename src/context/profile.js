import React, { useState, createContext, useContext, useEffect } from 'react'
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

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [member, setMember] = useState(false)
  const [membership, setMembership] = useState({})

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
    const ep = dev === true ? DEV_ENDPOINT : PROD_ENDPOINT
    const ai = dev === true ? DEV_APPID : PROD_APPID

    let me = await api(ep + 'getMe1', ai, token, JSON.stringify({}))
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
    /*
    //Old membership
    let sub = await api(ep + 'getImageSubscription1', ai, token, JSON.stringify({}))

    if (!sub.result.imageSubscriptionInfo) setMembership(null)
    else if (Object.keys(sub.result.imageSubscriptionInfo).length === 0 && sub.result.imageSubscriptionInfo.constructor === Object) setMembership(null)
    else setMembership(sub.result.imageSubscriptionInfo)
*/
    return d
  }

  const loadAll = async () => {
    setLoading(true)
    const a = await loadProfile()
    //console.log(a.user.objectId)
    if (!a.user) return null
    const b = await loadMembership(a.user.objectId)

    var member = false
    var membership = {}
    //console.log(rdata.subscriber.subscriptions)
    if (Object.keys(b.subscriber.subscriptions).length === 0) {
      setMember(member)
      setMembership(membership)
      setLoading(false)
      return {
        member,
        membership
      }
    }

    member = true
    membership = Object.values(b.subscriber.subscriptions)[0]
    const c = await loadMembershipProduct(Object.keys(b.subscriber.subscriptions)[0])
    //console.log(c)
    membership = {
      ...membership,
      ...c
    }

    setMember(member)
    setMembership(membership)
    setLoading(false)

    return {
      member,
      membership
    }
  }

  const saveUsername = async username => {
    const ep = dev === true ? DEV_ENDPOINT : PROD_ENDPOINT
    const ai = dev === true ? DEV_APPID : PROD_APPID

    let data = await api(ep + 'updateUserUniqueDisplayName1', ai, token, JSON.stringify({ uniqueDisplayName: username }))
    if (profile)
      setProfile({
        ...profile,
        user: {
          ...profile.user,
          uniqueDisplayName: username
        }
      })
    return data
  }

  const saveProfile = async body => {
    const ep = dev === true ? DEV_ENDPOINT : PROD_ENDPOINT
    const ai = dev === true ? DEV_APPID : PROD_APPID

    let data = await api(ep + 'updateUser1', ai, token, JSON.stringify(body))

    if (!data) return null

    var pic = ''
    const result = data.result

    if (result.user && result.user.thumbProfileImageFile) {
      pic = result.user.thumbProfileImageFile.url
    } else if (result.user && result.user.cfTbImageUrl) {
      pic = result.user.cfTbImageUrl
    } else {
      pic = 'https://didr9pubr8qfh.cloudfront.net/mobile_other/profile_avatars/Profile5.png'
    }

    if (profile)
      setProfile({
        ...profile,
        user: {
          ...result.user
        },
        pic
      })

    return data
  }

  const updateEmail = async email => {
    const ep = dev === true ? DEV_ENDPOINT : PROD_ENDPOINT
    const ai = dev === true ? DEV_APPID : PROD_APPID

    const body = {
      email
    }
    let data = await api(ep + 'updateUser1', ai, token, JSON.stringify(body))
    return data
  }

  const resetPassword = async email => {
    const ep = dev === true ? DEV_ENDPOINT : PROD_ENDPOINT
    const ai = dev === true ? DEV_APPID : PROD_APPID

    const body = {
      email
    }
    let data = await api(ep + 'requestPasswordReset1', ai, token, JSON.stringify(body))
    return data
  }

  return <ProfileContext.Provider value={{ loading, profile, member, membership, loadAll, loadMembership, loadMembershipProduct, loadProfile, saveUsername, saveProfile, updateEmail, resetPassword }} {...props} />
}

const useProfile = () => useContext(ProfileContext)
export { ProfileProvider, useProfile }
