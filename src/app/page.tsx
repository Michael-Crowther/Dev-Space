import PrimaryNav from "@/components/nav/PrimaryNav";
import SecondaryNav from "@/components/nav/SecondaryNav";

export default async function Home() {
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
