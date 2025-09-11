import React from "react";
import DocumentsChart from "../components/Chart";

function Home() {
  return (
    <div className="space-y-8 p-4">
      <div>
        <h2 className="text-2xl text-center mb-2 ">Documents par catégorie</h2>
        <DocumentsChart type="category" />
      </div>

      <div>
        <h2 className="text-2xl text-center mb-2 ">
          Documents par utilisateur
        </h2>
        <DocumentsChart type="user" />
      </div>

      <div>
        <h2 className="text-2xl text-center mb-2 ">Documents par date</h2>
        <DocumentsChart type="date" />
      </div>
    </div>
  );
}

export default Home;
