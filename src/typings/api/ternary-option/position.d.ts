export interface OptionPositionListReq {
    /** 分页参数页号，从 1 开始 */
    pageNum: number;
    /** 分页大小 默认 20，最小 1，最大 500 */
    pageSize?: number;
    /** 是否计算总数 true 是 false 否;不传默认为 true */
    count?: boolean;
    /** 需要置顶的期权产品 id */
    priorOption?: string;
}

export interface OptionPositionListResp {
    total?: number;
    pageNum?: number;
    pageSize?: number;
    list?: IOptionPositionList[];
}

export interface IOptionPositionList {
    /** 订单 ID */
    id: number;
    /** 下单金额 100 */
    amount: string;
    /** 结算周期 例如 30，60，1，2，3 */
    periodDisplay: number;
    /** 结算周期单位 SECONDS 表示秒；MINUTES 表示分钟 */
    periodUnit: string;
    /** 三元期权产品 symbol，例如 BTCUSD */
    symbol: string;
    /** 三元期权产品 ID */
    optionId: number;
    /** 方向 买涨 call  买跌 put 买涨超 over_call 买跌超 over_put */
    sideInd: string;
    /** 标的币 symbol 例如 BTC */
    baseCoinShortName: string;
    /** 计价币 symbol 例如 USD */
    quoteCoinShortName: string;
    /** 订单状态 processing 处理中；complete 已完成；fail 下单失败。 */
    statusCd: string;
    /** 三元期权选择的时间 id */
    periodId: number;
    /** 三预期权收益率配置 id */
    yieldId: number;
    /** 收益率 0.2，前端自己处理为 20%；-1，处理为 -100% */
    realYield: string;
    /** 开仓价格 25000.1 */
    openPrice: string;
    /** 目标价格 25500 */
    targetPrice: string;
    /** 结算时间 毫秒时间戳 */
    settlementTime: number;
    /** 开仓时间 毫秒时间戳 */
    createdByTime: number;
    /** 下单币种 symbol 例如 USDT */
    coinSymbol: string;
    /** 下单币种 ID */
    coinId: string;
    /** index_price 指数价格  mark_price 标记价格 */
    optionPriceType: string;
    /** delivery 交割    perpetual 永续 */
    typeInd: string;
    /** 价差 买涨买跌方向没有值 */
    amplitude: number;
    /** 当前价格，每次查询返回查询时刻的价格，后续价格变动需要接 ws.如果平台价格出现了问题，比如当前时间戳获取不到价格，值会为空 */
    currentPrice?: string;
    /** 使用了体验金券，则该字段有值 */
    voucherAmount: number
}