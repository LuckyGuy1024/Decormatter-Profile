import React, { useEffect, useState } from 'react'
import { useProfile } from '../context/profile'
import SettingsLayout from './SettingsLayout'
import { InputGroup, CustomGroup } from '../components/FormElements'
import { DMPrimaryAltButton } from '@decormatters/dm-theme'

const SettingsAccount = ({ user, scheme }) => {
  const { profile, updateEmail, resetPassword } = useProfile()

  const [submitting, setSubmitting] = useState(false)
  const [edited, setEdited] = useState(false)

  const [email, setEmail] = useState('')
  const [oemail, setOEmail] = useState('')
  const [nemail, setNEmail] = useState(false)

  const [errorEmail, setErrorEmail] = useState(null)
  const [completeEmail, setCompleteEmail] = useState(null)

  const [errorPassword, setErrorPassword] = useState(null)
  const [completePassword, setCompletePassword] = useState(null)

  useEffect(() => {
    if (!user) return

    if (user.email) {
      setEmail(user.email)
      setOEmail(user.email)
    } else if (user.username) {
      setEmail(user.username)
      setOEmail(user.username)
    }
  }, [user])

  useEffect(() => {
    var mod = false
    if (email !== oemail) mod = true
    setEdited(mod)
  }, [email, oemail])

  const validateEmail = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const handleEmailSubmit = data => {
    if (submitting) return

    setSubmitting(true)
    setErrorEmail(null)

    const val = validateEmail()

    if(!val) {
      setErrorEmail("Incorrect email format")
      setSubmitting(false)
      return
    }

    updateEmail(email).then(r => {
      setSubmitting(false)
      setNEmail(true)
      if (r.error) setErrorEmail(r.error)
      else setCompleteEmail('An email has been sent to confirm change.')
    })
  }

  const handlePasswordSubmit = data => {
    if (submitting) return

    setSubmitting(true)
    setErrorEmail(null)

    resetPassword(oemail).then(r => {
      setSubmitting(false)
      if (r.error) setErrorPassword(r.error + ". Something wrong has happened in requesting to reset your password. Contact support at info@decormatters.com to resolve issue.")
      else setCompletePassword('An email to reset your password has been sent to ' + oemail + '.')
    })
  }

  return (
    <SettingsLayout title="Account and Security" description="Update contact, login and security settings.">
      <InputGroup scheme={scheme} title="Email" value={email} error={errorEmail} complete={completeEmail} onChange={e => setEmail(e.target.value)} />
      <div>
        {!completeEmail && (
          <DMPrimaryAltButton scheme={scheme} disabled={!edited} onClick={handleEmailSubmit}>
            Update Email
          </DMPrimaryAltButton>
        )}
      </div>
      {!nemail && (<CustomGroup scheme={scheme} title="Password" subtitle="(Email will be sent to reset password)" error={errorPassword} complete={completePassword}>
        {!errorPassword && !completePassword && (<DMPrimaryAltButton scheme={scheme} onClick={handlePasswordSubmit}>Reset Password</DMPrimaryAltButton>)}
      </CustomGroup>)}
    </SettingsLayout>
  )
}

export default SettingsAccount
