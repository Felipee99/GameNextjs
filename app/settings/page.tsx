import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import SideBar from "@/components/SideBar";
import SettingsInfo from "@/components/SettingsInfo";

export default async function SettingsPage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <SideBar currentPath="/settings">
      <SettingsInfo />
    </SideBar>
  );
}