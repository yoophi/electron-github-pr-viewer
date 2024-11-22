import { IPCResponse } from '@/shared/model'
import { Navigation } from '@/widgets/navigation'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { SettingData, useSettingStore } from '../settings/model'

export function RootPage() {
  const { setSettings } = useSettingStore((state) => state)

  useEffect(() => {
    ;(async () => {
      const result = (await window.api.getSettings()) as IPCResponse<SettingData>
      if (result.error) {
        console.error(result.error)
        return
      }

      setSettings(result.data)
    })()
  }, [])

  return (
    <div>
      <div className="sticky top-0 w-screen bg-white border-b-2 border-gray-200">
        <Navigation />
      </div>

      <div className="px-4 py-4">
        <Outlet />
      </div>
    </div>
  )
}
