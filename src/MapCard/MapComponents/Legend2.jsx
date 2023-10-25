import { Box, Typography } from "@mui/joy";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Legend2 = ({ ID, colors, hover }) => {
  const level = useSelector((state) => state.interface.level);
  const compare = useSelector((state) => state.interface.compareToggle);
  const classNumber = useSelector((state) =>
    compare
      ? state.interface.classNumber[3][level]
      : state.interface.classNumber[ID][level]
  );

  const values = useSelector((state) =>
    compare
      ? state.interface.minMax[3][level]
      : state.interface.minMax[ID][level]
  );

  const { min, max } = values;
  const singleColorRange = (max - min) / classNumber;

  const stepSize = Math.floor(colors.length / classNumber);

  const selectedColors = [];

  for (var i = 0; i < classNumber; i++) {
    var index = i * stepSize;
    selectedColors.push(colors[index]);
  }

  const calculateIndicatorPosition = (value) => {
    const indicatorPosition = ((value - min) / (max - min)) * 100;
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
          // left: `${calculateIndicatorPosition(data[hover])}%`,
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
        {selectedColors.map((color, index) => (
          <Box key={index} style={rangeStyle}>
            <Typography
              style={{ fontSize: "0.75rem", transform: "translateX(-25%)" }}
            >
              {/* {(singleColorRange * index + min).toFixed(1)} */}
              {Math.round(singleColorRange * index + min)}
            </Typography>
            <Typography
              style={{
                background: color,
                display: "inline-block",
                width: "30px",
                height: "20px",
                border: `1px solid #fff`,
              }}
            ></Typography>
          </Box>
        ))}
        <Typography
          style={{ fontSize: "0.75rem", transform: "translateX(-50%)" }}
        >
          {/* {max.toFixed(1)} */}
          {Math.round(max)}
        </Typography>
      </Box>
    </Box>
  );
};

export default Legend2;
