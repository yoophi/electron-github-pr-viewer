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

      setSettings(result.data)
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
