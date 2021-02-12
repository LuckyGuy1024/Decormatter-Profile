import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useProfile } from '../context/profile'
import SettingsNav from './SettingsNav'
import SettingsProfile from './SettingsProfile'
import SettingsPersonal from './SettingsPersonal'
import SettingsAccount from './SettingsAccount'
import { ReactComponent as BackIcon } from '../assets/backcircle.svg'

const Wrapper = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: 201;
  background-color: ${props => (props.scheme === 'dark' ? '#2D2D2D' : '#F5F5F5')};

  overflow: hidden;

  font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', sans-serif;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: nowrap;
  align-items: stretch;
  align-self: stretch;


  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
  }
`

const NavContainer = styled.div`
  width: 100%;
  margin-left: 80px;
  @media (min-width: 768px) {
    width: 200px;
  }
`

const BodyContainer = styled.div`
  background-color: ${props => (props.scheme === 'dark' ? 'black' : 'white')};
  color: ${props => (props.scheme === 'dark' ? 'white' : 'black')};
  width: 100%;

  @media (min-width: 992px) {
    width: 770px;
  }

  @media (min-width: 1200px) {
    width: 970px;
  }
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

const nav = [
  {
    label: 'Profile',
    value: 'basic',
    path: '/settings/basic'
  },
  {
    label: 'Personalization',
    value: 'personal',
    path: '/settings/personalization'
  },
  {
    label: 'Account and Security',
    value: 'account',
    path: '/settings/account'
  }
]

const Settings = forwardRef(({ scheme, user, token, dev, onSettings }, ref) => {
  const { loadProfile, profile, membership } = useProfile()
  const [selected, setSelected] = useState(nav[0])

  useImperativeHandle(ref, () => ({
    load: () => {
      console.log('LOAD DATA!!!!!!!')
      loadProfile()
    }
  }))

  const handleNav = e => {
    setSelected(e)
  }
  return (
    <Wrapper scheme={scheme}>
      {onSettings && (<BackButtonContainer>
        <Back scheme={scheme} onClick={e => onSettings(false)} />
      </BackButtonContainer>)}
      <NavContainer offset={onSettings ? true : false}><SettingsNav data={nav} scheme={scheme} selected={selected} onClick={handleNav}/></NavContainer>
      <BodyContainer scheme={scheme}>
        {selected.value === 'basic' && <SettingsProfile scheme={scheme} data={profile}/>}
        {selected.value === 'personal' && <SettingsPersonal scheme={scheme} data={profile}/>}
        {selected.value === 'account' && <SettingsAccount scheme={scheme} data={profile} user={user}/>}
      </BodyContainer>
    </Wrapper>
  )
})

export default Settings
