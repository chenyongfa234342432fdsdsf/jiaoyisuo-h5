import { useState, memo, useEffect } from 'react'
import classNames from 'classnames'
import { ActionSheet, Input, Dialog } from '@nbit/vant'
import { debounce } from 'lodash'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { getPerpetualTradePairList, getPerpetualTradePairDetail } from '@/apis/future/common'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import { useOrderFutureStore } from '@/store/order/future'
import { YapiGetV1PerpetualTradePairDetailData } from '@/typings/yapi/PerpetualTradePairDetailV1GetApi.d'
import { YapiGetV1PerpetualTradePairListData } from '@/typings/yapi/PerpetualTradePairListV1GetApi.d'
import { formatCurrency } from '@/helper/decimal'
import { decimalUtils } from '@nbit/utils'
import { useCommonStore } from '@/store/common'
// import CreateNewAccount from '@/features/trade/future/create-new-account'
import { useContractElements } from './useContractElements'
import styles from './index.module.css'

const documentIdRegex = /^[a-zA-Z0-9/]*$/

const SafeCalcUtil = decimalUtils.SafeCalcUtil

function ContractElements() {
  const { symbolName, typeInd } = useTradeCurrentFutureCoin()

  const { theme } = useCommonStore()

  const [contractType, setContractType] = useState()

  const [showTypeInd, setShowTypeInd] = useState<string>()

  const [showSymbolName, setShowSymbolName] = useState<string>()

  const [contractCoinKeyList, setContractCoinKeyList] = useState<YapiGetV1PerpetualTradePairListData[]>([])

  const [contractCoinDetail, setContractCoinDetail] = useState<YapiGetV1PerpetualTradePairDetailData>(
    {} as YapiGetV1PerpetualTradePairDetailData
  )

  const { tradePairDefaultQuote } = useOrderFutureStore()

  const [searchKey, setSearchKey] = useState<string>('')

  const { modalExplain, getTypeIndName } = useContractElements(contractCoinDetail?.baseSymbolName)

  const [visible, setVisible] = useState<boolean>(false)

  const displayList = searchKey
    ? contractCoinKeyList?.filter(item => item?.symbolName?.includes(searchKey.toUpperCase()))
    : contractCoinKeyList?.slice()

  const selectPair = item => {
    if (item.id === contractType) {
      return
    }
    setShowTypeInd(item.typeInd)
    setContractType(item.symbolName)
    getTradePairDetail(item.symbolName)
    setVisible(false)
  }

  const setContractSelect = () => {
    setVisible(true)
  }

  const setContractModalDetail = (value: string) => {
    Dialog.alert({
      className: 'dialog-confirm-wrapper confirm-black',
      title: modalExplain[value].title,
      closeable: false,
      message: modalExplain[value].content,
      confirmButtonText: t`features_trade_common_notification_index_5101066`,
    })
  }

  const getTradePairDetail = async symbol => {
    const { isOk, data } = await getPerpetualTradePairDetail({ symbol })
    if (isOk && data) {
      setContractCoinDetail(data)
    }
  }

  const getPerpetualTradePairRequest = async params => {
    const { isOk, data } = await getPerpetualTradePairList(params)
    if (isOk && data?.list) {
      setContractCoinKeyList(data?.list)
    }
  }

  const setCancelAfterChange = () => {
    setVisible(false)
    setSearchKey('')
  }

  useEffect(() => {
    setShowSymbolName(contractType)
  }, [contractType])

  useEffect(() => {
    getTradePairDetail(symbolName)
    setShowSymbolName(symbolName)
  }, [symbolName])

  useEffect(() => {
    getPerpetualTradePairRequest({ buyCoin: tradePairDefaultQuote, typeInd, symbolName: searchKey })
    setShowTypeInd(typeInd)
  }, [searchKey, typeInd, tradePairDefaultQuote])

  const setSearchKeyChange = e => {
    if (!documentIdRegex.test(e)) return
    setSearchKey(e)
  }

  const getThemeColor = () => {
    return theme === 'light' ? 'white' : 'black'
  }

  return (
    <div className={styles.scope}>
      <ActionSheet
        visible={visible}
        onClosed={setCancelAfterChange}
        className={styles['select-trade-pair-modal-wrapper']}
        onClose={setCancelAfterChange}
        onClickOverlay={setCancelAfterChange}
        onCancel={setCancelAfterChange}
        cancelText={<span className="pt-4">{t`user.field.reuse_09`} </span>}
      >
        <div>
          <div className="header">
            <div className="title">
              {t`features_trade_contract_contract_elements_index_5101477`}
              {/* {typeInd && getTypeIndName[typeInd]} */}
              {t`assets.layout.tabs.contract`}
            </div>
            <div className="search">
              <Input
                prefix={<Icon name="search" hasTheme />}
                placeholder={t`features_trade_contract_contract_trade_pair_index_5101506`}
                value={searchKey}
                onChange={setSearchKeyChange}
              />
            </div>
          </div>
          <div className="options-wrapper">
            {displayList?.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  selectPair(item)
                }}
                className={classNames('option', {
                  active: item.symbolName === (contractType || showSymbolName),
                })}
              >
                {item.symbolName} {item.typeInd && getTypeIndName[item.typeInd]}
              </div>
            ))}
          </div>
        </div>
      </ActionSheet>
      <div className="contract-select" onClick={setContractSelect}>
        <div>{t`assets.layout.tabs.contract`}</div>
        <div>
          <span>{showSymbolName}</span>
          <span>{getTypeIndName?.[showTypeInd as string]}</span>
          <Icon
            className="contract-drop-icon"
            name={visible ? `regsiter_icon_away_${getThemeColor()}` : `regsiter_icon_drop_${getThemeColor()}`}
          />
        </div>
      </div>
      <div className="contract-rate">
        <div className="contract-rate-item">
          <span>Maker {t`features_trade_contract_contract_elements_index_5101478`}</span>
          <span>{contractCoinDetail?.markerFeeRate && contractCoinDetail.markerFeeRate * 100}%</span>
        </div>
        <div className="contract-rate-item">
          <span>Taker {t`features_trade_contract_contract_elements_index_5101478`}</span>
          <span>{contractCoinDetail?.takerFeeRate && (contractCoinDetail?.takerFeeRate as number) * 100}%</span>
        </div>
      </div>
      <div className="contract-bond-title">
        {showSymbolName} {typeInd && getTypeIndName[typeInd]}{' '}
        {t`features_trade_contract_contract_elements_index_5101479`}
      </div>
      {contractCoinDetail?.tradePairLeverList?.map((item, index) => {
        return (
          <div className="contract-hierarchy" key={(item.tradeId || Math.random()) + index}>
            <div className="contract-hierarchy-title">
              {t`features_trade_contract_contract_elements_index_5101480`} {index + 1}
            </div>
            <div className="contract-hierarchy-item">
              <span onClick={() => setContractModalDetail('nominalvalue')}>{modalExplain.nominalvalue.title}</span>
              <span>{formatCurrency(item.maxLimitAmount)}</span>
            </div>
            <div className="contract-hierarchy-item">
              <span onClick={() => setContractModalDetail('maximumleverage')}>
                {modalExplain.maximumleverage.title}
              </span>
              <span>{item?.maxLever}x</span>
            </div>
            <div className="contract-hierarchy-item">
              <span onClick={() => setContractModalDetail('maintenancemarginrate')}>
                {modalExplain.maintenancemarginrate.title}
              </span>
              <span>{item?.marginRate && Number(SafeCalcUtil.mul(item.marginRate, 100))}%</span>
            </div>
          </div>
        )
      })}
      {/* <CreateNewAccount /> */}
    </div>
  )
}

export default memo(ContractElements)
