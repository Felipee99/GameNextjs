import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import SideBar from "@/components/SideBar";
import DashboardInfo from "@/components/DashboardInfo";

export default async function DashboardPage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <SideBar currentPath="/dashboard">
      <DashboardInfo />
    </SideBar>
  );
}