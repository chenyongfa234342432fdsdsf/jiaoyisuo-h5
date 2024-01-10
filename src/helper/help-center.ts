import { oss_svg_image_domain_address } from '@/constants/oss'

export function handleVideo(ele) {
  ele.setAttribute('x5-video-player-type', 'h5')
  ele.setAttribute('x5-video-player-fullscreen', 'true')
  ele.setAttribute('x5-video-orientation', 'landscape')
  ele.poster = `${oss_svg_image_domain_address}login_plate.png`
  return ele
}
