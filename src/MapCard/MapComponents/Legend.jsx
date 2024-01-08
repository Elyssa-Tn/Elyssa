import { Box, Typography } from "@mui/joy";
import { useSelector } from "react-redux";

const Legend = ({ ID }) => {
  const level = useSelector((state) => state.interface.level);
  const map = useSelector((state) => state.maps[ID]);

  const { min, max } = useSelector(
    (state) => state.interface.minMax[ID][level]
  );
  const midValue = ((parseFloat(max) + parseFloat(min)) / 2).toFixed(1);

  const barStyle = {
    width: "14rem",
    height: "20px",
    background: `linear-gradient(to right, red, green)`,
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {map.type === "comparaison" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography>{map.parti[0].denomination_fr}</Typography>
          <Typography>{map.parti[1].denomination_fr}</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography>{min}</Typography>
          <Typography>{midValue}</Typography>
          <Typography>{max}</Typography>
        </Box>
      )}
      <Box style={barStyle}></Box>
    </Box>
  );
};

export default Legend;
