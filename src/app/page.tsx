import PrimaryNav from "@/components/nav/PrimaryNav";
import SecondaryNav from "@/components/nav/SecondaryNav";
import { validateRequest } from "@/server/auth/validation";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <PrimaryNav />
      <SecondaryNav />
      <div className="w-screen bg-page flex items-center justify-center text-primary">
        Direct messages page
      </div>
    </>
  );
}
