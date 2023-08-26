const Legend2 = ({ colors, data }) => {
  console.log(data);
  const values = Object.values(data);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const singleColorRange = (maxValue - minValue) / 5;

  const containerStyle = {
    // position: "absolute",
    // bottom: "10px",
    // left: "20px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "10px 0 0 0",
    borderRadius: "5px",
    // boxShadow: "0 0 tpx rgba(0,0,0,0.2)",
  };

  const rangeStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "5px",
  };

  return (
    <div style={containerStyle}>
      <div style={rangeStyle}>
        <span style={{ fontSize: "12px" }}>N/A</span>
        <span
          style={{
            background: "#d3d3d3",
            display: "inline-block",
            width: "40px",
            height: "20px",
            marginRight: "5px",
            border: "1px solid #fff",
          }}
        ></span>
      </div>
      {colors.map((color, index) => (
        <div key={index} style={rangeStyle}>
          <span style={{ fontSize: "12px" }}>
            {(singleColorRange * index + minValue).toFixed(1)}
            {/* {(singleColorRange * (index + 1) + minValue).toFixed(1)} */}
          </span>
          <span
            style={{
              background: color,
              display: "inline-block",
              width: "40px",
              height: "20px",
              border: "1px solid #fff",
              // marginRight: "5px",
            }}
          ></span>
        </div>
      ))}
    </div>
  );
};

export default Legend2;
