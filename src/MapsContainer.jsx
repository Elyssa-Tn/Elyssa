import { useSelector } from "react-redux";
import MapCard from "./MapCard/MapCard";
import { Box, Sheet, Typography } from "@mui/joy";

function MapsContainer({ geojson, bounds, autocompleteOptions, ID }) {
  const map = useSelector((state) => state.maps[ID]);
  return (
    <Sheet>
      {map.type === "comparaison" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "5.5rem",
            padding: "0.25rem",
          }}
        >
          <Typography level="h3">
            {`${map.parti[0].denomination_fr} ${map.election[0].nom.slice(
              -4
            )} - ${map.parti[1].denomination_fr} ${map.election[1].nom.slice(
              -4
            )}`}
          </Typography>
          <Typography level="h3">
            {map.election ? map.election.nom : null}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{ display: "flex", flexDirection: "column", padding: "0.25rem" }}
        >
          <Typography level="h1">
            {map.parti
              ? `${map.parti.denomination_fr} - ${map.parti.code_parti}`
              : null}
          </Typography>
          <Typography level="h3">
            {map.election ? map.election.nom : null}
          </Typography>
        </Box>
      )}
      <MapCard
        // map={map[1]}
        // electionInfo={map[1]["election"]}
        geojson={geojson}
        bounds={bounds}
        autocompleteOptions={autocompleteOptions}
        ID={ID}
      />
    </Sheet>
  );
}

export default MapsContainer;
