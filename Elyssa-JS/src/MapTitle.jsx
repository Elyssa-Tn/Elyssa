import { Box, Typography } from "@mui/joy";

function MapTitle({ electionInfo, parti, indicator }) {
  return (
    <Box sx={{ display: "inline-block", width: "50%" }}>
      <Typography
        style={{
          display: "inline-block",
          maxWidth: "100%",
          padding: "0.5rem 0.5rem 0.5rem  2.5rem ",
          marginTop: "0.5rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        level="h2"
      >
        {parti
          ? parti.denomination_fr
          : indicator
          ? indicator.nom_indicateur
          : null}
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
