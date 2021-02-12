import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useProfile } from '../context/profile'
import SettingsLayout from './SettingsLayout'
import { InputGroup, TextAreaGroup } from '../components/FormElements'
import ProfileCircle from '../components/ProfileCircle'
import CropModal from '../components/modals/CropModal'
import { DMPrimaryAltButton, DMPrimaryAltDivButton } from '@decormatters/dm-theme'

const ProfilePicContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  align-items: center;

  margin-top: 12px;
  margin-bottom: 12px;
`

const ProfilePicButtonContainer = styled.div`
  margin-left: 40px;
`

const fileInput = {
  height: '0px',
  width: '0px',
  overflow: 'hidden',
  opacity: '0',
}

const SettingsProfile = ({ scheme }) => {
  const rCrop = useRef()
  const rFile = useRef()

  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [edited, setEdited] = useState(false)

  const { profile, saveProfile, saveUsername } = useProfile()
  const [username, setUsername] = useState('')
  const [ousername, setOUsername] = useState('')

  const [about, setAbout] = useState('')
  const [oabout, setOAbout] = useState('')

  const [pic, setPic] = useState('')
  const [picSubmitting, setPicSubmitting] = useState(false)

  const [error, setError] = useState(null)

  useEffect(() => {
    if (!profile) return
    setSubmitting(false)
    setEdited(false)
    setSaved(false)
    setPicSubmitting(false)
    if (profile.user && profile.user.uniqueDisplayName) {
      setUsername(profile.user.uniqueDisplayName)
      setOUsername(profile.user.uniqueDisplayName)
    } else {
      setUsername('')
      setOUsername('')
    }
    if (profile.user && profile.user.aboutMe) {
      setAbout(profile.user.aboutMe)
      setOAbout(profile.user.aboutMe)
    } else {
      setAbout('')
      setOAbout('')
    }
    if (profile.pic) setPic(profile.pic)
  }, [profile])

  useEffect(() => {
    setSaved(false)
    var mod = false

    if (username !== ousername) mod = true
    if (about !== oabout) mod = true

    setEdited(mod)
  }, [username, ousername, about, oabout])

  const handleSave = e => {
    if (submitting === true) return
    setSubmitting(true)

    if (username !== ousername && about !== oabout) {
      saveUsername(username).then(r => {
        setOUsername(username)
        saveProfile({
          aboutMe: about
        }).then(p => {
          setOAbout(about)
          setSubmitting(false)
          setSaved(true)
        })
      })
    }

    if (username !== ousername) {
      saveUsername(username).then(r => {
        setOUsername(username)
        setSubmitting(false)
        setSaved(true)
      })
    }

    if (about !== oabout) {
      saveProfile({
        aboutMe: about
      }).then(p => {
        setOAbout(about)
        setSubmitting(false)
        setSaved(true)
      })
    }
  }

  const handleUpload = e => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = e => {
        rCrop.current.show(e.target.result)
        rFile.current.value = null
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = img => {
    setPicSubmitting(true)
    const thumbProfileImageData = {
      __type: 'Bytes',
      base64: img,
    }

    const body = {
      thumbProfileImageData,
    }

    saveProfile(body).then(p => {
      setPic(img)
      setPicSubmitting(false)
    })
  }

  return (
    <SettingsLayout
      scheme={scheme}
      title="Profile"
      description="Anyone on DecorMatters can see this info when viewing content you create."
      onSave={handleSave}
      submitting={submitting}
      saved={saved}
      edited={edited}
    >
      <CropModal ref={rCrop} scheme={scheme} onOk={handleCropComplete} />
      <ProfilePicContainer>
        <ProfileCircle pic={pic} scheme={scheme} />
        <ProfilePicButtonContainer>
          <div style={fileInput}>
            <input
              ref={rFile}
              type="file"
              id="img"
              name="img"
              accept="image/png,image/jpeg"
              onChange={e => {
                handleUpload(e)
              }}
            />
          </div>
          {picSubmitting === false ? (
            <label htmlFor="img">
              <DMPrimaryAltDivButton>Change</DMPrimaryAltDivButton>
            </label>
          ) : (
            <DMPrimaryAltButton disabled={true}>Change</DMPrimaryAltButton>
          )}
        </ProfilePicButtonContainer>
      </ProfilePicContainer>

      <InputGroup scheme={scheme} title="Username" subtitle="(only letters, numbers, and underscores)" value={username} error={error} onChange={e => setUsername(e.target.value)} />
      <TextAreaGroup scheme={scheme} title="About me" value={about} onChange={e => setAbout(e.target.value)} />
    </SettingsLayout>
  )
}

export default SettingsProfile
//<DMPrimaryAltButton>Change</DMPrimaryAltButton>