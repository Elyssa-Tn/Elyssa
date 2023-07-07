import React from "react";
import { Link } from "react-router-dom";
import { Button, MenuItem, Menu } from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const NavbarContents = () => {
  const buttonStyle = [
    {
      "&:hover": {
        backgroundColor: "#c62828",
      },
    },
    {
      bgcolor: "#f44336",
      boxShadow: "none",
    },
  ];
  return (
    <>
      <Button variant="h6" component={Link} to="/">
        Elyssa
      </Button>
      <PopupState variant="popover" popupId="about-menu">
        {(popupState) => (
          <React.Fragment>
            <Button
              color="inherit"
              variant="contained"
              endIcon={<KeyboardArrowDownIcon />}
              sx={buttonStyle}
              {...bindTrigger(popupState)}
            >
              Le Projet
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem component={Link} to="/about/project">
                Présentation du Projet
              </MenuItem>
              <MenuItem component={Link} to="/about/teams">
                Équipes
              </MenuItem>
              <MenuItem component={Link} to="/about/research">
                Recherches Électorales
              </MenuItem>
              <MenuItem component={Link} to="/about/publications">
                Publications
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
      <PopupState variant="popover" popupId="about-menu">
        {(popupState) => (
          <React.Fragment>
            <Button
              color="inherit"
              variant="contained"
              endIcon={<KeyboardArrowDownIcon />}
              sx={buttonStyle}
              {...bindTrigger(popupState)}
            >
              Explorer les Données
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem component={Link} to="/explore/elections">
                Par Élection
              </MenuItem>
              <MenuItem component={Link} to="/explore/geography">
                Par Niveau géographique
              </MenuItem>
              <MenuItem component={Link} to="/explore/themes">
                Par Thèmes
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>{" "}
      <Button component={Link} to="/maps" color="inherit">
        Cartes Et Graphiques
      </Button>
      <Button component={Link} to="/legal" color="inherit">
        Mentions Légales
      </Button>
      <Button component={Link} to="/login" color="inherit">
        Connexion
      </Button>
    </>
  );
};

export default NavbarContents;
