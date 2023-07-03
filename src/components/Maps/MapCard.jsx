import { useEffect, useState } from "react";
import {
  Card,
  IconButton,
  CardActions,
  CardContent,
  Collapse,
  Box,
} from "@mui/material";
import styled from "@emotion/styled";
import MapComponent2 from "./MapComponent/MapComponent2";
import ExpandedResults from "./MapComponent/ExpandedResults";
import useDataFetch from "../Utility/useDataFetch";
import { SyncLoader } from "react-spinners";
import geojson from "../../assets/Circonscripton2022-vfinal.json";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
}));

function MapCard({ map }) {
  const [expanded, setExpanded] = useState(false);
  let req;

  if (map.election && map.variable) {
    req = {
      req: {
        type: "data",
        code_election: map.election.code_election,
        decoupage: "circonscription",
        variables: [{ code_variable: map.variable.code_variable }],
      },
    };
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { data, loading, error } = useDataFetch(req);

  if (loading) {
    return (
      <SyncLoader
        style={{
          position: "absolute",
          bottom: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }

  if (data) {
    return (
      <Card key={map}>
        <CardActions style={{ padding: 0 }} disableSpacing>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="Voir les donnees"
          >
            Voir les donnees
          </ExpandMore>
        </CardActions>
        <CardContent style={{ display: "flex" }}>
          <MapComponent2 map="blank" data={data} geojson={geojson} />
          <Collapse
            orientation="horizontal"
            in={expanded}
            timeout="auto"
            unmountOnExit
          >
            <ExpandedResults restults={data.data} />
          </Collapse>
        </CardContent>
      </Card>
    );
  }
}

export default MapCard;
