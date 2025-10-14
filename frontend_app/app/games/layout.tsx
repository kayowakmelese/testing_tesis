import { getUserDetail, verifyUser } from "@/server_actions/auth.actions";
import InitAuthUser from "./_components/InitAuthUser";
import ErrorDisplay from "@/components/custom/ErrorDisplay";
import Header from "@/components/custom/Header";
import { RootSocketProvider } from "@/contexts/RootSocketProvider";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/constants";
import { GameInviteSocketProvider } from "@/contexts/GameInviteSocketProvider";

export default async function GamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const res = await verifyUser()

  if (!res.success) {
    return <ErrorDisplay message={res.error} />
  }

  const cookie = await cookies()

  const accessToken = cookie.get(COOKIE_NAMES.ACCESS_TOKEN)?.value

  if (!accessToken) {
    return <ErrorDisplay message={'Access token not provided.'} />
  }

  const userDetailRes = await getUserDetail(res.data.id)

  if(!userDetailRes.success) {
    return <ErrorDisplay  message={userDetailRes.error}/>
  }

  const userDetail = userDetailRes.data

  return (
    <>
      <InitAuthUser user={res.data} accessToken={accessToken}  userDetail={userDetail}/>
      <RootSocketProvider userId={res.data.id} accessToken={accessToken} >
        <GameInviteSocketProvider accessToken={accessToken}>
          {/* {accessToken} */}
          <Header />
          {children}
        </GameInviteSocketProvider>
      </RootSocketProvider>
    </>
  );
}