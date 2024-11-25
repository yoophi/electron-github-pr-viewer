import { Root } from '@/app/router'
import { Toaster } from '@/shared/ui/toaster'
import { QueryClientProvider } from '@/app/providers/query-client-provider'

function App(): JSX.Element {
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
