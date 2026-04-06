import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { SettingData, Member } from '../model/setting'
import { IPCResponse } from '@/shared/model'

type State = {
  setting?: SettingData
  members: Record<string, Member>
  memberIdMap: Record<number, Member>
}

type Actions = {
  init: () => void
  setSettings: (setting: SettingData) => void
}

const initialState: State = { members: {}, memberIdMap: {} }

export const useSettingStore = create<State & Actions>()(
  devtools(
    (set) => ({
      ...initialState,
      init: async (): Promise<void> => {
        const result = (await window.api.getSettings()) as IPCResponse<SettingData>
        if (result.error) {
          return
        }
        set({ setting: result.data })
      },
      setSettings: (setting: SettingData): void => {
        const members = (setting.members ?? []).reduce(
          (prev, curr) => {
            prev[curr.name] = curr
            return prev
          },
          {} as Record<string, Member>
        )
        const memberIdMap = (setting.members ?? []).reduce(
          (prev, curr) => {
            curr.ids.forEach((id) => {
              prev[id] = curr
            })
            return prev
          },
          {} as Record<number, Member>
        )

        set({ setting, members, memberIdMap })
      }
    }),
    { store: 'useSettingStore' }
  )
)
