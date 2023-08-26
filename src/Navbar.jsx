import { Box, Typography, IconButton, Input, Link } from "@mui/joy";
import { Link as RouterLink } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import BookRoundedIcon from "@mui/icons-material/BookRounded";
// import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";

const Navbar = () => {
  const setDrawerOpen = (value) => {
    console.log(value);
  };
  return (
    <Box
      sx={{
        position: "absolute",
        top: "10px",
        backgroundColor: "#0000FF",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        padding: "2px",
        margin: "8px",
        width: "99vw",
        borderRadius: "5px",
        // borderBottom: "1px solid",
      }}
    >
      <Link
        style={{ color: "white" }}
        component={RouterLink}
        fontWeight="xl"
        to="/"
      >
        Elyssa
      </Link>
      <Link
        style={{ color: "white" }}
        component={RouterLink}
        fontWeight="xl"
        to="/"
      >
        Présentation de l’équipe
      </Link>
      <Link
        style={{ color: "white" }}
        component={RouterLink}
        fontWeight="xl"
        to="/"
      >
        Bibliographie
      </Link>
      <Input
        size="sm"
        variant="outlined"
        placeholder="Recherche"
        startDecorator={<SearchRoundedIcon color="primary" />}
        sx={{
          flexBasis: "500px",
          display: {
            xs: "none",
            sm: "flex",
          },
          boxShadow: "sm",
        }}
      />
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          sx={{ display: { xs: "inline-flex", sm: "none" } }}
        >
          <SearchRoundedIcon />
        </IconButton>
        <Link
          style={{ color: "white" }}
          component={RouterLink}
          fontWeight="xl"
          to="/login"
        >
          Login
        </Link>

        {/* <IconButton
          size="sm"
          variant="soft"
          color="neutral"
          component="a"
          href="/blog/first-look-at-joy/"
        >
          <AccountBoxIcon />
        </IconButton> */}
        {/* <Menu
          id="app-selector"
          control={
            <IconButton
              size="sm"
              variant="soft"
              color="neutral"
              aria-label="Apps"
            >
              <GridViewRoundedIcon />
            </IconButton>
          }
          menus={[
            {
              label: "Email",
              href: "/joy-ui/getting-started/templates/email/",
            },
            {
              label: "Team",
              href: "/joy-ui/getting-started/templates/team/",
            },
            {
              label: "Files",
              active: true,
              "aria-current": "page",
              href: "/joy-ui/getting-started/templates/files/",
            },
          ]}
        /> */}
      </Box>
    </Box>
  );
};

export default Navbar;
