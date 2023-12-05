// const Legend = ({ data, colors }) => {
//   const values = Object.values(data);
//   const minValue = Math.min(...values);
//   const maxValue = Math.max(...values);
//   const minValueColor = colors[0];
//   const maxValueColor = colors[1];

//   const getColorScale = (maxValue, minValue) => {
//     const colorScale = [];

//     const step = (maxValue - minValue) / 4;

//     for (let i = 4; i >= 0; i--) {
//       const value = minValue + i * step;
//       const color = getColorForValue(value);

//       colorScale.push({ value, color });
//     }

//     return colorScale;
//   };

//   const getColorForValue = (value) => {
//     const normalizedValue = (value - minValue) / (maxValue - minValue);
//     const r = Math.floor(
//       normalizedValue *
//         (parseInt(maxValueColor.substr(1, 2), 16) -
//           parseInt(minValueColor.substr(1, 2), 16)) +
//         parseInt(minValueColor.substr(1, 2), 16)
//     );
//     const g = Math.floor(
//       normalizedValue *
//         (parseInt(maxValueColor.substr(3, 2), 16) -
//           parseInt(minValueColor.substr(3, 2), 16)) +
//         parseInt(minValueColor.substr(3, 2), 16)
//     );
//     const b = Math.floor(
//       normalizedValue *
//         (parseInt(maxValueColor.substr(5, 2), 16) -
//           parseInt(minValueColor.substr(5, 2), 16)) +
//         parseInt(minValueColor.substr(5, 2), 16)
//     );

//     return `rgb(${r}, ${g}, ${b})`;
//   };

//   const colorScale = getColorScale(maxValue, minValue);

//   const legendContainerStyle = {
//     display: "flex",
//     position: "absolute",
//     bottom: "10px",
//     left: "4px",
//     flexDirection: "column",
//     alignItems: "center",
//     backgroundColor: "white",
//     padding: "10px",
//     borderRadius: "4px",
//     boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
//   };

//   const legendScaleStyle = {
//     width: "20px",
//     height: "100px",
//     marginBottom: "5px",
//     background: `linear-gradient(to bottom, ${maxValueColor}, ${minValueColor})`,
//   };

//   const graduatedLineStyle = {
//     position: "absolute",
//     top: "0",
//     left: "22px",
//     width: "1px",
//     height: "100%",
//     backgroundColor: "black",
//   };

//   return (
//     <div style={legendContainerStyle}>
//       <div style={{ fontSize: "12px" }}>100</div>
//       <div style={legendScaleStyle} />
//       <div style={{ fontSize: "12px" }}>0.1</div>
//     </div>
//   );
// };

// export default Legend;

import { Box, Sheet, Typography } from "@mui/joy";
import React from "react";
import { useSelector } from "react-redux";

const Legend = ({ ID }) => {
  const level = useSelector((state) => state.interface.level);
  const { min, max } = useSelector(
    (state) => state.interface.minMax[ID][level]
  );
  const midValue = (parseFloat(max) + parseFloat(min)) / 2;

  const legendStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    background: "lightgray",
    margin: "10px",
  };

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
      <Box style={barStyle}></Box>
    </Box>
  );
};

export default Legend;
