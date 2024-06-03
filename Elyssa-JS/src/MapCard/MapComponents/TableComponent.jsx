import { Box, Button, ButtonGroup, Table, Tooltip } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import ExploreIcon from "@mui/icons-material/Explore";
import {
  resetViewport,
  setChartMode,
  setClickedTarget,
  setCurrentTarget,
  setLevel,
  setTableMode,
} from "../../reducers/interfaceReducer";
import { useEffect, useState } from "react";
import { Close, EqualizerOutlined } from "@mui/icons-material";
import { deleteMap } from "../../reducers/mapReducer";

function TableComponent({ ID }) {
  const { resultat } = useSelector((state) => state.maps[ID]);
  const level = useSelector((state) => state.interface.level);
  const levels = useSelector((state) => state.interface.levels);
  const map = useSelector((state) => state.maps[ID]);
  const currentTarget = useSelector((state) => state.interface.currentTarget);

  const [codes, setCodes] = useState(null);

  const dispatch = useDispatch();

  const handleMapButton = () => {
    dispatch(setTableMode(ID));
  };

  const handleChartButton = () => {
    dispatch(setChartMode(ID));
    dispatch(setTableMode(ID));
  };

  const handleResetClick = () => {
    dispatch(resetViewport());
    dispatch(setCurrentTarget(null));
    dispatch(setLevel(levels[0]));
    dispatch(setClickedTarget(null));
  };

  const handleDeleteClick = () => {
    handleResetClick();
    dispatch(deleteMap(ID));
  };

  useEffect(() => {
    setCodes(null);
    const codes = Object.keys(resultat[level]);

    const filteredCodes = currentTarget
      ? codes.filter((code) =>
          code.startsWith(String(currentTarget.targetCode))
        )
      : codes;

    setCodes(filteredCodes);
  }, [resultat, level, currentTarget]);

  const handleClick = (object) => {
    // const code = object.properties[`code_${level}`];
    // const name = object.properties[`nom_${level}`];
    // dispatch(
    //   setCurrentTarget({
    //     targetName: name,
    //     targetCode: code,
    //     targetLevel: level,
    //   })
    // );
    console.log(object);
  };

  const simpleTableHeaders = [
    `Nom ${level}`,
    "Pourcentage",
    "Voix",
    map.type === "TP" ? "Inscrits" : "Votes",
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        <ButtonGroup
          orientation="vertical"
          size="sm"
          sx={{ padding: "0.25rem" }}
        >
          <Tooltip placement="top" arrow title="Fermer">
            <Button onClick={handleDeleteClick}>
              <Close />
            </Button>
          </Tooltip>
          <Button onClick={handleMapButton}>
            <ExploreIcon />
          </Button>
          <Tooltip placement="top" arrow title="Afficher en graphique">
            <Button onClick={handleChartButton}>
              <EqualizerOutlined />
            </Button>
          </Tooltip>
        </ButtonGroup>
        {codes && (
          <Box height={500} width={400} overflow={"auto"}>
            {map.type === "comparaison" ? (
              <Table stripe={"odd"}>
                <thead>
                  <tr>
                    <th></th>
                    <th colSpan="3">{`${
                      map.parti[0].code_parti
                    } - ${map.election[0].nom.slice(-4)}`}</th>
                    <th colSpan="3">{`${
                      map.parti[1].code_parti
                    } - ${map.election[1].nom.slice(-4)}`}</th>
                  </tr>
                  <tr>
                    <th>{simpleTableHeaders[0]}</th>
                    <th>{simpleTableHeaders[1]}</th>
                    <th>{simpleTableHeaders[2]}</th>
                    <th>{simpleTableHeaders[3]}</th>
                    <th>{simpleTableHeaders[1]}</th>
                    <th>{simpleTableHeaders[2]}</th>
                    <th>{simpleTableHeaders[3]}</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((code) =>
                    code ? (
                      resultat[level][code] ? (
                        <tr key={code}>
                          <td>{resultat[level][code]["nom_fr"]}</td>
                          <td>{resultat[level][code]["oldprc"].toFixed(1)}</td>
                          <td>{resultat[level][code]["oldvoix"]}</td>
                          <td>{resultat[level][code]["oldvotes"]}</td>
                          <td>{resultat[level][code]["newprc"].toFixed(1)}</td>
                          <td>{resultat[level][code]["newvoix"]}</td>
                          <td>{resultat[level][code]["newvotes"]}</td>
                        </tr>
                      ) : null
                    ) : null
                  )}
                </tbody>
              </Table>
            ) : (
              <Table stripe={"odd"}>
                <thead>
                  <tr>
                    <th>{simpleTableHeaders[0]}</th>
                    <th>{simpleTableHeaders[1]}</th>
                    <th>{simpleTableHeaders[2]}</th>
                    <th>{simpleTableHeaders[3]}</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((code) =>
                    code ? (
                      resultat[level][code] ? (
                        <tr key={code}>
                          <td>{resultat[level][code]["nom_fr"]}</td>
                          <td>
                            {resultat[level][code][
                              map.type === "TP" ? "tp" : "prc"
                            ].toFixed(1)}
                          </td>
                          <td>
                            {resultat[level][code][
                              map.type === "TP" ? "votes" : "voix"
                            ].toLocaleString()}
                          </td>
                          <td>
                            {resultat[level][code][
                              map.type === "TP" ? "inscrits" : "votes"
                            ].toLocaleString()}
                          </td>
                        </tr>
                      ) : null
                    ) : null
                  )}
                </tbody>
              </Table>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default TableComponent;
