import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useProfile } from '../context/profile'
import SettingsLayout from './SettingsLayout'
import { DMPrimaryButton } from '@decormatters/dm-theme'

const PlanInfoContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;

  font-weight: bold;
  font-size: 18px;
  margin-bottom: 30px;
`

const PlanStatusContainer = styled.div`
  
`

const PlanMessageContainer = styled.div`
font-weight: 500;
  font-size: 16px;
  color: #777777;
  margin-bottom: 10px;
`

const ActionContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  margin-top: 40px;
`

const SettingsPlan = ({ scheme,  onChangeMembership }) => {
  const { profile, loadMembership, loadMembershipProduct } = useProfile()
  //const [current, setCurrent] = useState(plans['monthly'])

  const [subscription, setSubscription] = useState(null)
  const [stripeProduct, setStripeProduct] = useState(null)
  const [isStarter, setIsStarter] = useState(false)
  const [since, setSince] = useState(null)
  const [renewal, setRenewal] = useState(null)

  useEffect(() => {
    setSubscription(null)
    setStripeProduct(null)
    setIsStarter(false)
  }, [])

  useEffect(() => {
    if (!subscription) return

    const ori = Date.parse(subscription.original_purchase_date)
    var od = new Date(ori)
    const oye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(od)
    const omo = new Intl.DateTimeFormat('en', { month: 'short' }).format(od)
    const oda = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(od)

    setSince(`${omo} ${oda}, ${oye}`)

    const exp = Date.parse(subscription.expires_date)
    var ed = new Date(exp)
    const eye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(ed)
    const emo = new Intl.DateTimeFormat('en', { month: 'short' }).format(ed)
    const eda = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(ed)

    setRenewal(`${emo} ${eda}, ${eye}`)
  }, [subscription])

  useEffect(() => {
    if (!profile) return
    //Check Revenue Cat for subscription
    loadMembership(profile.user.objectId).then(r => {
      if (Object.keys(r.subscriber.subscriptions).length === 0 && r.subscriber.subscriptions.constructor === Object) {
        setStripeProduct(null)
        setIsStarter(true)
        return
      }
      setSubscription(Object.values(r.subscriber.subscriptions)[0])
      //Get Plan data from Stripe
      loadMembershipProduct(Object.keys(r.subscriber.subscriptions)[0]).then(p => {
        setStripeProduct(p)
      })
    })
  }, [profile])

  const formatPrice = raw => {
    return (raw * 0.01).toFixed(2)
  }

  return (
    <SettingsLayout scheme={scheme} title="Current Plan">
      {isStarter && (
        <PlanInfoContainer>
          <div>Starter</div>
          <div>Free</div>
        </PlanInfoContainer>
      )}
      {stripeProduct && (
        <PlanInfoContainer>
          <div>{stripeProduct.name}</div>
          <div>
            ${formatPrice(stripeProduct.price.unit_amount)}/{stripeProduct.price.recurring.interval}
          </div>
        </PlanInfoContainer>
      )}
      {isStarter && (
        <PlanStatusContainer>
          You are under free plan. Upgrade to get <b>unlimited useage of catalog items and exclusive design tool.</b>
        </PlanStatusContainer>
      )}
      {stripeProduct && subscription && (
        <PlanStatusContainer>
          {renewal && <PlanMessageContainer>Subscription renewal date</PlanMessageContainer>}
          {renewal && (
            <div>
              <b>{renewal}</b>
            </div>
          )}
        </PlanStatusContainer>
      )}
      <ActionContainer>
        {isStarter && <DMPrimaryButton onClick={onChangeMembership}>Upgrade</DMPrimaryButton>}
        {stripeProduct && <DMPrimaryButton onClick={onChangeMembership}>Change Membership Plan</DMPrimaryButton>}
      </ActionContainer>
    </SettingsLayout>
  )
}

export default SettingsPlan
