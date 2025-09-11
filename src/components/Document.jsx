import { useState } from "react";

function getFileType(fileUrl) {
  if (!fileUrl) return null;
  const ext = fileUrl.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "other";
}

function Document({ document, onDelete, onShare, owners }) {
  const [showPreview, setShowPreview] = useState(false);
  const [showShareForm, setShowShareForm] = useState(false);
  const [shareData, setShareData] = useState({
    user: "",
    permission: "read",
  });

  if (!document) return null;

  const formattedDate = document.uploaded_at
    ? new Date(document.uploaded_at).toLocaleDateString("fr-FR")
    : "Date inconnue";

  const fileType = getFileType(document.file);

  // 🔹 Validation du partage
  const handleShare = (e) => {
    e.preventDefault();
    if (!shareData.user) return;
    onShare(document.id, shareData);
    setShowShareForm(false);
    setShareData({ user: "", permission: "read" });
  };

  return (
    <>
      <tr className=" cursor-pointer" onClick={() => setShowPreview(true)}>
        <td className="px-4 py-2 font-semibold">
          {document.title || "Titre inconnu"}
        </td>
        <td className="px-4 py-2">
          {document.category_name || "Catégorie inconnue"}
        </td>
        <td className="px-4 py-2">
          {document.owner_username || "Auteur inconnu"}
        </td>
        <td className="px-4 py-2">{formattedDate}</td>
        <td className="px-4 py-2 flex gap-2">
          {/* Bouton partager */}
          <button
            className="btn btn-soft btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              setShowShareForm(true);
            }}
          >
            Partager
          </button>

          {/* Bouton delete */}
          <button
            className="btn btn-soft btn-error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(document.id);
            }}
          >
            Supprimer
          </button>
        </td>
      </tr>

      {/* 🔹 Modale preview */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-gray-100 p-6 rounded-xl max-w-3xl w-100 shadow-lg relative">
            {/* Bouton de fermeture */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-xl font-bold transition-colors"
              onClick={() => setShowPreview(false)}
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {document.title || "Titre inconnu"}
            </h2>
            <p className="mb-1 text-gray-800 text-sm">
              Propriétaire: {document.owner_username || "Inconnu"}
            </p>
            <p className="mb-4 text-gray-800 text-sm">Date: {formattedDate}</p>

            {/* Contenu */}
            <div className="flex justify-center items-center h-10 w-30 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              {fileType === "image" && (
                <img
                  src={document.file}
                  alt={document.title}
                  className="max-w-full max-h-[70vh] rounded-lg object-contain"
                />
              )}
              {fileType === "pdf" && (
                <a
                  href={document.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-950 font-medium transition-colors"
                >
                  Open
                </a>
              )}
              {fileType === "other" && (
                <a
                  href={document.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-950 font-medium transition-colors"
                >
                  Download
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Modale partage */}
      {showShareForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-[400px] relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setShowShareForm(false)}
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold mb-4">Partager ce document</h2>
            <form onSubmit={handleShare} className="space-y-4">
              {/* Sélection d’utilisateur */}
              <select
                value={shareData.user}
                onChange={(e) =>
                  setShareData({ ...shareData, user: e.target.value })
                }
                className="select select-bordered w-full"
                required
              >
                <option value="">Sélectionner un utilisateur</option>
                {owners.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>

              {/* Type de permission */}
              <select
                value={shareData.permission}
                onChange={(e) =>
                  setShareData({ ...shareData, permission: e.target.value })
                }
                className="select select-bordered w-full"
              >
                <option value="read">Lecture</option>
                <option value="write">Écriture</option>
                <option value="delete">Suppression</option>
                <option value="download">Téléchargement</option>
              </select>

              <button type="submit" className="btn btn-success w-20 ">
                Partager
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Document;
