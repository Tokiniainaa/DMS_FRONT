import { useEffect, useState } from "react";
import api from "../api";
import Document from "../components/Document";
import UploadDoc from "../components/UploadDocument";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    owner: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const [owners, setOwners] = useState([]);
  const [categories, setCategories] = useState([]);

  // 🔹 Charger les propriétaires
  const fetchOwners = async () => {
    try {
      const res = await api.get("api/users/owners_list/");
      const uniqueOwners = [...new Set(res.data.map((u) => u.username))];
      setOwners(uniqueOwners);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Charger les catégories
  const fetchCategory = async () => {
    try {
      const res = await api.get("/api/categories/");
      const uniqueCategories = [...new Set(res.data.map((u) => u.name))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Charger les documents
  const fetchDocuments = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filters.category) params.append("category__name", filters.category);
      if (filters.owner) params.append("owner__username", filters.owner);
      if (filters.startDate)
        params.append("uploaded_at__gte", filters.startDate);
      if (filters.endDate) params.append("uploaded_at__lte", filters.endDate);

      const res = await api.get(`/api/documents/?${params.toString()}`);
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Impossible de récupérer les documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
    fetchCategory();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [search, filters]);

  // 🔹 Supprimer un document
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce document ?")) return;

    try {
      await api.delete(`/api/documents/${id}/`);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      setMessage("✅ Document supprimé !");
    } catch (err) {
      console.error(err);
      setMessage("❌ Impossible de supprimer le document");
    }
  };

  // 🔹 Quand un doc est ajouté avec succès
  const handleUploadSuccess = (newDoc) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setMessage("✅ Document ajouté !");
    document.getElementById("my_modal_1").close();
  };

  // 🔹 Partager un document
  const handleShare = async (docId, shareData) => {
    try {
      await api.post("/api/permissions/", {
        document: docId,
        user: shareData.user,
        permission: shareData.permission,
      });
      setMessage("✅ Document partagé !");
    } catch (err) {
      console.error(err);
      setMessage("❌ Impossible de partager le document");
    }
  };

  if (loading) return <p>Chargement des documents...</p>;

  return (
    <div className="space-y-4 relative">
      {/* 🔍 Filtres */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <input
            type="text"
            placeholder="Rechercher par Titre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-info"
          />
        </div>

        <div>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="select select-info"
          >
            <option value="">Tous les Catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filters.owner || ""}
            onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
            className="select select-info"
          >
            <option value="">Tous les propriétaires</option>
            {owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
        </div>

        {/* Date de début */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Du :</label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
        </div>

        {/* Date de fin */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Au :</label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
        </div>
      </div>

      {/* ➕ Bouton upload flottant */}
      <button
        className="btn fixed bottom-6 right-6 btn-soft btn-success"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        Ajouter un document
      </button>

      {/* 📂 Modale upload */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <UploadDoc onUploadSuccess={handleUploadSuccess} />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline">Annuler</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* ℹ️ Message */}
      {message && <p className="text-blue-600">{message}</p>}

      {/* 📑 Tableau des documents */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Titre</th>
              <th className="px-4 py-2 text-left">Catégorie</th>
              <th className="px-4 py-2 text-left">Owner</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Aucun document trouvé.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <Document
                  key={doc.id}
                  document={doc}
                  onDelete={handleDelete}
                  onShare={handleShare}
                  owners={owners} // 👈 pour afficher le select user
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
