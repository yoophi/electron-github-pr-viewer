import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { SettingData } from '../model/setting'
import { RecordType } from 'zod'
import { IPCResponse } from '@/shared/model'
type Member = {
  name: string
  ids: number[]
  groups: string[]
}

type State = {
  setting?: SettingData
  members: RecordType<string, Member>
  memberIdMap: RecordType<number, Member>
  // memberMap
  // groups
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
        // const idMember = [
        //   ...setting.members.map((member) => {
        //     const { name, groups, ids } = member
        //     return ids.map((id) => {
        //       return {
        //         id,
        //         name,
        //         groups
        //       }
        //     })
        //   })
        // ]

        const members = (setting.members ?? []).reduce((prev, curr) => {
          prev[curr.name] = curr
          return prev
        }, {})
        const memberIdMap = (setting.members ?? []).reduce((prev, curr) => {
          curr.ids.forEach((id) => {
            prev[id] = curr
          })
          return prev
        }, {})
        // console.log(JSON.stringify(idMember.flat(), null, 2))
        // const xx = idMember.reduce((prev, curr) => {
        //   return {
        //     ...prev,
        //     [curr.id]: curr
        //   }
        // }, {})

        set({ setting, members, memberIdMap })
      }
    }),
    { store: 'useSettingStore' }
  )
)
