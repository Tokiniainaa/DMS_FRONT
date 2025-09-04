import { useEffect, useState } from "react";
import api from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer",
    is_staff: false,
    is_superuser: false,
    is_active: true,
  });
  const [editUser, setEditUser] = useState(null);

  // Recherche et filtres
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    is_staff: "",
    is_active: "",
  });

  // Récupération des utilisateurs
  useEffect(() => {
    fetchUsers();
  }, [search, filters]);

  const fetchUsers = async () => {
    try {
      let query = "?";
      if (search) query += `search=${search}&`;
      if (filters.role) query += `role=${filters.role}&`;
      if (filters.is_staff) query += `is_staff=${filters.is_staff}&`;
      if (filters.is_active) query += `is_active=${filters.is_active}&`;

      const res = await api.get(`/api/users/${query}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Vous n'êtes pas autorisé à voir cette page.");
    }
  };

  // Création
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/users/", formData);
      setUsers([res.data, ...users]);
      setMessage("✅ Utilisateur créé !");
      document.getElementById("user_modal").close();
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "",
        is_staff: false,
        is_superuser: false,
        is_active: true,
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Impossible de créer l'utilisateur");
    }
  };

  // Suppression
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?"))
      return;
    try {
      await api.delete(`/api/users/${id}/`);
      setUsers(users.filter((u) => u.id !== id));
      setMessage("✅ Utilisateur supprimé !");
    } catch (err) {
      console.error(err);
      setMessage("❌ Impossible de supprimer l'utilisateur");
    }
  };

  // Édition
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/users/${editUser.id}/`, editUser);
      setEditUser(null);
      fetchUsers();
      setMessage("✅ Utilisateur mis à jour !");
    } catch (err) {
      console.error(err);
      setMessage("❌ Impossible de mettre à jour l'utilisateur");
    }
  };

  // Changement input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (editUser) {
      setEditUser((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* Barre de recherche et filtres */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <input
            type="text"
            placeholder="Rechercher par username ou email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-info"
          />
        </div>

        <div>
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="select select-info"
          >
            <option value="">Tous les rôles</option>
            <option value="manager">Manager</option>
            <option value="employee">Employé</option>
            <option value="viewer">Lecteur</option>
          </select>
        </div>

        <div>
          <select
            value={filters.is_staff}
            onChange={(e) =>
              setFilters({ ...filters, is_staff: e.target.value })
            }
            defaultValue={"Staff / Non"}
            className="select select-info"
          >
            <option disabled={true} value="">
              Staff / Non
            </option>
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </div>

        <div>
          <select
            value={filters.is_active}
            onChange={(e) =>
              setFilters({ ...filters, is_active: e.target.value })
            }
            className="select select-info"
          >
            <option disabled={true} value="">
              Actif / Non
            </option>
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </div>
      </div>

      {/* Bouton création */}
      <button
        className="btn btn-soft btn-success fixed bottom-6 right-6"
        onClick={() => document.getElementById("user_modal").showModal()}
      >
        Ajouter un utilisateur
      </button>

      {/* Modal création */}
      <dialog id="user_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            Créer un nouvel utilisateur
          </h3>
          <form onSubmit={handleCreateUser} className="space-y-2">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="input input-bordered w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="input input-bordered w-full"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="input input-bordered w-full"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employé</option>
              <option value="viewer">Lecteur</option>
            </select>
            <div className="flex gap-4">
              <label>
                <input
                  type="checkbox"
                  name="is_staff"
                  checked={formData.is_staff}
                  onChange={handleInputChange}
                />{" "}
                Staff
              </label>
              <label>
                <input
                  type="checkbox"
                  name="is_superuser"
                  checked={formData.is_superuser}
                  onChange={handleInputChange}
                />{" "}
                Admin
              </label>
              <label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />{" "}
                Actif
              </label>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Créer
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => document.getElementById("user_modal").close()}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Modal édition */}
      {editUser && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="p-6 rounded border border-gray-300 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4">Modifier l'utilisateur</h3>
            <form onSubmit={handleEditSubmit} className="space-y-2">
              <input
                type="text"
                name="username"
                value={editUser.username}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
              <input
                type="email"
                name="email"
                value={editUser.email}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
              <div className="flex gap-4">
                <label>
                  <input
                    type="checkbox"
                    name="is_staff"
                    checked={editUser.is_staff}
                    onChange={handleInputChange}
                  />{" "}
                  Staff
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="is_superuser"
                    checked={editUser.is_superuser}
                    onChange={handleInputChange}
                  />{" "}
                  Admin
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={editUser.is_active}
                    onChange={handleInputChange}
                  />{" "}
                  Actif
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditUser(null)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message */}
      {message && <p className="text-blue-600">{message}</p>}

      {/* Tableau */}
      {users.length === 0 ? (
        <p>Aucun utilisateur trouvé.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th className="px-4 py-2">Id</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Staff</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2">Admin</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.is_staff ? "Oui" : "Non"}</td>
                <td className="px-4 py-2">{user.is_active ? "Oui" : "Non"}</td>
                <td className="px-4 py-2">
                  {user.is_superuser ? "Oui" : "Non"}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="btn btn-warning btn-soft"
                    onClick={() => setEditUser(user)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-error btn-soft"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
