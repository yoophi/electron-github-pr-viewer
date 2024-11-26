import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { SettingData } from '../model/setting'

type State = {
  setting?: SettingData
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
        set({ setting })
      }
    }),
    { store: 'useSettingStore' }
  )
)
