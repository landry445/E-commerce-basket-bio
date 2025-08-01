"use client";
import { ReactNode } from "react";
import SidebarAdmin from "@/app/components/adminLayout/SidebarAdmin";
import AdminActionsBar from "@/app/components/adminLayout/AdminActionsBar";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-light">
      <SidebarAdmin userName="Adri" />
      <div className="flex-1 flex flex-col">
        <AdminActionsBar />
        <main className="flex-1 px-12 py-8 flex flex-col">{children}</main>
      </div>
    </div>
  );
}
