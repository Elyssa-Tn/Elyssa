import { Box, Typography } from "@mui/joy";

function MapTitle({ electionInfo, parti }) {
  return (
    <Box style={{ display: "inline-block" }}>
      <Typography style={{ padding: "0.5rem", marginTop: "0.5rem" }}>
        {electionInfo.nom}
        {parti ? ` - ${parti.denomination_fr}` : null}
        {/* {electionInfo.variable ? `- ${electionInfo.variable.nom}` : null} */}
      </Typography>
    </Box>
  );
}

export default MapTitle;
