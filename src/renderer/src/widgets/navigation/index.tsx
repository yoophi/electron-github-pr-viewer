import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/shared/ui/navigation-menu'

import { cn } from '@/shared/lib/utils'

import { Link } from 'react-router-dom'

export function Navigation(): JSX.Element {
  return (
    <div className="z-50 flex flex-row justify-between px-4 py-2">
      <div className="flex-initial ">
        <div className="flex justify-start">
          <NavigationMenu className="flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenu className={cn(navigationMenuTriggerStyle(), 'text-xl font-bold')}>
                    <span>GITHUB PR</span>
                    <span className="ml-2 text-sm text-gray-500">0.1.0</span>
                  </NavigationMenu>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/pull-requests">
                  <NavigationMenu className={cn(navigationMenuTriggerStyle(), 'text-xl')}>
                    <span>Pull Requests</span>
                  </NavigationMenu>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/repositories">
                  <NavigationMenu className={cn(navigationMenuTriggerStyle(), 'text-xl')}>
                    <span>Repositories</span>
                  </NavigationMenu>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/members">
                  <NavigationMenu className={cn(navigationMenuTriggerStyle(), 'text-xl')}>
                    <span>Members</span>
                  </NavigationMenu>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <div className="flex-initial ">
        <NavigationMenu className="flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/settings">
                <NavigationMenu className={cn(navigationMenuTriggerStyle(), 'text-lg')}>
                  <span>설정</span>
                </NavigationMenu>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}
