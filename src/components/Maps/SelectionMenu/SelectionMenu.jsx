import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import PopupState, { bindHover, bindMenu } from "material-ui-popup-state";
import HoverMenu from "material-ui-popup-state/HoverMenu";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";

const CascadingContext = React.createContext({
  parentPopupState: null,
  rootPopupState: null,
});

function CascadingMenuItem({ onClick, ...props }) {
  const { rootPopupState } = React.useContext(CascadingContext);
  if (!rootPopupState) throw new Error("must be used inside a CascadingMenu");
  const handleClick = React.useCallback(
    (event) => {
      rootPopupState.close(event);
      if (onClick) onClick(event);
    },
    [rootPopupState, onClick]
  );

  return <MenuItem {...props} onClick={handleClick} />;
}

function CascadingSubmenu({ title, popupId, ...props }) {
  const { parentPopupState } = React.useContext(CascadingContext);
  return (
    <PopupState
      popupId={popupId}
      variant="popover"
      parentPopupState={parentPopupState}
      disableAutoFocus
    >
      {(popupState) => (
        <React.Fragment>
          <MenuItem {...bindHover(popupState)}>
            <span style={{ flexGrow: 1 }}>{title}</span>
            <ChevronRight style={{ marginRight: -1 }} />
          </MenuItem>
          <CascadingMenu
            {...props}
            classes={{ ...props }}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            popupState={popupState}
          />
        </React.Fragment>
      )}
    </PopupState>
  );
}

function CascadingMenu({ popupState, ...props }) {
  const { rootPopupState } = React.useContext(CascadingContext);
  const context = React.useMemo(
    () => ({
      rootPopupState: rootPopupState || popupState,
      parentPopupState: popupState,
    }),
    [rootPopupState, popupState]
  );

  return (
    <CascadingContext.Provider value={context}>
      <HoverMenu {...props} {...bindMenu(popupState)} />
    </CascadingContext.Provider>
  );
}

const SelectionMenu = ({ elections, setMapList, mapList }) => {
  const [selectedList, setSelectedList] = useState([]);

  const handleSelection = (element) => {
    const selection =
      typeof element === "string"
        ? element
        : {
            type: element.election,
            election: element.year,
            partie: element.partie,
          };
    const state = [...mapList];

    if (state[0] == ["blank"]) {
      setMapList([selection]);
      return;
    }

    if (state.includes(selection)) {
      if (state.length === 1) {
        setMapList(["blank"]);
        return;
      } else {
        state.splice(state.indexOf(selection), 1);
        setMapList(state);
        return;
      }
    } else {
      setMapList([...state, selection]);
    }
  };

  const checkboxManager = ({ election, year, partie }) => {
    const result = {
      type: election,
      election: year,
      partie: partie,
    };
    handleSelection(result);
  };

  return (
    <PopupState variant="popover" popupId="map-Selection-Menu" disableAutoFocus>
      {(popupState) => (
        <div style={{ height: 600 }}>
          <Button variant="contained" {...bindHover(popupState)}>
            Selectionner une carte
          </Button>
          <CascadingMenu
            popupState={popupState}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <CascadingSubmenu popupId="electionChoice" title="Elections">
              {elections.map((election) => (
                <CascadingSubmenu
                  key={election.type}
                  popupId="ElectionTypeChoice"
                  title={election.type}
                >
                  {election.elections.map((year) => (
                    <CascadingSubmenu
                      key={year.Election}
                      popupId="electionYearChoice"
                      title={year.Election}
                    >
                      <FormGroup>
                        {year.parties.map((partie) => (
                          <CascadingMenuItem
                            key={partie}
                            onClick={() =>
                              handleSelection({
                                election: election.type,
                                year: year.Election,
                                partie: partie,
                              })
                            }
                          >
                            {partie}
                          </CascadingMenuItem>
                        ))}
                      </FormGroup>
                    </CascadingSubmenu>
                  ))}
                </CascadingSubmenu>
              ))}
            </CascadingSubmenu>
            <CascadingSubmenu popupId="themeChoice" title="Themes">
              <CascadingMenuItem onClick={() => handleSelection("chomage")}>
                Chomage
              </CascadingMenuItem>
              <CascadingMenuItem
                onClick={() => handleSelection("analphabetisme")}
              >
                Analphabétisme
              </CascadingMenuItem>
              <CascadingMenuItem onClick={() => handleSelection("age_moyen")}>
                Moyenne d'Age
              </CascadingMenuItem>
            </CascadingSubmenu>
          </CascadingMenu>
        </div>
      )}
    </PopupState>
  );
};

export default SelectionMenu;
