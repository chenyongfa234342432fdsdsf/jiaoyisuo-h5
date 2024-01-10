import Icon from '@/components/icon'
import { getTernaryOptionHistoryPagePath, getTernaryOptionTodayPLPagePath } from '@/helper/route/ternary-option'
import { t } from '@lingui/macro'

export const getTernaryOptionHomeMenu = () => [
  {
    text: t`features_ternary_option_option_order_ternary_profit_loss_index_k7xmci5hoi`,
    icon: <Icon name="recreation_profit_loss" className="icon today-pl-icon" />,
    pagePath: getTernaryOptionTodayPLPagePath(),
  },
  {
    text: t`constants_ternary_option_market_trade_area_h_ljuq0ye3`,
    icon: <Icon name="recreation_current_record" className="icon history" />,
    pagePath: getTernaryOptionHistoryPagePath(),
  },
]

export const initOptionSubIndicator = {
  vol: {
    name: 'vol',
    select: false,
    hide: false,
    expand: false,
  },
  macd: {
    select: false,
    expand: false,
    init: {
      fast: 12,
      slow: 26,
      signal: 9,
    },
    cur: {
      fast: 12,
      slow: 26,
      signal: 9,
    },
  },
  kdj: {
    select: false,
    expand: false,
    init: {
      k: 14,
      d: 3,
      j: 3,
    },
    cur: {
      k: 14,
      d: 3,
      j: 3,
    },
  },
  rsi: {
    select: false,
    expand: false,
    init: [
      {
        value: 6,
        select: true,
        color: '#7F4E86',
      },
      {
        value: 12,
        select: true,
        color: '#ECC581',
      },
      {
        value: 24,
        select: true,
        color: '#D057E4',
      },
    ],
    cur: [
      {
        value: 6,
        select: true,
        color: '#7F4E86',
      },
      {
        value: 12,
        select: true,
        color: '#ECC581',
      },
      {
        value: 24,
        select: true,
        color: '#D057E4',
      },
    ],
  },
  wr: {
    select: false,
    expand: false,
    init: [
      {
        value: 14,
        select: true,
        color: '#7F4E86',
      },
      // {
      //   value: '',
      //   select: true,
      //   color: '#ECC581',
      // },
      // {
      //   value: '',
      //   select: true,
      //   color: '#D057E4',
      // },
    ],
    cur: [
      {
        value: 14,
        select: true,
        color: '#7F4E86',
      },
      // {
      //   value: '',
      //   select: true,
      //   color: '#ECC581',
      // },
      // {
      //   value: '',
      //   select: true,
      //   color: '#D057E4',
      // },
    ],
  },
}

export const initOptionMainIndicator = {
  ma: {
    select: false,
    expand: false,
    init: [
      {
        checked: true,
        select: true,
        strip: 5,
        type: 'close',
        color: '#7F4E86',
      },
      {
        checked: true,
        select: false,
        strip: 10,
        type: 'close',
        color: '#ECC581',
      },
      {
        checked: true,
        select: false,
        strip: 20,
        type: 'close',
        color: '#D057E4',
      },
      {
        checked: true,
        select: false,
        strip: '',
        type: 'close',
        color: '#6F92EE',
      },
      {
        checked: true,
        select: false,
        strip: '',
        type: 'close',
        color: '#6F92EE',
      },
      {
        checked: true,
        select: false,
        strip: '',
        type: 'close',
        color: '#BE775B',
      },
    ],
    cur: [
      {
        checked: true,
        select: true,
        strip: 5,
        type: 'close',
        color: '#7F4E86',
      },
      {
        checked: true,
        select: true,
        strip: 10,
        type: 'close',
        color: '#ECC581',
      },
      {
        checked: true,
        select: true,
        strip: 20,
        type: 'close',
        color: '#D057E4',
      },
      {
        checked: true,
        select: false,
        strip: '',
        type: 'close',
        color: '#6F92EE',
      },
      {
        checked: true,
        select: false,
        strip: '',
        type: 'close',
        color: '#6F92EE',
      },
      {
        checked: true,
        select: false,
        strip: '',
        type: 'close',
        color: '#BE775B',
      },
    ],
  },
  boll: {
    select: false,
    expand: false,
    init: {
      mid: 20,
      std: 2,
    },
    cur: {
      mid: 20,
      std: 2,
    },
  },
}
