import { ResponsivePie } from '@nivo/pie'
import { uniq } from 'lodash'

function checkHasEqualRatio(data) {
  const unique = uniq(data)
  return unique.length === 1
}

export function PieChart({ data }) {
  let formatted = data
  if (checkHasEqualRatio(data.map(each => each.value)))
    formatted = data.map(each => {
      return {
        ...each,
        value: true,
      }
    })
  return (
    <ResponsivePie
      data={formatted}
      margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
      innerRadius={0.5} // 内圈半径
      enableArcLabels={false} // 启用/禁用弧标签
      enableArcLinkLabels={false}
      animate
      colors={(node: any) => {
        return `${node.data.color}`
      }}
      isInteractive={false} // 悬浮动画
    />
  )
}
