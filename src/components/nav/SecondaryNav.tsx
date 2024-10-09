import { ProfileNav } from "./ProfileNav";

export default function SecondaryNav() {
  return (
    <div className="flex flex-col">
      <section className="bg-bgsecondary flex flex-col w-[310px] items-center justify-center text-primary h-full">
        Secondary Nav
      </section>
      <ProfileNav />
    </div>
  );
}
