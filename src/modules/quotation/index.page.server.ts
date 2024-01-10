export async function onBeforeRender(pageContext) {
  return {
    pageContext: {
      layoutParams: {
        footerShow: true, // 是否需要 footer
      },
      pageProps: {
        list: [
          {
            title: '涨幅榜',
            data: [
              {
                title: 'TEST111',
                subTitle: 'USDT',
                price: '21.6337',
                gain: '+17.03%',
                id: 1,
              },
              {
                title: 'TEST2',
                subTitle: 'USDT',
                price: '21.6337',
                gain: '+17.03%',
                id: 2,
              },
              {
                title: 'TEST222',
                subTitle: 'USDT',
                price: '21.6337',
                gain: '+17.03%',
                id: 3,
              },
              {
                title: 'TEST4',
                subTitle: 'USDT',
                price: '21.6337',
                gain: '+17.03%',
                id: 4,
              },
              {
                title: 'TEST5',
                subTitle: 'USDT',
                price: '21.6337',
                gain: '+17.03%',
                id: 5,
              },
              {
                title: 'TEST6',
                subTitle: 'USDT',
                price: '21.6337',
                gain: '+17.03%',
                id: 6,
              },
              {
                title: 'TEST7',
                subTitle: 'USDT',
                price: '21.6337',
                gain: '+17.03%',
                id: 7,
              },
              {
                title: 'TEST8',
                subTitle: 'USDT',
                price: '21.6337',
                gain: '+17.03%',
                id: 8,
              },
              {
                title: 'TEST922',
                subTitle: 'USDT',
                price: '21.6337',
                gain: '+17.03%',
                id: 9,
              },
              {
                title: 'TEST10',
                subTitle: 'USDT',
                price: '21.6337',
                gain: '+17.03%',
                id: 10,
              },
            ],
          },
          {
            title: '成交额榜',
            data: [
              {
                title: 'BTC',
                subTitle: 'USDT',
                price: '30621.49',
                gain: '+12.03%',
                id: 11,
              },
            ],
          },
          {
            title: '周热力榜',
            data: [
              {
                title: 'ETH',
                subTitle: 'USDT',
                price: '2199.6337',
                gain: '+1.03%',
                id: 12,
              },
            ],
          },
        ],
      },
    },
  }
}
