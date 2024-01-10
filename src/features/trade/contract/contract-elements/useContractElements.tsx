import { t } from '@lingui/macro'

const useContractElements = (baseSymbolName?: string) => {
  const modalExplain = {
    nominalvalue: {
      title: t({
        id: 'features_trade_contract_contract_elements_usecontractelements_5101481',
        values: { 0: baseSymbolName },
      }),
      content: t`features_trade_contract_contract_elements_usecontractelements_5101482`,
    },
    maximumleverage: {
      title: t`features_trade_contract_contract_elements_usecontractelements_5101483`,
      content: t`features_trade_contract_contract_elements_usecontractelements_5101484`,
    },
    maintenancemarginrate: {
      title: t`features_trade_contract_contract_elements_usecontractelements_5101485`,
      content: t`features_trade_contract_contract_elements_usecontractelements_5101486`,
    },
    maintenancemarginamount: {
      title: t`features_trade_contract_contract_elements_usecontractelements_5101487`,
      content: t`features_trade_contract_contract_elements_usecontractelements_5101488`,
    },
  }

  const getTypeIndName = {
    delivery: t`constants_market_market_list_market_module_index_5101361`,
    perpetual: t`assets.enum.tradeCoinType.perpetual`,
  }

  return { modalExplain, getTypeIndName }
}

export { useContractElements }
