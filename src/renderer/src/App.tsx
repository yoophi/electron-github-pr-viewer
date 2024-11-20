import { Root } from '@/app/router'
import { Toaster } from '@/shared/ui/toaster'

function App(): JSX.Element {
  return (
    <>
      <Root />
      <Toaster />
    </>
  )
}

// <>
//   <h1 className="text-3xl font-bold underline">Hello, world!</h1>
//   <Button>sample button</Button>
// </>

export default App
