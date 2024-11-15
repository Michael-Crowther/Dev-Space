export default async function Page({
  params,
}: {
  params: Promise<{ dmId: string }>;
}) {
  const dm = (await params).dmId;
  return <div>DM: {dm}</div>;
}
