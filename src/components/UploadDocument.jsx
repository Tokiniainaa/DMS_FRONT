// UploadDocument.jsx
import { useState, useEffect } from "react";
import api from "../api";

export default function UploadDocument({ onUploadSuccess }) {
  const [titre, setTitre] = useState("");
  const [fichier, setFichier] = useState(null);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fichier) {
      setMessage("❌ Veuillez sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("title", titre);
    formData.append("file", fichier);
    formData.append("category", category);

    try {
      const res = await api.post("api/documents/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
        },
      });

      setMessage("✅ Document uploadé avec succès !");
      setTitre("");
      setFichier(null);
      setCategory("");

      //  Appelle la fonction du parent en envoyant le nouveau doc
      if (onUploadSuccess) {
        onUploadSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        setMessage(
          `❌ Erreur ${err.response.status} : ${
            err.response.data.detail || "Problème lors de l'upload"
          }`
        );
      } else {
        setMessage("❌ Erreur réseau ou serveur indisponible.");
      }
    }
  };
  const fetchCategory = async () => {
    try {
      const res = await api.get("/api/categories/");
      setCategories(res.data); // garde id + name + description
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className="p-6 bg-zinc-950 shadow-lg rounded-xl max-w-lg mx-auto mt-8 border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        Uploader un document
      </h1>

      {message && (
        <p className="mb-4 text-center text-blue-600 font-medium">{message}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 flex flex-col justify-center"
      >
        <input
          type="text"
          placeholder="Titre du document"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          className=" input mx-auto w-100 "
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select w-100 mx-auto"
          required
        >
          <option value="" disabled>
            Choisir une catégorie
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          onChange={(e) => setFichier(e.target.files[0])}
          className=" input text-center p-2 cursor-pointer mx-auto w-100"
          required
        />

        <button type="submit" className="btn btn-dash btn-info w-30 mx-auto">
          Upload
        </button>
      </form>
    </div>
  );
}
