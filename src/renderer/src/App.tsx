import { Root } from '@/app/router'
import { Toaster } from '@/shared/ui/toaster'
import { QueryClientProvider } from '@/app/providers/query-client-provider'
import { useSettingStore } from '@/entities/settings/api/useSettingStore'
import { useEffect } from 'react'

function App(): JSX.Element {
  const { init } = useSettingStore((state) => state)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    ;(async () => {
      await init()
    })()
  }, [])

  return (
    <>
      <QueryClientProvider>
        <Root />
        <Toaster />
      </QueryClientProvider>
    </>
  )
}

export default App
