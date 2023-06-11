import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  useMediaQuery,
  useTheme,
  Drawer,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import NavbarContents from "./NavbarContents/NavbarContents";

const Navbar = () => {
  const [drawerOpen, setdrawerOpen] = useState(false);
  const theme = useTheme();
  const onMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar position="static" sx={{ bgcolor: "#f44336", borderRadius: "25px" }}>
      {onMobile ? (
        <Toolbar
          sx={{
            display: "flex",
            minHeight: "0px",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ marginRight: "0" }}
            onClick={() => setdrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Button
            variant="h6"
            component={Link}
            to="/"
            sx={{ margin: "0 auto", translate: "-25%" }}
          >
            Elyssa
          </Button>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setdrawerOpen(false)}
            PaperProps={{
              sx: {
                backgroundColor: "#f44336",
              },
            }}
          >
            <NavbarContents />
          </Drawer>
        </Toolbar>
      ) : (
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "0px",
          }}
        >
          <NavbarContents />
        </Toolbar>
      )}
    </AppBar>
  );
};

export default Navbar;
