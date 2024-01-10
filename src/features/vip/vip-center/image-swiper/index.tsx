import { t } from '@lingui/macro'

import { oss_svg_image_domain_address } from '@/constants/oss'

import Icon from '@/components/icon'
import { Swiper } from '@nbit/vant'
import classNames from 'classnames'
import styles from './index.module.css'

export enum vipLevelFundingType {
  spot = 'spot',
  contract = 'contract',
}

const fileName = 'vip/vip%E4%B8%AD%E5%BF%83%E5%88%87%E5%9B%BE%E5%B7%B2%E5%8E%8B%E7%BC%A9/'

const blockBg = {
  0: 'image_vip_lv0_bj2x.png',
  1: 'image_vip_lv1_bj2x.png',
  2: 'image_vip_lv1_bj2x.png',
  3: 'image_vip_lv1_bj2x.png',
  4: 'image_vip_lv4_bj2x.png',
  5: 'image_vip_lv4_bj2x.png',
  6: 'image_vip_lv4_bj2x.png',
  7: 'image_vip_lv7_bj2x.png',
  8: 'image_vip_lv7_bj2x.png',
  9: 'image_vip_lv7_bj2x.png',
  10: 'image_vip_lv10_bj2x.png',
}

const colorMap = {
  0: '#91A7CF',
  1: '#6E98D9',
  2: '#6E98D9',
  3: '#6E98D9',
  4: '#8281D8',
  5: '#8281D8',
  6: '#8281D8',
  7: '#F2C777',
  8: '#F2C777',
  9: '#F2C777',
  10: '#F2C777',
}

const levelMap = {
  0: 'image_vip_lv02x.png',
  1: 'image_vip_lv12x.png',
  2: 'image_vip_lv22x.png',
  3: 'image_vip_lv32x.png',
  4: 'image_vip_lv42x.png',
  5: 'image_vip_lv52x.png',
  6: 'image_vip_lv62x.png',
  7: 'image_vip_lv72x.png',
  8: 'image_vip_lv82x.png',
  9: 'image_vip_lv92x.png',
  10: 'image_vip_lv102x.png',
}

function ImageSwiper(props) {
  const { list, currentIndex, swiperRef, setCurrentIndex, curUSerConfig, setProtectVisible } = props

  return (
    <div className={styles.scoped}>
      <div className="swiper-wrap">
        <Swiper
          onChange={index => {
            setCurrentIndex(index < 0 ? 0 : index)
          }}
          ref={swiperRef}
          // slideSize={95.73 * (375 / document.body.clientWidth)}
          slideSize={100}
          indicator={false}
          // indicator={(total, current) => {
          //   const arr: Array<number> = []
          //   for (let i = 0; i < total; i += 1) {
          //     arr.push(i)
          //   }

          //   return (
          //     <div
          //       className="flex justify-center mt-2"
          //       style={{
          //         background: 'transparent',
          //       }}
          //     >
          //       {arr.map((item, index) => {
          //         return (
          //           <div
          //             key={index}
          //             className={classNames('h-[2px]', {
          //               'ml-1': index,
          //               'w-[10px]': current === index,
          //               'w-1': current !== index,
          //               'bg-brand_color': current === index,
          //               'bg-bg_button_disabled': current !== index,
          //             })}
          //           ></div>
          //         )
          //       })}
          //     </div>
          //   )
          // }}
        >
          {list?.map((item, index) => (
            <Swiper.Item key={index}>
              <div
                className="relative h-[110px] flex items-center justify-between p-4 box-border rounded-[8px]"
                style={{
                  backgroundImage: `url(${oss_svg_image_domain_address}${fileName}${blockBg[index]})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                }}
              >
                <div>
                  <div className="text-xs leading-[18px]" style={{ color: colorMap[index] }}>
                    {curUSerConfig?.level < item?.level ? (
                      <span>
                        <Icon name="icon_vip_lock" hasTheme className="text-xs !mt-0" />
                        <span className="ml-1">{t`features_vip_vip_center_image_swiper_index_u7q0g0mudc`}</span>
                      </span>
                    ) : curUSerConfig?.level > item?.level ? (
                      t`features_vip_vip_center_image_swiper_index_flfg4aqab6`
                    ) : (
                      t`features_vip_vip_center_image_swiper_index_cohsvhenck`
                    )}
                  </div>
                  <div className="flex items-end">
                    <img
                      alt=""
                      src={`${oss_svg_image_domain_address + fileName}${levelMap[index]}`}
                      className="w-[66px] h-[30px] mt-6"
                    ></img>
                    {curUSerConfig?.level === item.level && curUSerConfig.protectDay ? (
                      <div
                        className="h-[20px] rounded-lg px-2 py-[1px] flex items-center justify-center text-xs ml-2"
                        style={{
                          color: '#FFFFFF',
                          background: colorMap[index],
                        }}
                      >
                        {t`features_vip_vip_center_image_swiper_index_nd12hvh4u9`}
                        <Icon
                          onClick={() => {
                            setProtectVisible(true)
                          }}
                          name="property_icon_tips"
                          className="ml-1 h-3 text-xs !mt-0 text-text_color_03"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
                <img
                  alt=""
                  src={`${oss_svg_image_domain_address + fileName}image_vip_lv${index}_${
                    index === 0 ? '' : 'i'
                  }con2x.png`}
                  style={{ objectFit: 'contain' }}
                  className="w-[74px] h-[74px]"
                ></img>
                <>
                  {index ? (
                    <div
                      className="w-2 h-[96px] rounded-[16px] absolute top-2 left-[-16px]"
                      style={{
                        borderRadius: '0 8px 8px 0',
                        background: colorMap[index - 1],
                      }}
                    ></div>
                  ) : null}
                  {index !== list.length - 1 ? (
                    <div
                      className="w-2 h-[96px] rounded-[16px] absolute top-2 right-[-16px]"
                      style={{
                        borderRadius: '8px 0 0 8px',
                        background: colorMap[index + 1],
                      }}
                    ></div>
                  ) : null}
                </>
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ImageSwiper
