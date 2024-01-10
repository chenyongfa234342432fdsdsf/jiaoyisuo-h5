import { getCodeDetailList } from '@/apis/common'
import { useMount } from 'ahooks'
import { useState } from 'react'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'

enum GroupAccountTypeEnum {
  // 临时
  TEMPORARY = 'temporary',
  // 长期
  IMMOBILIZATION = 'immobilization',
}

type AcountBgAndColor = {
  [GroupAccountTypeEnum.TEMPORARY]: Record<'color' | 'background', string>
  [GroupAccountTypeEnum.IMMOBILIZATION]: Record<'color' | 'background', string>
}

const useAcountBgAndColor = () => {
  const [accountShowTextList, setAccountShowText] = useState<YapiGetV1OpenapiComCodeGetCodeDetailListData[]>([])

  const getCodeDetailListChange = async () => {
    const { isOk, data } = await getCodeDetailList({ codeVal: 'GroupAccountTypeEnum' })
    if (isOk && data) {
      setAccountShowText(data)
    }
  }
  const acountBgAndColor = {
    [GroupAccountTypeEnum.TEMPORARY]: {
      color: 'rgba(242, 100, 17, 1)',
      background: 'rgba(242, 100, 17, 0.1)',
    },
    [GroupAccountTypeEnum.IMMOBILIZATION]: {
      color: 'rgba(63, 124, 242, 1)',
      background: 'rgba(63, 124, 242, 0.1)',
    },
  }

  useMount(() => {
    getCodeDetailListChange()
  })

  return { acountBgAndColor, accountShowTextList }
}

export { useAcountBgAndColor, GroupAccountTypeEnum, AcountBgAndColor }
