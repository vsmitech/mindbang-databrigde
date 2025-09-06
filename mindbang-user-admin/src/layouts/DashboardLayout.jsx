import { Outlet,NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SidebarMenu from "../components/nav/SidebarMenu";
import Header from "../components/nav/Header";

export default function DashboardLayout() {
  const {user} = useAuth();

  return (
    <div className="flex">
      <Header/>
         <SidebarMenu />
         <main className="flex-1 p-6">
           <Outlet />
         </main>
       </div>
  );
}