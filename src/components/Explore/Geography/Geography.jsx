import { useState } from "react";
import "./Geography.css";

function Geography() {
  const [selectedGeography, setSelectedGeography] = useState({});
  const events = [
    {
      type: "Decoupage Electoraux",
      decoupage: {
        "Circonscriptions Electorales": 50,
        "Centres de votes": 80,
        "Bureaux de votes": 90,
      },
    },
    {
      type: "Decoupage Administratifs",
      decoupage: {
        Gouvernorats: 75,
        Delegations: 60,
        Secteurs: 100,
      },
    },
  ];

  const handleGeographyChange = (electionType, decoupage, checked) => {
    setSelectedGeography((prevSelectedGeography) => ({
      ...prevSelectedGeography,
      [electionType]: checked
        ? [...(prevSelectedGeography[electionType] || []), decoupage]
        : prevSelectedGeography[electionType].filter(
            (selectedGeography) => selectedGeography !== decoupage
          ),
    }));
  };

  return (
    <>
      <h2>Explorer les Données par Niveau Geographique</h2>
      <div className="election-container">
        <div className="selection-container">
          {events.map((electionType) => (
            <div key={electionType.type}>
              <h4>{electionType.type}</h4>
              {Object.entries(electionType.decoupage).map(
                ([decoupage, completion]) => (
                  <div key={decoupage} className="geography-selection">
                    <label>
                      <input
                        type="checkbox"
                        value={decoupage}
                        checked={(
                          selectedGeography[electionType] || []
                        ).includes(decoupage)}
                        onChange={(event) =>
                          handleGeographyChange(
                            electionType,
                            decoupage,
                            event.target.checked
                          )
                        }
                      />
                      {decoupage}
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar"
                          style={{ width: `${completion}%` }}
                        ></div>
                      </div>
                    </label>
                  </div>
                )
              )}
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

export default Geography;
