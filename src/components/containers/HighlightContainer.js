import React from 'react'
import styled from 'styled-components'

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

const HighlightContainer = ({ scheme, title, children }) => {
  return (
    <EntryContainer>
      <EntryTitle scheme={scheme}>{title}</EntryTitle>
      <div>{children}</div>
    </EntryContainer>
  )
}

export default HighlightContainer
