import { useSettingStore, type Setting } from '@/entities/settings'
import { SettingsForm } from '@/features/settings-form'
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert'
import { AlertCircle } from 'lucide-react'

export const SettingsPage = () => {
  const { setting, error } = useSettingStore((state) => state)

  const formValues: Setting | undefined = setting
    ? {
        accessToken: setting.accessToken,
        org: setting.org || 'payhereinc',
        repositories: setting.repositories.join('\n'),
        members: setting.members ?? []
      }
    : undefined

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Settings</h1>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {formValues && <SettingsForm defaultValues={formValues} />}
    </div>
  )
}
