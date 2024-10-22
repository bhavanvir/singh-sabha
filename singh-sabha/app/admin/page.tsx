import { validateRequest } from "@/lib/auth";
import LoginForm from "@/components/login";
import { Dashboard } from "@/components/dashboard";
import { GetAllEvents } from "@/lib/api/events/queries";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return <LoginForm />;
  }

  const events = await GetAllEvents();
  return (
    <>
      <Dashboard user={user} events={events} />
    </>
  );
}
