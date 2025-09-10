import React from "react";
import DocumentsChart from "../components/Chart";

function Home() {
  return (
    <div>
      <h2>Documents par catégorie</h2>
      <DocumentsChart type="category" />

      <h2>Documents par utilisateur</h2>
      <DocumentsChart type="user" />

      <h2>Documents par date</h2>
      <DocumentsChart type="date" />
    </div>
  );
}

export default Home;
