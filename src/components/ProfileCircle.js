import React from 'react'
import styled from 'styled-components'

const ProfilePicContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
`

const ProfilePicInnerContainer = styled.div`
  position: relative;
`

const ProfilePic = styled.div`
  width: 148px;
  height: 148px;
  background-size: cover;
  border-radius: 50%;
  background-color: ${props => (props.scheme === 'dark' ? '#343434' : '#DADADA')};
  box-shadow: none;
  user-select: none;
`

const ProfileLevelContainer = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 0;
  right: 0;
  background-color: #ff5e6d;
  border-radius: 10px;

  width: 60px;
  height: 22px;

  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  align-content: stretch;
`

const ProfileLevel = styled.div`
  font-size: 12px;
  font-weight: bold;
  user-select: none;
  color: white;
  text-align: center;
`

const ProfileCircle = ({ scheme, pic, userLevel, showUserLevel }) => {
  return (
    <ProfilePicContainer>
      <ProfilePicInnerContainer>
        <ProfilePic scheme={scheme} style={{ backgroundImage: `url(${pic})` }}/>
        {showUserLevel && (<ProfileLevelContainer>
          {userLevel !== null && <ProfileLevel>Lv {userLevel || 0}</ProfileLevel>}
        </ProfileLevelContainer>)}
      </ProfilePicInnerContainer>
    </ProfilePicContainer>
  )
}

export default ProfileCircle
