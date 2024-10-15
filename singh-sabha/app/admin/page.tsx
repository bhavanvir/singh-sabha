import { validateRequest } from "@/lib/auth";
import LoginForm from "@/components/login";
import { AdminPanel } from "@/components/admin-panel";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return <LoginForm />;
  }
  return (
    <>
      <AdminPanel user={user} />
    </>
  );
}
