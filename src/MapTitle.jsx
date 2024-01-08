import { Box, Typography } from "@mui/joy";

function MapTitle({ electionInfo, parti, indicator }) {
  return (
    <Box sx={{ display: "inline-block", width: "50%" }}>
      <Typography
        style={{
          padding: "0.5rem 0.5rem 0.5rem  2.5rem ",
          marginTop: "0.5rem",
        }}
        level="h2"
      >
        {parti ? parti.denomination_fr : indicator.nom_indicateur}
      </Typography>
      <Typography
        style={{
          padding: "0.5rem 0.5rem 0.5rem  2.5rem ",
          marginTop: "0.5rem",
        }}
        level="title-lg"
      >
        {/* {electionInfo.nom} */}
        Nom D'election
      </Typography>
    </Box>
  );
}

export default MapTitle;
