import React from 'react'
import styled from 'styled-components'

const FollowContainer = styled.div`

  border-radius: 10px;

  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  align-self: stretch;

  background: ${props => (props.scheme === 'dark' ? '#2D2D2D' : '#F5F5F5')};

  padding-top: 9px;
  padding-bottom: 9px;
`

const EntryContainer = styled.div`
  flex: 1 1 auto;
`

const Count = styled.p`
  padding: 0;
  margin: 0;
  padding-top: 4px;
  padding-bottom: 4px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  user-select: none;
  color: ${props => (props.scheme === 'dark' ? 'white' : 'black')};
`

const Title = styled.p`
  padding: 0;
  margin: 0;
  text-align: center;
  font-size: 14px;
  user-select: none;
  padding-bottom: 4px;
  color: ${props => (props.scheme === 'dark' ? 'white' : 'black')};
`

const Divider = styled.div`
  background-color: yellow;
  height: 100%;
  width: 1px;
  background: #dadada;
`

const Spacer = styled.div`
  height: 31px;
`
const Follow = ({ scheme, following, followers }) => {
  return (
    <FollowContainer scheme={scheme}>
      <EntryContainer>
        {following === null ? <Spacer /> : <Count scheme={scheme}>{following}</Count>}
        <Title scheme={scheme}>following</Title>
      </EntryContainer>
      <Divider />
      <EntryContainer>
        {followers === null ? <Spacer /> : <Count scheme={scheme}>{followers}</Count>}
        <Title scheme={scheme}>followers</Title>
      </EntryContainer>
    </FollowContainer>
  )
}
export default Follow
