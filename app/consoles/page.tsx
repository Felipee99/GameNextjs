import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import SideBar from "@/components/SideBar";
import ConsolesInfo from "@/components/ConsolesInfo";

export default async function ConsolasPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const user = await stackServerApp.getUser();

  // 🔐 PROTECCIÓN (igual que games)
  if (!user) {
    redirect("/");
  }

  return (
    <SideBar currentPath="/consoles">
      <ConsolesInfo searchParams={searchParams} />
    </SideBar>
  );
}