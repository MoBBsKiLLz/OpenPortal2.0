import { getUserWithRole } from "../../../../lib/getUserWithRole";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const user = await getUserWithRole();

  return <SettingsClient user={user} />;
}
