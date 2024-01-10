import { create } from 'zustand'
import produce from 'immer'
import { t } from '@lingui/macro'
import { createTrackedSelector } from 'react-tracked'

type IStore = ReturnType<typeof getStore>
function getStore(set, get) {
  return {
    modalRouter: {
      action: 0,
      latestDeviceNo: '',
      isForceWindow: false,
      title: '',
      content: '',
    },
    setModalClose: value =>
      set(
        produce((draft: IStore) => {
          draft.modalRouter = value
        })
      ),
  }
}

const baseModalDynamicStore = create(getStore)
const useModalDynamicStore = createTrackedSelector(baseModalDynamicStore)

export { useModalDynamicStore, baseModalDynamicStore }
