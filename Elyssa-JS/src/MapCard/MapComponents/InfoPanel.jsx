function InfoPanel({ electionInfo }) {
  return (
    <div style={{ height: "480px" }}>
      <h2>{electionInfo.nom}</h2>
      <span>
        {electionInfo.debut} - {electionInfo.fin}
      </span>
    </div>
  );
}

export default InfoPanel;
