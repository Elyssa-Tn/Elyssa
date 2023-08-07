function InfoPanel({ electionInfo }) {
  console.log(electionInfo);
  return (
    <div>
      <h2>{electionInfo.nom}</h2>
      <span>
        {electionInfo.debut} - {electionInfo.fin}
      </span>
    </div>
  );
}

export default InfoPanel;
