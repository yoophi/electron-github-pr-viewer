import { useEffect, useState } from 'react'
import { type Setting } from '@/entities/settings'
import { SettingsForm } from '@/features/settings-form'
import type { IPCResponse } from '@/shared/model'
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert'
import { AlertCircle } from 'lucide-react'

export const SettingsPage = () => {
  const [settings, setSettings] = useState<Setting | null>()
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    ;(async () => {
      const result = (await window.api.getSettings()) as IPCResponse<{
        accessToken: string
        org: string
        repositories: string[]
      }>
      if (result.error) {
        setErrorMessage(result.message)
      }

      setSettings({
        accessToken: result.data.accessToken,
        org: result.data.org || 'payhereinc',
        repositories: result.data.repositories.join('\n'),
        members: []
      })
    })()
  }, [])

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Settings</h1>
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      {settings && <SettingsForm defaultValues={settings} />}
    </div>
  )
}
