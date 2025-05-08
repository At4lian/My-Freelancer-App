"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Skeleton } from "./ui/skeleton"
import { LogoutButton } from "./auth/logout-button"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useEffect, useMemo, useState } from "react"

export function NavUser() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userLoaded, setUserLoaded] = useState(false); 


  const { isMobile } = useSidebar()

  const currentUser = useCurrentUser()

  const user = useMemo(() => ({
    name: currentUser?.name ?? "", 
    email: currentUser?.email ?? "", 
    avatar: currentUser?.image ?? "",
  }), [currentUser]);

  useEffect(() => {
    if (user) {
      setUserLoaded(true);  // Mark user as loaded
    }
  }, [user]);

 
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <Skeleton className="h-8 w-8 rounded-lg" />
                )}

                </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name ? user.name : <Skeleton className="h-4 w-24 mb-1"/>}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email ? user.email : <Skeleton className="h-4 w-32"/>}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name ? user.name : <Skeleton className="h-4 w-24 mb-1"/>}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email ? user.email : <Skeleton className="h-4 w-32"/>}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <LogoutButton>
              <DropdownMenuItem>
                <IconLogout />
                Log out
              </DropdownMenuItem>
            </LogoutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
