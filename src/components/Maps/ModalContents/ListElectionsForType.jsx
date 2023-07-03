import SelectionMenu from "./SelectionMenu";

const ListElectionsForType = ({
  elections,
  setSelectedElection,
  selectedType,
}) => {
  const filteredElections = elections.filter(
    (election) => election.type_election === selectedType
  );

  return filteredElections.length === 0 ? (
    <span>Pas d'elections disponibles pour ce type</span>
  ) : (
    <SelectionMenu
      placeholder="Choisissez une election"
      data={filteredElections}
      setSelection={setSelectedElection}
      selector={"code_election"}
      name={"nom"}
    />
  );
};

export default ListElectionsForType;
