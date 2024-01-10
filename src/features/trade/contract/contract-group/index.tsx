import { useState, forwardRef, useImperativeHandle } from 'react'
import { Overlay } from '@nbit/vant'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { useUpdateEffect } from 'ahooks'
import styles from './index.module.css'

type Props = {
  selectContractGroup: () => void
}

function ContractGroup(props: Props, ref) {
  const { selectContractGroup } = props

  const [contractGroupVisible, setContractGroupVisible] = useState<boolean>(true)

  const [selectIndex, setSelectIndex] = useState<number>()

  const setContractGroupChange = () => {
    setContractGroupVisible(false)
  }

  const setConstractSelectIndex = (e, index) => {
    e.stopPropagation()
    setSelectIndex(index === selectIndex ? undefined : index)
  }

  const setContractChange = () => {
    selectContractGroup()
  }

  const setProfitContractGroup = index => {
    return (
      <div className="profit-contract-group" onClick={() => setContractChange()}>
        <span className="profit-total-income">
          <span>总收益</span>
        </span>
        <span className="contract-group-label">
          +6666.8888 <span>USD</span>
        </span>
        <img src={`${oss_svg_image_domain_address}green-contract-group-open.png`} alt="" />
        <span className="contract-group">A</span>
        <div className="contract-group-icon-line"></div>
        <span className="contract-group-icon" onClick={e => setConstractSelectIndex(e, index)}>
          <Icon name="next_arrow_black" />
        </span>
        {selectIndex === index && (
          <div className="contract-group-content">
            <div className="group-content-item">
              <span>总收益率</span>
              <span className="group-content-rate-green">66.88%</span>
            </div>
            <div className="group-content-item">
              <span>合约组资产</span>
              <span>
                123456.12 <span>USD</span>
              </span>
            </div>
            <div className="group-content-item">
              <span>仓位资产</span>
              <span>
                123456.12 <span>USD</span>
              </span>
            </div>
            <div className="group-content-item">
              <span>额外保证金 USD 价值</span>
              <span>
                123456.12 <span>USD</span>
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  useImperativeHandle(ref, () => ({
    openContractGroup() {
      setContractGroupVisible(true)
    },
  }))

  const setNewContractGroup = () => {
    return (
      <div className="new-contract-group" onClick={() => setContractChange()}>
        <span className="contract-group-label">新建合约组</span>
        <img src={`${oss_svg_image_domain_address}new-contract-group.png`} alt="" />
        <span className="contract-group-icon">
          <Icon name="next_arrow_black" />
        </span>
      </div>
    )
  }

  return (
    <div className={styles.scoped}>
      <Overlay visible={contractGroupVisible} onClick={() => setContractGroupChange()} className="overlay-container">
        <div className="contract-group-container">
          {setNewContractGroup()}
          <div className="contract-group-container-content">
            {setProfitContractGroup(1)}
            {setProfitContractGroup(2)}
            {setProfitContractGroup(1)}
            {setProfitContractGroup(2)}
            {setProfitContractGroup(1)}
            {setProfitContractGroup(2)}
          </div>
        </div>
      </Overlay>
    </div>
  )
}

export default forwardRef(ContractGroup)
