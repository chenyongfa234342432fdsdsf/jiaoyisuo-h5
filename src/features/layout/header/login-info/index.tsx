import { UserTotalAssets } from '@/features/assets/common/user-total-assets'
import { useUserStore } from '@/store/user'
import { t } from '@lingui/macro'
import DynamicLottie from '@/components/dynamic-lottie'
import { navigate } from 'vite-plugin-ssr/client/router'
import styles from './index.module.css'

const loginAvatar = 'image_individual_head'

function LoginInfo() {
  // const { isLogin } = useUserStore()

  return (
    <div className={styles.scoped}>
      <div className="avatar" onClick={() => navigate('/personal-center')}>
        <DynamicLottie whetherManyBusiness animationData={loginAvatar} width={22} height={22} />
      </div>
      {/* {!isLogin ? (
        <span onClick={() => navigate('/login')}>
          {t`user.field.reuse_07`}/{t`user.validate_form_11`}
        </span>
      ) : (
        <span onClick={() => navigate('/assets')}>
          <UserTotalAssets />
        </span>
      )} */}
    </div>
  )
}

export default LoginInfo
