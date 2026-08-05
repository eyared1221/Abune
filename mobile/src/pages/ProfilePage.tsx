import { SimpleChildPage } from "../components/common/SimpleChildPage";
export function ProfilePage({ email }: { email?: string }) { return <SimpleChildPage description={`${email || "Your account"} · Your profile is securely managed by Abune.`} title="My Profile" />; }
