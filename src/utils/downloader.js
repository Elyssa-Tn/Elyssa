export const downloadCSV = (json) => {
  const election = json.map.election.nom;
  const parti = json.map.parti.denomination_fr;

  const csv = csvElectionDataFormatter(json);

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", `${election}-${parti}.csv`);
  a.click();

  window.URL.revokeObjectURL(url);
};

const csvElectionDataFormatter = ({ map, level }) => {
  const resultat = map.resultat[level];
  let csv = `Nom;Code_${level};Votes;Voix;Pourcentage\n`;
  for (const code in resultat) {
    if (code !== "") {
      const data = resultat[code];
      csv += `${data.nom_fr};${code};${data.votes};${data.voix};${data.prc}\n`;
    }
  }
  return csv;
};

export const downloadXLS = (json) => {
  const election = json.map.election.nom;
  const parti = json.map.parti.denomination_fr;

  const xls = xlsElectionDataFormatter(json);

  const blob = new Blob([xls], { type: "application/vnd.ms-excel" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", `${election}-${parti}.xls`);
  a.click();

  window.URL.revokeObjectURL(url);
};

const xlsElectionDataFormatter = ({ map, level }) => {
  const resultat = map.resultat[level];
  let xls = `Nom\tCode_${level}\tVotes\tVoix\tPourcentage\n`;
  for (const code in resultat) {
    if (code !== "") {
      const data = resultat[code];
      xls += `${data.nom_fr}\t${code}\t${data.votes}\t${data.voix}\t${data.prc}\n`;
    }
  }
  return xls;
};

export const downloadJPG = (json) => {
  console.log(json);
};
export const downloadPNG = (json) => {
  console.log(json);
};
