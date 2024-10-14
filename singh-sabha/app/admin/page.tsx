import { validateRequest } from "@/lib/auth";
import LoginForm from "@/components/login";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return <LoginForm />;
  }
  return (
    <>
      <h1>Hi, {user.fullname}!</h1>
    </>
  );
}
