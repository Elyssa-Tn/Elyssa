import { Box, Typography } from "@mui/joy";

const Legend = ({ ID, colors }) => {
  const thresholds = [-10, -5, 0, 5, 10];

  const containerStyle = {
    position: "relative",
    display: "flex",
    flexDirection: "row",
  };

  const rangeStyle = {
    display: "flex",
    flexDirection: "column",
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        maxWidth: "50%",
      }}
    >
      <Box className="legendContainer" sx={containerStyle}>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginRight: "0.75rem",
          }}
        >
          <Typography style={{ fontSize: "0.75rem" }}>N/A</Typography>
          <Typography
            style={{
              background: "#d3d3d3",
              display: "inline-block",
              width: "2.5rem",
              height: "1.25rem",
              marginRight: "0.25rem",
              border: "1px solid #fff",
            }}
          ></Typography>
        </Box>
        {colors.map((color, index) => (
          <Box key={index} style={rangeStyle}>
            <Typography
              style={{ fontSize: "0.75rem", transform: "translateX(+25%)" }}
            >
              {thresholds[index]}
            </Typography>
            <Typography
              style={{
                background: color,
                display: "inline-block",
                width: "30px",
                height: "20px",
                border: `1px solid #333`,
              }}
            ></Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Legend;
