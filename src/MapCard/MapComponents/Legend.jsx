const Legend = ({ data, colors }) => {
  const values = Object.values(data);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const minValueColor = colors[0];
  const maxValueColor = colors[1];

  const getColorScale = (maxValue, minValue) => {
    const colorScale = [];

    const step = (maxValue - minValue) / 4;

    for (let i = 4; i >= 0; i--) {
      const value = minValue + i * step;
      const color = getColorForValue(value);

      colorScale.push({ value, color });
    }

    return colorScale;
  };

  const getColorForValue = (value) => {
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    const r = Math.floor(
      normalizedValue *
        (parseInt(maxValueColor.substr(1, 2), 16) -
          parseInt(minValueColor.substr(1, 2), 16)) +
        parseInt(minValueColor.substr(1, 2), 16)
    );
    const g = Math.floor(
      normalizedValue *
        (parseInt(maxValueColor.substr(3, 2), 16) -
          parseInt(minValueColor.substr(3, 2), 16)) +
        parseInt(minValueColor.substr(3, 2), 16)
    );
    const b = Math.floor(
      normalizedValue *
        (parseInt(maxValueColor.substr(5, 2), 16) -
          parseInt(minValueColor.substr(5, 2), 16)) +
        parseInt(minValueColor.substr(5, 2), 16)
    );

    return `rgb(${r}, ${g}, ${b})`;
  };

  const colorScale = getColorScale(maxValue, minValue);

  // const legendStyle = {
  // position: "absolute",
  // bottom: "10px",
  // left: "4px",
  //   backgroundColor: "white",
  //   padding: "4px",
  //   borderRadius: "4px",
  //   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  // };

  // const legendItemStyle = {
  //   display: "flex",
  //   alignItems: "center",
  //   marginBottom: "5px",
  // };

  // const legendSquareStyle = {
  //   width: "20px",
  //   height: "20px",
  //   border: "1px solid black",
  //   marginRight: "5px",
  // };

  // return (
  //   <div style={legendStyle} className="leaflet-bottom leaflet-left">
  //     {colorScale.map((scale, index) => (
  //       <div key={index} style={legendItemStyle}>
  //         <div
  //           style={{
  //             ...legendSquareStyle,
  //             backgroundColor: scale.color,
  //           }}
  //         ></div>
  //         <div style={{ fontSize: "12px" }}>{scale.value.toFixed(2)}</div>
  //       </div>
  //     ))}
  //   </div>
  // );
  const legendContainerStyle = {
    display: "flex",
    position: "absolute",
    bottom: "10px",
    left: "4px",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "4px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  };

  const legendScaleStyle = {
    width: "20px",
    height: "100px",
    marginBottom: "5px",
    background: `linear-gradient(to bottom, ${maxValueColor}, ${minValueColor})`,
  };

  const graduatedLineStyle = {
    position: "absolute",
    top: "0",
    left: "22px",
    width: "1px",
    height: "100%",
    backgroundColor: "black",
  };

  return (
    <div style={legendContainerStyle}>
      <div style={{ fontSize: "12px" }}>100</div>
      <div style={legendScaleStyle} />
      <div style={{ fontSize: "12px" }}>0.1</div>
    </div>
  );
};

export default Legend;
