/**
 * 资产总览 - 资产列表
 */
import { t } from '@lingui/macro'
import { useCommonStore } from '@/store/common'
import { formatCoinAmount, rateFilter } from '@/helper/assets/spot'
import { useUpdateEffect } from 'ahooks'
import { useAssetsStore } from '@/store/assets/spot'
import { AssetsRouteEnum } from '@/constants/assets'
import Icon from '@/components/icon'
import { CommonDigital } from '@/components/common-digital'
import { AuthModuleEnum, getAuthModuleRoutes } from '@/helper/modal-dynamic'
import styles from './index.module.css'

function AssetsList() {
  const { assetsData: { coinAssetsData, futuresAssetsData, c2cAssetsData } = {}, updateAssetsModule } =
    useAssetsStore().assetsModule
  const { isFusionMode } = useCommonStore()
  const { totalAmount: coinTotalAmount = '', coinName = '', symbol = '' } = coinAssetsData || {}
  const {
    totalAmount: futuresTotalAmount = '',
    coinName: futuresCoinName = '',
    symbol: futuresSymbol = '',
  } = futuresAssetsData || {}
  const { totalAmount: c2cTotalAmount = '', coinName: c2cCoinName = '', symbol: c2cSymbol = '' } = c2cAssetsData || {}

  const coins = {
    title: t`features_assets_overview_list_assets_list_index_wrhnc0tshaqqau_srquzp`,
    icon: 'asset_overview_coin',
    route: AssetsRouteEnum.coins,
    eth: `${formatCoinAmount(symbol, coinTotalAmount)} ${coinName}`,
    rmb: rateFilter({ amount: coinTotalAmount, symbol, isFormat: true, showUnit: !isFusionMode }),
  }
  const contract = {
    title: t`assets.index.overview.contract_assets`,
    icon: 'asset_overview_contract',
    route: AssetsRouteEnum.contract,
    eth: `${formatCoinAmount(futuresSymbol, futuresTotalAmount)} ${futuresCoinName}`,
    rmb: rateFilter({ amount: futuresTotalAmount, symbol: futuresSymbol, isFormat: true, showUnit: !isFusionMode }),
  }
  const c2c = {
    title: t`features_assets_index_overview_jn-ekfsbiacj5sqz_s4gw`,
    icon: 'nav_order_c2c',
    route: AssetsRouteEnum.c2c,
    eth: `${formatCoinAmount(c2cSymbol, c2cTotalAmount)} ${c2cCoinName}`,
    rmb: rateFilter({ amount: c2cTotalAmount, symbol: c2cSymbol, isFormat: true, showUnit: !isFusionMode }),
  }
  // {
  //   title: t`assets.index.overview.leverage_assets`,
  //   route: AssetsRouteEnum.leverage,
  //   icon: 'asset_overview_lever',
  //   eth: `${formatCoinAmount(marginSymbol, marginTotalAmount)} ${marginCoinName}`,
  //   rmb: rateFilter({ amount: marginTotalAmount, symbol: marginSymbol }),
  // },
  // {
  //   title: t`assets.index.overview.financial_assets`,
  //   icon: 'asset_overview_money',
  //   route: AssetsRouteEnum.financial,
  //   eth: `${formatCoinAmount(financialSymbol, financialTotalAmount)} ${financialCoinName}`,
  //   rmb: rateFilter({ amount: financialTotalAmount, symbol: financialSymbol }),
  // },
  const assetsList = isFusionMode
    ? [coins, contract]
    : getAuthModuleRoutes({ coins, [AuthModuleEnum.contract]: contract, [AuthModuleEnum.c2c]: c2c })

  useUpdateEffect(() => {}, [useAssetsStore().assetsModule])

  return (
    <div className={styles['assets-list-root']}>
      {assetsList.map(menu => {
        return (
          <div
            key={menu.route}
            className="assets-list-cell"
            onClick={() => {
              updateAssetsModule({ activeTab: menu.route })
            }}
          >
            <div className="list-cell-labels">
              <Icon name={menu.icon} hasTheme className="labels-icon" />
              <span>{menu.title}</span>
            </div>

            <div className="list-cell-values">
              {/* {!isFusionMode && <CommonDigital content={menu.eth} isEncrypt className="total-quantity" />} */}
              <CommonDigital content={menu.rmb} isEncrypt className="total-quantity" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { AssetsList }
