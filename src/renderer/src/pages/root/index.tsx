import { Navigation } from '@/widgets/navigation'
import { Outlet } from 'react-router-dom'

// export const Navigation = () => {
//   return <div>Navigation</div>
// }

export function RootPage() {
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
