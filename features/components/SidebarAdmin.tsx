/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  LogOut,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuthStore } from "@/packages/features/stores/useAuthStore";
import { useShallow } from "zustand/shallow";
import { useRouter } from 'next/navigation'
import { useProfileStore } from "@/packages/features/stores/useProfileStore";
import { useEffect, useState } from "react";
import EditProfileAdminDialog from "./EditProfileAdminDialog";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/admin/manage-projects",
    icon: FolderKanban,
  },
  {
    title: "Users",
    href: "/admin/manage-users",
    icon: Users,
  }
];

export default function SidebarAdmin() {
  const router = useRouter()
  const { logout } = useAuthStore(useShallow((state) => ({
    logout: state.logout
  })))
  const { profile, getProfile } = useProfileStore(useShallow((state) => ({
    profile: state.profile,
    getProfile: state.getProfile
  })))
  const pathname = usePathname();
  const [openProfile, setOpenProfile] = useState(false);

  const handleLogout = async () => {
    try {
      const response: any = await logout();
      if(response?.success) {
        toast.success('Logout successfully');
      } else {
        toast.error(response?.message || 'Failed to logout')
      }
    } catch (error) {
      toast.error('An error occurred while logout system');
      console.log(error);
    } finally {
      router.push('/');
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  return (
    <>
      <EditProfileAdminDialog 
        open={openProfile}
        onOpenChange={setOpenProfile}
      />
      <aside className="flex h-screen w-64 flex-col border-r bg-background">
        <div className="flex h-16 items-center px-6 text-xl font-bold">
          Bug Tracking 🐞
        </div>
        <Separator />
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-start gap-3 px-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar?.path} />
                  <AvatarFallback>
                    {profile?.userName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">{profile?.userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {profile?.email}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="w-56"
            >
              <DropdownMenuItem onClick={() => setOpenProfile(true)}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-500 cursor-pointer"
                onClick={() => handleLogout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                  Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}
