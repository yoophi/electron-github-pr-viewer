import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { SettingData } from '../model/setting'

type State = {
  setting?: SettingData
  // memberMap
  // groups
}

type Actions = {
  setSettings: (setting: SettingData) => void
}

const initialState: State = {}

export const useSettingStore = create<State & Actions>()(
  devtools(
    (set) => ({
      ...initialState,
      setSettings: (setting: SettingData): void => {
        const idMember = [
          ...setting.members.map((member) => {
            const { name, ids } = member
            return ids.map((id) => {
              return {
                id,
                name
              }
            })
          })
        ]
        // const xx = idMember.reduce((prev, curr) => {
        //   return {
        //     ...prev,
        //     [curr.id]: curr
        //   }
        // }, {})

        set({ setting })
      }
    }),
    { store: 'useSettingStore' }
  )
)
