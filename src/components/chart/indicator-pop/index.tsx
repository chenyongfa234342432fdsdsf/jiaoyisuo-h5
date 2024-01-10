import { Input, Popup } from '@nbit/vant'
import { useState } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import { MainIndicatorType, SubIndicatorType, SwitchTimeType } from '@nbit/chart-utils'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import cacheUtils from 'store'

import { useMarketStore } from '@/store/market'
import { usePageContext } from '@/hooks/use-page-context'

interface PropsType {
  setMainIndicator: (v) => void
  mainIndicator: MainIndicatorType
  subIndicator: SubIndicatorType
  setSubIndicator: (v) => void
  popIndicatorState: boolean
  setPopIndicatorState: (v) => void
}

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

function IndicatorPop(props: PropsType) {
  const { setMainIndicator, mainIndicator, subIndicator, setSubIndicator, popIndicatorState, setPopIndicatorState } =
    props
  const marketState = useMarketStore()
  const totalShareTimeList = marketState.totalShareTimeList
  const initialShareTimeList = marketState.initialShareTimeList

  const [initialShareTimeListCopy, setInitialShareTimeListCopy] = useState<Array<SwitchTimeType>>(initialShareTimeList)
  const restShareTimeList = marketState.restShareTimeList

  const updateInitialShareTimeList = marketState.updateInitialShareTimeList
  const updateRestShareTimeList = marketState.updateRestShareTimeList

  const pageContext = usePageContext()
  const locale = pageContext.locale || ''

  const onIndicatorClose = () => setPopIndicatorState(false)

  const backHeightPop = () => {
    setPopIndicatorState(false)
    cacheUtils.set('mainIndicator', mainIndicator)
    cacheUtils.set('subIndicator', subIndicator)
  }

  const maExpand = () => {
    setMainIndicator({
      ...mainIndicator,
      ma: {
        ...mainIndicator.ma,
        expand: !mainIndicator.ma.expand,
      },
    })
  }

  const resetMa = () => {
    setMainIndicator({
      ...mainIndicator,
      ma: {
        ...mainIndicator.ma,
        cur: mainIndicator.ma.init,
      },
    })
  }

  const selectMa = index => {
    setMainIndicator({
      ...mainIndicator,
      ma: {
        ...mainIndicator.ma,
        cur: mainIndicator.ma.cur.map((item, _index) => {
          if (_index === index) {
            return {
              ...item,
              select: !item.select,
            }
          }
          return item
        }),
      },
    })
  }

  const selectRsi = index => {
    setSubIndicator({
      ...subIndicator,
      rsi: {
        ...subIndicator.rsi,
        cur: subIndicator.rsi.cur.map((item, _index) => {
          if (_index === index) {
            return {
              ...item,
              select: !item.select,
            }
          }
          return item
        }),
      },
    })
  }

  const selectWr = index => {
    setSubIndicator({
      ...subIndicator,
      wr: {
        ...subIndicator.wr,
        cur: subIndicator.wr.cur.map((item, _index) => {
          if (_index === index) {
            return {
              ...item,
              select: !item.select,
            }
          }
          return item
        }),
      },
    })
  }

  const updateMa = (digit, index) => {
    setMainIndicator({
      ...mainIndicator,
      ma: {
        ...mainIndicator.ma,
        cur: mainIndicator.ma.cur.map((item, _index) => {
          if (_index === index) {
            return {
              ...item,
              strip: digit > 999 || digit < 1 ? 1 : digit,
            }
          }
          return item
        }),
      },
    })
  }

  const bollExpand = () => {
    setMainIndicator({
      ...mainIndicator,
      boll: {
        ...mainIndicator.boll,
        expand: !mainIndicator.boll.expand,
      },
    })
  }

  const resetBoll = () => {
    setMainIndicator({
      ...mainIndicator,
      boll: {
        ...mainIndicator.boll,
        cur: mainIndicator.boll.init,
      },
    })
  }

  const updateBoll = (digit, key) => {
    setMainIndicator({
      ...mainIndicator,
      boll: {
        ...mainIndicator.boll,
        cur: {
          ...mainIndicator.boll.cur,
          [key]: digit > 99 || digit < 1 ? 1 : digit,
        },
      },
    })
  }

  const macdExpand = () => {
    setSubIndicator({
      ...subIndicator,
      macd: {
        ...subIndicator.macd,
        expand: !subIndicator.macd.expand,
      },
    })
  }

  const resetMacd = () => {
    setSubIndicator({
      ...subIndicator,
      macd: {
        ...subIndicator.macd,
        cur: subIndicator.macd.init,
      },
    })
  }

  const updateMacd = (digit, key) => {
    setSubIndicator({
      ...subIndicator,
      macd: {
        ...subIndicator.macd,
        cur: {
          ...subIndicator.macd.cur,
          [key]: digit > 200 || digit < 2 ? 2 : digit,
        },
      },
    })
  }

  const kdjExpand = () => {
    setSubIndicator({
      ...subIndicator,
      kdj: {
        ...subIndicator.kdj,
        expand: !subIndicator.kdj.expand,
      },
    })
  }

  const resetKdj = () => {
    setSubIndicator({
      ...subIndicator,
      kdj: {
        ...subIndicator.kdj,
        cur: subIndicator.kdj.init,
      },
    })
  }

  const updateKdj = (digit, key) => {
    setSubIndicator({
      ...subIndicator,
      kdj: {
        ...subIndicator.kdj,
        cur: {
          ...subIndicator.kdj.cur,
          [key]: digit > 30 || digit < 2 ? 2 : digit,
        },
      },
    })
  }

  const rsiExpand = () => {
    setSubIndicator({
      ...subIndicator,
      rsi: {
        ...subIndicator.rsi,
        expand: !subIndicator.rsi.expand,
      },
    })
  }

  const resetRsi = () => {
    setSubIndicator({
      ...subIndicator,
      rsi: {
        ...subIndicator.rsi,
        cur: subIndicator.rsi.init,
      },
    })
  }

  const updateRsi = (digit, index) => {
    setSubIndicator({
      ...subIndicator,
      rsi: {
        ...subIndicator.rsi,
        cur: subIndicator.rsi.cur.map((item, _index) => {
          if (_index === index) {
            return {
              ...item,
              value: digit > 120 || digit < 2 ? 2 : digit,
            }
          }
          return item
        }),
      },
    })
  }

  const wrExpand = () => {
    setSubIndicator({
      ...subIndicator,
      wr: {
        ...subIndicator.wr,
        expand: !subIndicator.wr.expand,
      },
    })
  }

  const resetWr = () => {
    setSubIndicator({
      ...subIndicator,
      wr: {
        ...subIndicator.wr,
        cur: subIndicator.wr.init,
      },
    })
  }

  const updateWr = (digit, index) => {
    setSubIndicator({
      ...subIndicator,
      wr: {
        ...subIndicator.wr,
        cur: subIndicator.wr.cur.map((item, _index) => {
          if (_index === index) {
            return {
              ...item,
              value: digit > 100 || digit < 2 ? 2 : digit,
            }
          }
          return item
        }),
      },
    })
  }
  const maIntro = t`components_chart_indicator_pop_index_syg2zndhar`
  const bollIntro = t`components_chart_indicator_pop_index_yjyem6rlqr`
  const kdjIntro = t`components_chart_indicator_pop_index_q9paznew4g`
  const macadIntro = t`components_chart_indicator_pop_index_mxdowftk7_`
  const rsiIntro = t`components_chart_indicator_pop_index_essdhymtim`
  const wrIntro = t`components_chart_indicator_pop_index_f2ysijzh9w`

  return (
    <Popup visible={popIndicatorState} className="h-full" position="bottom" onClose={onIndicatorClose}>
      <div className="chart-ind-set-pop">
        <Icon onClick={backHeightPop} name={'back'} hasTheme className="icon" />

        <h1 className="title">{t`components_chart_chart_pop_index_510150`}</h1>

        <div className="divide"></div>

        <div className="main-chart">{t`components_chart_indicator_pop_index_510152`}</div>

        <div className="common-wrap">
          <div className="common-title-wrap">
            <div className="common-title">MA</div>
            <div className="common">
              <span>MA1-</span>
              <span>{mainIndicator.ma.cur[0].strip}</span>
              <span className="ml-1">MA2-</span>
              <span>{mainIndicator.ma.cur[1].strip}</span>
              <span className="ml-1">MA3-</span>
              <span>{mainIndicator.ma.cur[2].strip}</span>
              <Icon
                onClick={maExpand}
                hasTheme
                name={mainIndicator.ma.expand ? 'asset_view_coin_fold' : 'asset_view_coin_unfold'}
                className="ind-icon"
              />
            </div>
          </div>
          {mainIndicator.ma.expand ? (
            <div className="expand-wrap">
              <div className="common-set">
                {mainIndicator.ma.cur.map((item, index) => {
                  return (
                    <div key={index} className="common-row">
                      <Icon
                        onClick={() => {
                          selectMa(index)
                        }}
                        hasTheme={!item.select}
                        name={item.select ? 'login_password_satisfy' : 'login_password-dissatisfy'}
                        className="select-icon"
                      />
                      <Input
                        align="right"
                        className="input"
                        value={item.strip.toString()}
                        type="digit"
                        onChange={digit => updateMa(digit, index)}
                      />
                      <div className="color" style={{ background: item.color }}></div>
                      <div className="notice">MA{index}</div>
                    </div>
                  )
                })}
              </div>
              <div onClick={resetMa} className="reset-wrap">
                <Icon name={'a-home-icon-reset'} className="reset-icon" hasTheme />
                <span className="reset">{t`features/assets/financial-record/record-screen-modal/index-1`}</span>
              </div>
              <div className="describe">
                <p>{t`features/market/detail/current-coin-describe/index-6`}:</p>
                <p>{maIntro}</p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="divide"></div>

        <div className="boll-wrap">
          <div className="common-title-wrap">
            <div className="common-title">BOLL</div>
            <div className="common">
              <span>MID</span>
              <span className="ml-1">{mainIndicator.boll.cur.mid as number}</span>
              <span className="ml-1">STD</span>
              <span className="ml-1">{mainIndicator.boll.cur.std as number}</span>
              <Icon
                onClick={bollExpand}
                name={mainIndicator.boll.expand ? 'asset_view_coin_fold' : 'asset_view_coin_unfold'}
                className="ind-icon"
                hasTheme
              />
            </div>
          </div>
          {mainIndicator.boll.expand ? (
            <div className="expand-wrap">
              <div className="boll-set">
                <div className="boll-row">
                  <Input
                    align="right"
                    className="input"
                    value={mainIndicator.boll.cur.mid.toString()}
                    type="digit"
                    onChange={digit => updateBoll(digit, 'mid')}
                  />
                  <div className="boll-notice">MID</div>
                </div>
                <div className="boll-row">
                  <Input
                    align="right"
                    className="input"
                    value={mainIndicator.boll.cur.std.toString()}
                    type="digit"
                    onChange={digit => updateBoll(digit, 'std')}
                  />
                  <div className="boll-notice">STD</div>
                </div>
              </div>
              <div onClick={resetBoll} className="reset-wrap">
                <Icon name={'a-home-icon-reset'} hasTheme className="reset-icon" />
                <span className="reset">{t`features/assets/financial-record/record-screen-modal/index-1`}</span>
              </div>
              <div className="describe">
                <p>{t`features/market/detail/current-coin-describe/index-6`}:</p>
                <p>{bollIntro}</p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="divide"></div>

        <div className="secondary-chart">{t`components_chart_indicator_pop_index_510162`}</div>

        <div className="macd-wrap">
          <div className="common-title-wrap">
            <div className="common-title">MACD</div>
            <div className="common">
              <span>DIF</span>
              <span className="ml-1">{subIndicator.macd.cur.fast as number}</span>
              <span className="ml-1">DEA</span>
              <span className="ml-1">{subIndicator.macd.cur.slow as number}</span>
              <span className="ml-1">MACD</span>
              <span className="ml-1">{subIndicator.macd.cur.signal as number}</span>
              <Icon
                onClick={macdExpand}
                hasTheme
                name={subIndicator.macd.expand ? 'asset_view_coin_fold' : 'asset_view_coin_unfold'}
                className="ind-icon"
              />
            </div>
          </div>
          {subIndicator.macd.expand ? (
            <div className="expand-wrap">
              <div className="macd-set">
                <div className="macd-row">
                  <Input
                    align="right"
                    className="input"
                    value={subIndicator.macd.cur.fast.toString()}
                    type="digit"
                    onChange={digit => updateMacd(digit, 'fast')}
                  />
                  <div className="macd-notice">DIF</div>
                </div>
                <div className="macd-row">
                  <Input
                    align="right"
                    className="input"
                    value={subIndicator.macd.cur.slow.toString()}
                    type="digit"
                    onChange={digit => updateMacd(digit, 'slow')}
                  />
                  <div className="macd-notice">DEA</div>
                </div>
                <div className="macd-row">
                  <Input
                    align="right"
                    className="input"
                    value={subIndicator.macd.cur.signal.toString()}
                    type="digit"
                    onChange={digit => updateMacd(digit, 'signal')}
                  />
                  <div className="macd-notice">MACD</div>
                </div>
              </div>
              <div onClick={resetMacd} className="reset-wrap">
                <Icon name={'a-home-icon-reset'} hasTheme className="reset-icon" />
                <span className="reset">{t`features/assets/financial-record/record-screen-modal/index-1`}</span>
              </div>
              <div className="describe">
                <p>{t`features/market/detail/current-coin-describe/index-6`}:</p>
                <p>{macadIntro}</p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="divide"></div>

        <div className="kdj-wrap">
          <div className="common-title-wrap">
            <div className="common-title">KDJ</div>
            <div className="common">
              <span>K</span>
              <span className="ml-1">{subIndicator.kdj.cur.k as number}</span>
              <span className="ml-1">D</span>
              <span className="ml-1">{subIndicator.kdj.cur.d as number}</span>
              <span className="ml-1">J</span>
              <span className="ml-1">{subIndicator.kdj.cur.j as number}</span>
              <Icon
                onClick={kdjExpand}
                name={subIndicator.kdj.expand ? 'asset_view_coin_fold' : 'asset_view_coin_unfold'}
                className="ind-icon"
                hasTheme
              />
            </div>
          </div>
          {subIndicator.kdj.expand ? (
            <div className="expand-wrap">
              <div className="kdj-set">
                <div className="kdj-row">
                  <Input
                    align="right"
                    className="input"
                    value={subIndicator.kdj.cur.k.toString()}
                    type="digit"
                    onChange={digit => updateKdj(digit, 'k')}
                  />
                  <div className="kdj-notice">K</div>
                </div>
                <div className="kdj-row">
                  <Input
                    align="right"
                    className="input"
                    value={subIndicator.kdj.cur.d.toString()}
                    type="digit"
                    onChange={digit => updateKdj(digit, 'd')}
                  />
                  <div className="kdj-notice">D</div>
                </div>
                <div className="kdj-row">
                  <Input
                    align="right"
                    className="input"
                    value={subIndicator.kdj.cur.j.toString()}
                    type="digit"
                    onChange={digit => updateKdj(digit, 'j')}
                  />
                  <div className="kdj-notice">J</div>
                </div>
              </div>
              <div onClick={resetKdj} className="reset-wrap">
                <Icon name={'a-home-icon-reset'} className="reset-icon" hasTheme />
                <span className="reset">{t`features/assets/financial-record/record-screen-modal/index-1`}</span>
              </div>
              <div className="describe">
                <p>{t`features/market/detail/current-coin-describe/index-6`}:</p>
                <p>{kdjIntro}</p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="divide"></div>

        <div className="common-wrap">
          <div className="common-title-wrap">
            <div className="common-title">RSI</div>
            <div className="common">
              <span>RSI1-</span>
              <span>{subIndicator.rsi.cur[0].value}</span>
              <Icon
                onClick={rsiExpand}
                name={subIndicator.rsi.expand ? 'asset_view_coin_fold' : 'asset_view_coin_unfold'}
                hasTheme
                className="ind-icon"
              />
            </div>
          </div>
          {subIndicator.rsi.expand ? (
            <div className="expand-wrap">
              <div className="common-set">
                {subIndicator.rsi.cur.map((item, index) => {
                  return (
                    <div key={index} className="common-row">
                      <Icon
                        onClick={() => {
                          selectRsi(index)
                        }}
                        name={item.select ? 'login_password_satisfy' : 'login_password-dissatisfy_black'}
                        className="select-icon"
                      />
                      <Input
                        align="right"
                        className="input"
                        value={item.value?.toString()}
                        type="digit"
                        onChange={digit => updateRsi(digit, index)}
                      />
                      <div className="color" style={{ background: item.color }}></div>
                      <div className="notice">RSI{index}</div>
                    </div>
                  )
                })}
              </div>
              <div onClick={resetRsi} className="reset-wrap">
                <Icon name={'a-home-icon-reset'} className="reset-icon" hasTheme />
                <span className="reset">{t`features/assets/financial-record/record-screen-modal/index-1`}</span>
              </div>
              <div className="describe">
                <p>{t`features/market/detail/current-coin-describe/index-6`}:</p>
                <p>{rsiIntro}</p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="divide"></div>

        <div className="common-wrap">
          <div className="common-title-wrap">
            <div className="common-title">WR</div>
            <div className="common">
              <span>WR1-</span>
              <span>{subIndicator.wr.cur[0].value}</span>
              <Icon
                onClick={wrExpand}
                hasTheme
                name={subIndicator.wr.expand ? 'asset_view_coin_fold' : 'asset_view_coin_unfold'}
                className="ind-icon"
              />
            </div>
          </div>
          {subIndicator.wr.expand ? (
            <div className="expand-wrap">
              <div className="common-set">
                {subIndicator.wr.cur.map((item, index) => {
                  return (
                    <div key={index} className="common-row">
                      <Icon
                        onClick={() => {
                          selectWr(index)
                        }}
                        name={item.select ? 'login_password_satisfy' : 'login_password-dissatisfy_black'}
                        className="select-icon"
                      />
                      <Input
                        align="right"
                        className="input"
                        value={item.value?.toString()}
                        type="digit"
                        onChange={digit => updateWr(digit, index)}
                      />
                      <div className="color" style={{ background: item.color }}></div>
                      <div className="notice">WR{index}</div>
                    </div>
                  )
                })}
              </div>
              <div onClick={resetWr} className="reset-wrap">
                <Icon name={'a-home-icon-reset'} className="reset-icon" hasTheme />
                <span className="reset">{t`features/assets/financial-record/record-screen-modal/index-1`}</span>
              </div>
              <div className="describe">
                <p>{t`features/market/detail/current-coin-describe/index-6`}:</p>
                <p>{wrIntro}</p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="divide"></div>
      </div>
    </Popup>
  )
}

export default IndicatorPop
