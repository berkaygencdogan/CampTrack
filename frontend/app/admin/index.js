import { useState } from "react";
import AdminUsers from "./AdminUsers";
import AdminReports from "./AdminReports";
import AdminPlaces from "./AdminPlaces";
import AdminContainer from "./AdminContainer";
import Dashboard from "./Dashboard";

export default function AdminPanel() {
  const [active, setActive] = useState("users");

  return (
    <AdminContainer active={active} setActive={setActive}>
      {active === "dashboard" && <Dashboard />}
      {active === "users" && <AdminUsers />}
      {active === "reports" && <AdminReports />}
      {active === "places" && <AdminPlaces />}
    </AdminContainer>
  );
}
