/**
 * 强平 - 仓位信息
 */
import { getFuturesGroupTypeName } from '@/constants/assets/futures'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { getTextFromStoreEnums } from '@/helper/store'
import { TradeDirectionTag } from '../../common/trade-direction-tag'

function LiquidationPositionInfo() {
  const { futuresPosition, futuresEnums } = useAssetsFuturesStore()
  const { liquidationDetails } = futuresPosition || {}
  return (
    <div className="position-wrap">
      <div className="position-info">
        <div className="info-name">
          {liquidationDetails?.symbol} {getFuturesGroupTypeName(liquidationDetails?.swapTypeInd)}
        </div>

        <TradeDirectionTag
          showFutures={false}
          sideInd={liquidationDetails?.sideInd}
          lever={`${liquidationDetails?.lever}`}
        />
      </div>

      <div className="position-type">
        {getTextFromStoreEnums(liquidationDetails?.operationTypeCd, futuresEnums.historyPositionCloseTypeEnum.enums)}
      </div>
    </div>
  )
}

export { LiquidationPositionInfo }
