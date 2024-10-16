import { validateRequest } from "@/lib/auth";
import LoginForm from "@/components/login";
import { AdminPanel } from "@/components/admin-panel";
import { GetAllEvents } from "@/lib/api/events/queries";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return <LoginForm />;
  }

  const events = await GetAllEvents();
  return (
    <>
      <AdminPanel user={user} events={events} />
    </>
  );
}
