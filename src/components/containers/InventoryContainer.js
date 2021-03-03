import React from 'react'
import styled from 'styled-components'
import { DMPrimaryAltButton } from '@decormatters/dm-theme'


const EntryContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  align-content: stretch;
  padding: 12px 0;
  margin: 0;
  font-size: 14px;
  user-select: none;

  @media (min-width: 1200px) {
    font-size: 18px;
  }
`

const EntryTitle = styled.div`
  font-weight: bold;
  margin-bottom: 11px;
  color: ${props => props.scheme === 'dark' ? '#FFFFFF' : '#000000'};
`

const EntryBodyContainer = styled.div`
  border-radius: 10px;
  background-color: ${props => props.scheme === 'dark' ? '#2D2D2D' : '#F5F5F5'};

  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
`

const InfoContainer = styled.div`
  flex: 1 1 auto;
  font-weight: bold;
  font-size: 14px;

  overflow: hidden;
  margin-right: 5px;

  color: ${props => props.scheme === 'dark' ? '#FFFFFF' : '#000000'};

  @media (min-width: 1200px) {
    font-size: 18px;
  }
`
const MaterialIcon = styled.svg`
  padding: 10px;
  height: 26px;
  width: 26px;

  @media (min-width: 1200px) {
    padding: 13px;
    height: 40px;
    width: 40px;
  }
`

const MaterialImg = styled.img`
  width: 26px;
  padding: 10px;
  @media (min-width: 1200px) {
    padding: 13px;
    height: 40px;
    width: 40px;
  }
`

const ActionButton = styled(DMPrimaryAltButton)`
  margin-right: 10px;

  @media (min-width: 1200px) {
    margin-right: 13px;
  }
`

const InventoryContainer = ({ scheme, icon, img, title, children, actionTitle, onClick }) => {

  const handleClick = e => {
    if(onClick) onClick()
  }

  return (
    <EntryContainer>
      <EntryTitle scheme={scheme}>{title}</EntryTitle>
      <EntryBodyContainer scheme={scheme}>
        {img && <MaterialImg src={img} />}
        {icon && <MaterialIcon as={icon} />}
        <InfoContainer scheme={scheme}>{children}</InfoContainer>
        {actionTitle && <ActionButton size='sm' onClick={handleClick}>{actionTitle}</ActionButton>}
      </EntryBodyContainer>
    </EntryContainer>
  )
}

export default InventoryContainer
