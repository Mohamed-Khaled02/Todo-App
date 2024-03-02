import { useSession, signIn, signOut } from "next-auth/react";

export default async function Home() {
  const { data: sessioData } = useSession();
  return <div></div>;
}
