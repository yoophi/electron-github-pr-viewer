import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { SettingData, Member } from '../model/setting'
import { IPCResponse } from '@/shared/model'

type State = {
  setting?: SettingData
  members: Record<string, Member>
  memberIdMap: Record<number, Member>
  initialized: boolean
  error?: string
}

type Actions = {
  init: () => Promise<void>
  setSettings: (setting: SettingData) => void
}

function buildMemberMaps(setting: SettingData) {
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
  return { members, memberIdMap }
}

const initialState: State = { members: {}, memberIdMap: {}, initialized: false }

export const useSettingStore = create<State & Actions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      init: async (): Promise<void> => {
        if (get().initialized) return
        const result = (await window.api.getSettings()) as IPCResponse<SettingData>
        if (result.error) {
          set({ initialized: true, error: result.message })
          return
        }
        const setting = result.data
        set({ setting, ...buildMemberMaps(setting), initialized: true, error: undefined })
      },
      setSettings: (setting: SettingData): void => {
        set({ setting, ...buildMemberMaps(setting), error: undefined })
      }
    }),
    { store: 'useSettingStore' }
  )
)
