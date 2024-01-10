import { baseAgentStatsStore } from '@/store/agent/agent-gains'
import dayjs from 'dayjs'

const incomesAnalysisDemo = () => {
  const limit = 30
  const { productCodeMap } = baseAgentStatsStore.getState()
  let demo = [] as any[]

  for (let i = 0; i < limit; i += 1) {
    const set = Object.keys(productCodeMap).reduce((prev: any, curr) => {
      const obj = {
        productCd: curr,
        createdByTime: dayjs().subtract(i, 'day').valueOf(),
        legalCurIncome: 10,
      }
      prev.push(obj)
      return prev
    }, [])

    demo = [...demo, ...set]
  }

  return demo
}

const totalIncomeDemo = () => {
  const limit = 30
  let demo = [] as any[]

  for (let i = 0; i < limit; i += 1) {
    demo.push({
      createdByTime: dayjs().subtract(i, 'day').valueOf(),
      legalCurIncome: 10,
    })
  }
  return demo
}

export { totalIncomeDemo, incomesAnalysisDemo }
