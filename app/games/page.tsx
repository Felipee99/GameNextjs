import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import SideBar from "@/components/SideBar";
import GamesInfo from "@/components/GamesInfo";
import { deleteGame } from "@/app/actions/gameActions";


export default async function GamesPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <SideBar currentPath="/games">
      <GamesInfo searchParams={searchParams} />
    </SideBar>
  );
}
