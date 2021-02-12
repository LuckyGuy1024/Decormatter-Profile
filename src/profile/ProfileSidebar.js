import React, { useState, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import styled from 'styled-components'
import { useProfile } from '../context/profile'
import Badges from '../components/Badges'
import HighlightContainer from '../components/containers/HighlightContainer'
import InventoryContainer from '../components/containers/InventoryContainer'
import ProfileCircle from '../components/ProfileCircle'
import Following from '../components/Following'
import { DMPrimaryAltButton } from '@decormatters/dm-theme'
import { ReactComponent as CoinIcon } from '../assets/coin.svg'
import { ReactComponent as BackIcon } from '../assets/backcircle.svg'
import { formatMoney } from '../utils'
import BadgeModal from '../components/modals/BadgeModal'

const ProfileContainer = styled.div`
  position: absolute;
  height: 100vh;
  z-index: 200;
  background-color: ${props => (props.scheme === 'dark' ? '#000000' : '#FFFFFF')};

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  overflow: hidden;

  font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', sans-serif;

  @media (min-width: 992px) {
    width: 240px;
  }

  @media (min-width: 1200px) {
    width: 415px;
  }
`

const ProfileMainContainer = styled.div`
  flex: 1 1 auto;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;

  overflow-y: hidden;

  @media (min-width: 992px) {
    padding-left: 16px;
    padding-right: 16px;
  }

  @media (min-width: 1200px) {
    padding-left: 28px;
    padding-right: 28px;
  }

  /*
  flex: 1 1 auto;
  padding-top: 68px;
  padding-left: 18px;
  padding-right: 18px;
  
  margin-bottom: 20px;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;

  &:hover {
    overflow-y: auto;
  }

  @media (min-width: 1200px) {
    padding-left: 36px;
    padding-right: 36px;
  }*/
`

const ProfileCircleContainer = styled.div`
  margin-top: 78px;
`

const ProfileLogoutContainer = styled.div`
  flex: 0 0;
  background-color: orange;
  /*
  flex: 0 0;
  text-align: center;
  padding-bottom: 40px;

  button {
    font-size: 16px;
    font-weight: bold;
    color: #8b8b8b;
    padding: 0;
    border: none;
    outline: none;
    background-color: transparent;
    border-bottom: 1px solid #8b8b8b;
    padding-bottom: 4px;
    cursor: pointer;
  }
  */
`

const ProfileUsername = styled.div`
  margin-top: 28px;
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 18px;
  user-select: none;
  border-radius: 2px;
  color: ${props => (props.name === 'empty' ? 'transparent' : props.scheme === 'dark' ? '#FFFFFF' : '#000000')};
  background-color: ${props => (props.name === 'empty' ? (props.scheme === 'dark' ? '#343434' : '#DADADA') : 'transparent')};
  text-align: center;
  @media (min-width: 1200px) {
    font-size: 24px;
  }
`

const ProfileQuote = styled.div`
  font-size: 14px;
  user-select: none;
  border-radius: 2px;
  color: ${props => (props.name === 'empty' ? 'transparent' : props.scheme === 'dark' ? '#FFFFFF' : '#000000')};
  background-color: ${props => (props.name === 'empty' ? (props.scheme === 'dark' ? '#343434' : '#DADADA') : 'transparent')};
  text-align: center;

  margin-bottom: 22px;

  @media (min-width: 1200px) {
    font-size: 18px;
  }
`

const ProfileEditContainer = styled.div`
  text-align: center;
  margin-top: 25px;
  margin-bottom: 25px;
`

const BackButtonContainer = styled.div`
  position: absolute;
  top: 5px;
  left: 16px;

  @media (min-width: 1200px) {
    left: 28px;
  }
`

const Back = styled(BackIcon)`
  fill: ${props => (props.scheme === 'dark' ? '#343434' : 'white')};
  stroke: ${props => (props.scheme === 'dark' ? 'white' : '#8B8B8B')};
  cursor: pointer;
`

const ProfileSidebar = forwardRef(({ scheme, onBack, onFill, onSettings, onMembership }, ref) => {
  const { loadProfile, profile, membership } = useProfile()

  const rBadge = useRef()

  const [username, setUsername] = useState('empty')
  const [about, setAbout] = useState('empty')
  const [pic, setPic] = useState('')
  const [userLevel, setUserLevel] = useState(null)
  const [numCoins, setNumCoins] = useState(null)

  const [badgesComplete, setBadgesComplete] = useState([])
  const [badgesIncomplete, setBadgesIncomplete] = useState([])

  const [following, setFollowing] = useState(null)
  const [followers, setFollowers] = useState(null)

  useImperativeHandle(ref, () => ({
    load: () => {
      loadProfile()
    }
  }))

  useEffect(() => {
    if (profile) {
      if (profile.user && profile.user.uniqueDisplayName) setUsername(profile.user.uniqueDisplayName)
      else setUsername('')
      if (profile.user && profile.user.aboutMe) setAbout(profile.user.aboutMe)
      else setAbout('')
      if (profile.numCoins) setNumCoins(profile.numCoins)
      else setNumCoins(0)
      if (profile.pic) setPic(profile.pic)
      if (profile.userLevel) setUserLevel(Math.floor(profile.userLevel))
      if (profile.badgeRewards) setBadgesComplete(profile.badgeRewards)
      if (profile.badgesNotStarted) setBadgesIncomplete(profile.badgesNotStarted)
      if (profile.user && profile.user.numFollowers) setFollowers(profile.user.numFollowers)
      if (profile.user && profile.user.numFollowing) setFollowing(profile.user.numFollowing)
    }
  }, [profile])

  const toExplore = () => {
    //const domain = getDomain(window.location.href)
    //window.location.href = domain
  }

  const handleBadge = e => {
    rBadge.current.show(e)
  }

  const handleBack = e => {
    if (onBack) onBack()
  }

  const handleFill = e => {
    if (onFill) onFill()
  }

  const handleSettings = e => {
    if (onSettings) onSettings()
  }

  const handleMembership = e => {
    if (onMembership) onMembership()
  }

  return (
    <ProfileContainer scheme={scheme}>
      <BadgeModal ref={rBadge} scheme={scheme}/>
      <BackButtonContainer>
        <Back scheme={scheme} onClick={handleBack} />
      </BackButtonContainer>

      <ProfileMainContainer>
        <ProfileCircleContainer>
          <ProfileCircle userLevel={userLevel} pic={pic} showUserLevel scheme={scheme} />
        </ProfileCircleContainer>
        <ProfileUsername scheme={scheme} name={username}>
          {username}
        </ProfileUsername>
        <ProfileQuote scheme={scheme} name={about}>
          {about}
        </ProfileQuote>
        <Following scheme={scheme} following={following} followers={followers} />
        <ProfileEditContainer>
          <DMPrimaryAltButton scheme={scheme} onClick={e => onSettings(true)}>Edit Profile</DMPrimaryAltButton>
        </ProfileEditContainer>
        <InventoryContainer scheme={scheme} title="Membership" img={membership ? 'https://didr9pubr8qfh.cloudfront.net/designer/badge_membership_on.png' : 'https://didr9pubr8qfh.cloudfront.net/designer/badge_membership_off.png'} actionTitle={membership ? 'Settings' : 'Upgrade'} onClick={membership ? handleSettings : handleMembership}>
          {membership === null && 'Starter'}
        </InventoryContainer>
        <InventoryContainer scheme={scheme} title="Dcoins" icon={CoinIcon} actionTitle="Refill" onClick={handleFill}>
          {numCoins && formatMoney(numCoins, 0)}
        </InventoryContainer>
        <HighlightContainer title="Badges" scheme={scheme}>
          <Badges badgesComplete={badgesComplete} badgesIncomplete={badgesIncomplete} onClick={handleBadge}/>
        </HighlightContainer>
      </ProfileMainContainer>

      {/*<ProfileLogoutContainer>
          <button type="button" onClick={toExplore}>
            Back to Explore
          </button>
        </ProfileLogoutContainer>*/}
      {/*<Settings user={getUser()} token={getUserToken()} scheme="dark" dev />*/}
    </ProfileContainer>
  )
})

export default ProfileSidebar
