import { oss_svg_image_domain_address } from '@/constants/oss'

export const LEVEL_RATE_CODE = 'rate_discount' // 等级费率 code

export const SPECIAL_AVATAR_CODE = 'exclusive_avatar' // 专属头像框 code

export const VIP_LEVEL_ICON_MAP = {
  LV0: `${oss_svg_image_domain_address}image_rights_lv0.png`,
  LV1: `${oss_svg_image_domain_address}image_rights_lv1.png`,
  LV2: `${oss_svg_image_domain_address}image_rights_lv2.png`,
  LV3: `${oss_svg_image_domain_address}image_rights_lv3.png`,
  LV4: `${oss_svg_image_domain_address}image_rights_lv4.png`,
  LV5: `${oss_svg_image_domain_address}image_rights_lv5.png`,
  LV6: `${oss_svg_image_domain_address}image_rights_lv6.png`,
  LV7: `${oss_svg_image_domain_address}image_rights_lv7.png`,
  LV8: `${oss_svg_image_domain_address}image_rights_lv8.png`,
  LV9: `${oss_svg_image_domain_address}image_rights_lv9.png`,
  LV10: `${oss_svg_image_domain_address}image_rights_lv10.png`,
}

export const RIGHTS_LIST_DIC_CODE = 'benefit_code' //  VIP权益名称数据字典

export const DERIVATIVE_LIST_DIC_CODE = 'derivative_cd' // VIP衍生品数据字典

export enum amountCalStatus {
  enable = 'enable',
  disable = 'disable',
}

export const VIP_RIGHTS_ICON_MAP = {
  rate_discount: `${oss_svg_image_domain_address}image_rights_rate.png`,
  exclusive_avatar: `${oss_svg_image_domain_address}image_rights_exclusive.png`,
  service_group: `${oss_svg_image_domain_address}image_rights_message.png`,
  one_to_one_service: `${oss_svg_image_domain_address}image_rights_manage.png`,
  project_recommend: `${oss_svg_image_domain_address}image_rights_project.png`,
  airdrop_priority: `${oss_svg_image_domain_address}image_rights_airdrop.png`,
  currency_priority: `${oss_svg_image_domain_address}image_rights_newcoin.png`,
  birthday_surprise: `${oss_svg_image_domain_address}image_rights_birthday.png`,
}

export const VIP_DERIVE_AS_ICON_MAP = {
  'futures': `${oss_svg_image_domain_address}vip_image_derive_future.png`,
  'ternary-option': `${oss_svg_image_domain_address}vip_image_derive_option.png`,
  'recreation': `${oss_svg_image_domain_address}vip_image_derive_game.png`,
}
