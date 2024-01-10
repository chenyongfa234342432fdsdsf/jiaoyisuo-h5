import { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'

import { oss_svg_image_domain_address } from '@/constants/oss'
import NavBar from '@/components/navbar'
import Icon from '@/components/icon'
import { useLayoutStore } from '@/store/layout'
import { getV1AgentInvitationCodeQuerySysApiRequest } from '@/apis/agent'
import { YapiGetV1AgentInvitationCodeQueryMaxData } from '@/typings/yapi/AgentInvitationCodeQueryMaxV1GetApi'
import { link } from '@/helper/link'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import { useCommonStore } from '@/store/common'
import { ThemeEnum } from '@/constants/base'
import styles from './index.module.css'
import InviteOperation from './invite-operation'
import InviteDescribe from './invite-describe'

function Invite() {
  const title = t`user.personal_center_05`
  const [titleState, setTitleState] = useState('')
  const myRef = useRef<HTMLDivElement>(null)
  const [applyStatus, setApplyStatus] = useState<boolean>(false)
  const [allInviteCode, setAllInviteCode] = useState<YapiGetV1AgentInvitationCodeQueryMaxData | null | any>(null)
  const [isAgent, setIsAgent] = useState<boolean>(false)
  const [fullScreenLoading, setFullScreenLoading] = useState<boolean>(false)
  const [maxSysRate, setMaxSysRate] = useState({
    spot: '',
    contract: '',
    borrowCoin: '',
  })
  const [maxRate, setMaxRate] = useState({
    spot: '',
    contract: '',
    borrowCoin: '',
  })
  const next = () => {
    if (myRef.current) {
      document.documentElement.scrollTo(0, myRef.current.offsetTop || 0)
    }
  }
  useEffect(() => {
    getV1AgentInvitationCodeQuerySysApiRequest({}).then(res => {
      if (res.isOk) {
        setMaxSysRate(res.data as YapiGetV1AgentInvitationCodeQueryMaxData as any)
      }
    })
  }, [])
  const { customerJumpUrl } = useLayoutStore().layoutProps || {}
  const commonState = useCommonStore()

  useEffect(() => {
    setTitleState(title)
  }, [customerJumpUrl])
  return (
    <div>
      <NavBar
        title={titleState}
        right={
          <Icon
            hasTheme
            onClick={() => {
              location.href = customerJumpUrl as string
            }}
            className="common-icon"
            name="nav_service"
          />
        }
        onClickRight={() => {
          location.href = customerJumpUrl as string
        }}
        onClickLeft={() => {
          link('/home-page')
        }}
        appRightConfig={{
          iconUrl: `${oss_svg_image_domain_address}agent/customer_service_${
            commonState?.theme === ThemeEnum.light ? 'white' : 'black'
          }.png`,
          onClickRight: () => {
            console.log('测试 customerJumpUrl value:', customerJumpUrl)
            location.href = customerJumpUrl as string
          },
        }}
      />
      <div
        className={styles.scoped}
        style={{
          backgroundImage: `url(${oss_svg_image_domain_address}agent/rebate_bj.png)`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
        }}
      >
        <InviteOperation
          setCurMaxRate={setMaxRate}
          setAllData={setAllInviteCode}
          maxSysRate={maxSysRate}
          next={next}
          setApplyStatus={setApplyStatus}
          setIsAgent={setIsAgent}
          setFullScreenLoading={setFullScreenLoading}
        />
        <InviteDescribe
          allInviteCode={allInviteCode}
          maxRate={maxRate}
          maxSysRate={maxSysRate}
          myRef={myRef}
          applyStatus={applyStatus}
          isAgent={isAgent}
        />
      </div>
      <FullScreenLoading isShow={fullScreenLoading} className="h-screen" />
    </div>
  )
}

export default Invite
