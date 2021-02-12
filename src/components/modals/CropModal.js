import React, { useState, forwardRef, useImperativeHandle, useRef, useCallback } from 'react'
import ReactCrop from 'react-image-crop'
import styled from 'styled-components'
import { DMPrimaryButton, DMPrimaryAltButton, DMSimpleModal } from '@decormatters/dm-theme'
import 'react-image-crop/dist/ReactCrop.css'

const ActionContainer = styled.div`
  margin-top: 40px;
  display: flex;
  flex-wrap: nowrap;
`

const CropModal = forwardRef(({scheme, onOk, onClose}, ref) => {
  const pixelRatio = 4
  const [image, setImage] = useState()
  const [crop, setCrop] = useState(null)
  const [completedCrop, setCompletedCrop] = useState(null)

  const imgRef = useRef(null)
  const tRef = useRef()

  const cropImage = () => {
    if (!completedCrop || !imgRef.current) return

    const image = imgRef.current
    const canvas = document.createElement('canvas')
    const crop = completedCrop
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')

    canvas.width = crop.width * pixelRatio
    canvas.height = crop.height * pixelRatio

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingEnabled = false

    ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)

    return dataUrl
  }

  const handleClose = () => {
    tRef.current.hide()
    if (onClose) onClose()
  }

  const handleOk = () => {
    tRef.current.hide()
    if (onOk) onOk(cropImage())
  }

  const onLoad = useCallback(img => {
    imgRef.current = img

    const aspect = 1 / 1

    const short = img.width > img.height ? img.height : img.width
    const width = short
    const height = short
    const x = Math.abs(img.width / 2 - short / 2)
    const y = Math.abs(img.height / 2 - short / 2)
    const c = {
      width,
      height,
      x,
      y,
      aspect
    }

    setCrop(c)
    setCompletedCrop(c)

    return false
  }, [])

  useImperativeHandle(ref, () => ({
    show: data => {
      setImage(null)
      if (data) setImage(data)
      tRef.current.show()
    },
    hide: () => {
      tRef.current.hide()
    }
  }))

  return (
    <DMSimpleModal ref={tRef} overlayClose={true} title="Crop Profile Image" scheme={scheme}>
      <ReactCrop
        src={image}
        onImageLoaded={onLoad}
        crop={crop}
        minWidth={150}
        minHeight={150}
        keepSelection={true}
        ruleOfThirds={true}
        onChange={c => setCrop(c)}
        onComplete={c => setCompletedCrop(c)}
      />
      <ActionContainer>
        <DMPrimaryAltButton scheme={scheme} type="button" onClick={handleClose} style={{ marginRight: '10px' }}>
          Cancel
        </DMPrimaryAltButton>
        <DMPrimaryButton scheme={scheme} type="button" onClick={handleOk} style={{ marginLeft: '10px' }}>
          Ok
        </DMPrimaryButton>
      </ActionContainer>
    </DMSimpleModal>
  )
})

export default CropModal
