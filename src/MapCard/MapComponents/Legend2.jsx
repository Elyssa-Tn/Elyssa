import { Box, Typography } from "@mui/joy";

const Legend2 = ({ colors, level, data, hover }) => {
  const values = Object.values(data[level].prc);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const singleColorRange = (maxValue - minValue) / 5;

  const calculateIndicatorPosition = (value) => {
    const indicatorPosition =
      ((value - minValue) / (maxValue - minValue)) * 100;
    return indicatorPosition;
  };

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
      <Box
        sx={{
          display: `${hover ? "inline-block" : "none"}`,
          position: "absolute",
          top: "2.5rem",
          borderLeft: "0.5rem solid transparent",
          borderRight: "0.5rem solid transparent",
          borderBottom: "0.5rem solid blue",
          transform: "translate(-50%,-75%)",
          left: `${calculateIndicatorPosition(data[hover])}%`,
          zIndex: 2,
        }}
      ></Box>
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
              style={{ fontSize: "0.75rem", transform: "translateX(-25%)" }}
            >
              {(singleColorRange * index + minValue).toFixed(1)}
              {/* {(singleColorRange * (index + 1) + minValue).toFixed(1)} */}
            </Typography>
            <Typography
              style={{
                background: color,
                display: "inline-block",
                width: "40px",
                height: "20px",
                border: `1px solid #fff`,
              }}
            ></Typography>
          </Box>
        ))}
        <Typography
          style={{ fontSize: "0.75rem", transform: "translateX(-50%)" }}
        >
          {maxValue.toFixed(1)}
        </Typography>
      </Box>
    </Box>
  );
};

export default Legend2;
