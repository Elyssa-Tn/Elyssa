import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Button, Menu, MenuItem } from "@mui/material";

const MapLevelSelection = ({ level, setLevel }) => {
  const handleLevelChange = (popupState, level) => {
    popupState.close();
    setLevel(level);
  };

  return (
    <div className="leaflet-top leaflet-right">
      <div className="level-selection-button leaflet-control leaflet-bar">
        <PopupState variant="popover" popupId="demoMenu">
          {(popupState) => (
            <div>
              <Button variant="contained" {...bindTrigger(popupState)}>
                {level}
              </Button>
              <Menu
                {...bindMenu(popupState)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                <MenuItem
                  onClick={() => handleLevelChange(popupState, "delegation")}
                >
                  Delegation
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleLevelChange(popupState, "circonscription")
                  }
                >
                  Circonscription
                </MenuItem>
                <MenuItem
                  onClick={() => handleLevelChange(popupState, "gouvernorat")}
                >
                  Gouvernorat
                </MenuItem>
              </Menu>
            </div>
          )}
        </PopupState>
      </div>
    </div>
  );
};

export default MapLevelSelection;
