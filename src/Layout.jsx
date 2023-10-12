import { Box } from "@mui/joy";

const Root = (props) => {
  return (
    <Box
      {...props}
      sx={[
        {
          display: "grid",
          gridTemplateRows: "5rem 10rem 1fr",
          minHeight: "100vh",
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
};

const Header = (props) => {
  return (
    <Box
      component="header"
      className="Header"
      {...props}
      sx={[
        {
          p: 2,
          gap: 2,
          bgcolor: "background.surface",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gridColumn: "1 / -1",
          borderBottom: "1px solid",
          borderColor: "divider",
          // position: "sticky",
          top: 0,
          zIndex: 1100,
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
};

const SidePanel = (props) => {
  return (
    <Box
      component="nav"
      className="Navigation"
      {...props}
      sx={[
        {
          p: 2,
          bgcolor: "background.surface",
          borderRight: "1px solid",
          borderColor: "divider",
          display: {
            xs: "none",
            sm: "initial",
          },
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
};

const TopPanel = (props) => {
  return (
    <Box
      component="top"
      className="TopPanel"
      {...props}
      sx={[
        (theme) => ({
          p: 2,
          bgcolor: "background.surface",
          borderRight: "1px solid",
          borderColor: "divider",
          boxShadow: theme.shadow.xxl,
          zIndex: 2,
        }),
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
};

function Main(props) {
  return (
    <Box
      component="main"
      className="Main"
      {...props}
      sx={[
        {
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "minmax(64px, 200px) minmax(450px, 1fr)",
            md: "minmax(40rem, 60rem)",
          },
          margin: "auto",
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
}

export default { Root, Header, TopPanel, SidePanel, Main };
