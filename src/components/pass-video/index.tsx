import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { useEventListener } from 'ahooks'
import { useState, useEffect, useRef } from 'react'
import { useLayoutStore } from '@/store/layout'
import { Dialog, Button, CountDown } from '@nbit/vant'
import { oss_svg_image_domain_address } from '@/constants/oss'
import styles from './index.module.css'

type PassVideoProps = {
  time?: number // 倒计时时间
  visible: boolean
  isConfirm?: boolean // 是否显示确认按钮
  isCountDown?: boolean // 是否一开始显示倒计时
  isSpeciality?: boolean // 是否是专业版
  onClose?: () => void
  onConfirm?: () => void
}

const futureVideo = 'contract_subaccount_video'
const proVideo = 'contract_subaccount_video_pro'

export default function PassVideo(props: PassVideoProps) {
  const footerStore = useLayoutStore()
  const videoSrc = footerStore?.columnsDataByCd[futureVideo]?.h5Url
  const proSrc = footerStore?.columnsDataByCd[proVideo]?.h5Url
  const {
    isSpeciality = false,
    isConfirm = true,
    isCountDown,
    time = 10000,
    visible = false,
    onClose,
    onConfirm,
  } = props
  const [show, setShow] = useState<boolean>(false)
  const [playState, setPlayState] = useState<boolean>(false)

  const customVideo = useRef<HTMLVideoElement>(null)

  useEventListener(
    'loadedmetadata',
    () => {
      customVideo.current?.play()
    },
    { target: customVideo }
  )

  useEventListener(
    'play',
    () => {
      setPlayState(false)
    },
    { target: customVideo }
  )

  useEventListener(
    'pause',
    () => {
      setPlayState(true)
    },
    { target: customVideo }
  )

  const onVideoButton = () => {
    setPlayState(false)
    customVideo.current?.play()
  }

  const onFinish = () => {
    setShow(false)
  }

  useEffect(() => {
    setShow(isCountDown || false)
  }, [])

  return (
    <Dialog
      visible={visible}
      showConfirmButton={false}
      className={styles['pass-video-dialog']}
      overlayClass={styles['pass-video-dialog-overlay']}
    >
      <div className="pass-video-content">
        <video
          muted
          autoPlay
          controls
          className="w-full h-full rounded"
          ref={customVideo}
          poster={
            isSpeciality
              ? `${oss_svg_image_domain_address}preferences/video_pro_cover.jpeg`
              : `${oss_svg_image_domain_address}preferences/video_basic_cover.jpeg`
          }
        >
          <source src={isSpeciality ? proSrc : videoSrc} type="video/mp4" />
        </video>
        {playState && (
          <div className="custom-video-button" onClick={onVideoButton}>
            <Icon name="play_icon" />
          </div>
        )}
      </div>
      <div className="pass-video-footer">
        <div className="footer-button">
          <Button
            onClick={() => {
              onClose && onClose()
              customVideo.current?.pause()
            }}
            className="button-close"
          >{t`common.modal.close`}</Button>
        </div>
        {isConfirm && (
          <div className="footer-button">
            {show ? (
              <div className="button-countdown">
                <CountDown time={time} onFinish={onFinish}>
                  {timeData => <span>{`${timeData.seconds} s`}</span>}
                </CountDown>
              </div>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  onConfirm && onConfirm()
                  customVideo.current?.pause()
                }}
              >{t`features_assets_futures_futures_details_position_operation_guide_index_5101460`}</Button>
            )}
          </div>
        )}
      </div>
    </Dialog>
  )
}
