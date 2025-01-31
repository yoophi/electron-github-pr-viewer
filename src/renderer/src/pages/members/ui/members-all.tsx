import { SettingData } from '@/entities/settings'
import { IPCResponse } from '@/shared/model'
import { useEffect, useState } from 'react'

export const MembersAllPage = () => {
  const [settings, setSettings] = useState<SettingData | null>()
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    ;(async () => {
      const result = (await window.api.getSettings()) as IPCResponse<SettingData>
      if (result.error) {
        setErrorMessage(result.message)
      }

      console.log(JSON.stringify(result.data, null, 2))

      setSettings(result.data)

      const idMap = result.data.members.map((member) => {
        const { name, ids } = member
        return ids.map((id) => {
          return {
            id,
            name
          }
        })
      })

      console.log(idMap.flat())
      const x = idMap.flat().reduce((prev, curr) => {
        return { ...prev, [curr.id]: curr }
      }, {})
      console.log({ x })
    })()
  }, [])
  return (
    <>
      <div>MembersPage</div>
      {errorMessage && <pre>ERROR: {errorMessage}</pre>}
      <pre>{settings && JSON.stringify(settings.members, null, 2)}</pre>
    </>
  )
}
