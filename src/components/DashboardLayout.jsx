import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";

export default function DashboardLayout() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/users/me/");
      if (res.data && res.data.username) {
        setUser(res.data);
      } else {
        setUser({ username: "Invité" }); // fallback si res.data vide
      }
    } catch (err) {
      console.error("Erreur récupération utilisateur :", err);
      setUser({ username: "Invité" }); // fallback si erreur réseau ou 403/401
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Sidebar fixe */}
      <aside className="w-64 bg-base-100 shadow-lg fixed top-0 left-0 h-screen">
        <div className="flex items-center justify-start gap-4 p-4 text-xl font-bold">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              className="w-10 h-10 object-contain"
              src="./Logo-paositra-removebg-preview.png"
              alt="Logo"
            />
          </div>

          {/* Titre */}
          <h1 className="text-2xl">DMS</h1>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <Link to="/" className="btn btn-ghost justify-start">
            Home
          </Link>
          <Link to="/documents" className="btn btn-ghost justify-start">
            Documents
          </Link>
          <Link to="/users" className="btn btn-ghost justify-start">
            Users
          </Link>
          <Link to="/settings" className="btn btn-ghost justify-start">
            Settings
          </Link>
          <Link to="/logout" className="btn btn-ghost justify-start">
            Logout
          </Link>
        </nav>
      </aside>

      {/* Contenu principal avec marge à gauche */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header fixe */}
        <header className="navbar w-320 bg-base-100 shadow fixed top-0  right-0 z-50 flex justify-between items-center px-4">
          <div className="flex-1 px-4 font-semibold">Dashboard</div>
          <div className="font-medium text-red-100">
            Bienvenue, {user?.username || "Invité"}
          </div>
        </header>

        {/* Contenu principal avec padding pour ne pas être caché par le header */}
        <main className="p-6 pt-20 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
