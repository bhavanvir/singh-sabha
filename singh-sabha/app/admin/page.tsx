import { validateRequest } from "@/lib/auth";
import LoginForm from "@/components/login";
import { Dashboard } from "@/components/dashboard";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return <LoginForm />;
  }
  return (
    <>
      <Dashboard user={user} />
    </>
  );
}
