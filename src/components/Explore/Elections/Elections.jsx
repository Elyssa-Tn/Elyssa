import { useState } from "react";
import data from "../../../assets/data.json";
import "./Elections.css";

function Elections() {
  const [selectedYears, setSelectedYears] = useState({});

  const events = data;
  const electionTypes = {};

  //TODO: improve data sorting

  events.map((event) => {
    event.elections.map((election) => {
      if (!electionTypes[election.type]) {
        electionTypes[election.type] = new Set();
      }
      electionTypes[election.type].add({
        year: event.date,
        completion: election.completude,
      });
    });
  });

  const handleYearChange = (electionType, year, checked) => {
    setSelectedYears((prevSelectedYears) => ({
      ...prevSelectedYears,
      [electionType]: checked
        ? [...(prevSelectedYears[electionType] || []), year]
        : prevSelectedYears[electionType].filter(
            (selectedYear) => selectedYear !== year
          ),
    }));
  };

  return (
    <>
      <h2>Explorer les Données par Election</h2>
      <div className="election-container">
        <div className="selection-container">
          {Object.keys(electionTypes).map((electionType) => (
            <div key={electionType}>
              <h4>{electionType}</h4>
              {[...electionTypes[electionType]].map((year) => (
                <div key={year.year} className="year-selection">
                  <label>
                    <input
                      type="checkbox"
                      value={year.year}
                      checked={(selectedYears[electionType] || []).includes(
                        year.year
                      )}
                      onChange={(event) =>
                        handleYearChange(
                          electionType,
                          year.year,
                          event.target.checked
                        )
                      }
                    />
                    {year.year}
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        style={{ width: `${year.completion}%` }}
                      ></div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="right-container">
          <div className="buttons-container">
            <button>Afficher</button>
            <ul className="export-bar">
              <li className="export-item dropdown">
                <button className="export-item">Exporter</button>
                <div className="export-dropdown-content">
                  <button className="export-link">XML</button>
                  <button className="export-link">CSV</button>
                  <button className="export-link">TXT</button>
                </div>
              </li>
            </ul>
          </div>
          <div className="paragraph-container">
            <p>
              **** Les barres vertes representent le taux de completude des
              données ****
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              facilisis mauris vel sapien consequat faucibus. Curabitur vel
              neque vitae urna convallis tincidunt eu ut elit. Donec id ligula
              sit amet ligula tempor vestibulum at ac nunc. Etiam a faucibus
              leo, vitae aliquam velit. Pellentesque aliquam hendrerit dolor,
              non lobortis massa eleifend nec. Sed pretium pharetra efficitur.
              Sed sit amet mi ac metus tincidunt hendrerit non a elit. Vivamus
              sed malesuada est. Nullam lobortis posuere velit, a rhoncus nisi
              fringilla sed. Aenean a est eu sem hendrerit tempor ut non ligula.
              Suspendisse potenti.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Elections;
