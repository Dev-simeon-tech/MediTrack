"use client";

import * as React from "react";

import Logo from "@/assets/meditrack-logo.svg";
import { NavMain } from "@/components/nav-main";
// import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  Calendar,
  UsersRound,
  ShieldCheck,
} from "lucide-react";

const navigation = {
  DOCTOR: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Patients",
      url: "/patients",
      icon: <UsersRound />,
    },
    {
      title: "Appointments",
      url: "/appointments",
      icon: <Calendar />,
    },
  ],
  ADMIN: [
    {
      title: "Doctors",
      url: "/doctors",
      icon: <UsersRound />,
    },
    {
      title: "Audit Log",
      url: "/audit",
      icon: <ShieldCheck />,
    },
  ],
};

export function AppSidebar({
  role,
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  role: string;
  user: { name: string; email: string; avatar: string | null };
}) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <SidebarMenuButton
              className='data-[slot=sidebar-menu-button]:p-1.5!'
              render={<a href='/dashboard' />}
            ></SidebarMenuButton> */}
            <Logo />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={role === "ADMIN" ? navigation.ADMIN : navigation.DOCTOR}
        />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className='mt-auto' /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
