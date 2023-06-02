import "./Themes.css";

function Theme() {
  const data = [
    "Participation",
    "Vote Islamiste",
    "Vote moderniste",
    "Listes independantes",
    "Vote des jeunes",
    "Votes des femmes",
    "vote rural",
    "Vote urbain",
  ];

  return (
    <>
      <h2>Explorer les Données par Theme</h2>
      <div className="election-container">
        <div className="themes-container">
          {data.map((dataType) => (
            <button key={dataType}>{dataType}</button>
          ))}
        </div>
        <div className="right-container">
          <div className="paragraph-container">
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

export default Theme;
