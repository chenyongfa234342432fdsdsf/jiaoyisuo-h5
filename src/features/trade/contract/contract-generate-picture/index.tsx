import { RefObject, useRef, useState } from 'react'
import { Button, Overlay, Toast } from '@nbit/vant'
import { t } from '@lingui/macro'
import { QRCodeCanvas } from 'qrcode.react'
import { useUpdateEffect } from 'ahooks'
import styles from './index.module.css'

type Props = {
  container: RefObject<HTMLDivElement> | null
}

export default function ContractGeneratePicture(props: Props) {
  const { container } = props

  const [visible, setVisible] = useState<boolean>(false)

  const [imageSrc, setImageSrc] = useState<string>('')

  const finalGenerateImageRef = useRef<HTMLDivElement>(null)

  const setFinalGenerateImage = async () => {
    // try {
    //   const element = finalGenerateImageRef?.current as HTMLDivElement
    //   const finalCanvas = await html2canvas(element, { useCORS: true, scrollY: 0, scrollX: 0 })
    //   const a = document.createElement('a')
    //   const event = new MouseEvent('click')
    //   a.download = '记录详情'
    //   a.href = finalCanvas.toDataURL('image/png')
    //   a.dispatchEvent(event)
    // } catch (error) {
    //   Toast.info(error as string)
    // }
  }

  useUpdateEffect(() => {
    if (visible) {
      setFinalGenerateImage()
    }
  }, [imageSrc])

  const handleGenerateImage = async () => {
    // Toast.loading({
    //   duration: 0,
    //   message: '加载中...',
    //   forbidClick: true,
    // })
    // try {
    //   setTimeout(async () => {
    //     setVisible(true)
    //     const el = container?.current as HTMLDivElement
    //     const res = await html2canvas(el, { useCORS: true, scrollY: 0, scrollX: 0 })
    //     setImageSrc(res.toDataURL('image/png'))
    //     Toast.clear()
    //   }, 100)
    // } catch (error) {
    //   Toast.info(error as string)
    // }
  }

  return (
    <div className={styles.scoped}>
      <div className="generate">
        <Button type="primary" onClick={handleGenerateImage}>
          {t`user.account_security.network_check_10`}
        </Button>
      </div>

      <Overlay visible={visible}>
        <div className="save-image" ref={finalGenerateImageRef}>
          <div className="image-wrap">
            <img crossOrigin="anonymous" src={imageSrc} alt="" />
          </div>
          <div className="save-image-content">232123123</div>
          <QRCodeCanvas value="www.baidu.com" />
        </div>
      </Overlay>
    </div>
  )
}
