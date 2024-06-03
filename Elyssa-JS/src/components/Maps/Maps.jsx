import "./Maps.css";
import { useState } from "react";
import { Button, Modal } from "@mui/material";
import ModalContents from "./ModalContents/ModalContents";
import useDataFetch from "../Utility/useDataFetch";
import MapCard from "./MapCard";

const Maps = () => {
  const { data, loading, error } = useDataFetch({
    req: {
      type: "init",
    },
  });

  if (error) console.log(error);

  const [mapList, setMapList] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const removeMap = (map) => {
    let state = [...mapList];
    state.splice(state.indexOf(map), 1);
    if (state.length === 0) {
      setMapList(null);
      return;
    }
    setMapList(state);
  };

  const addMap = (map) => {
    let currentMaps = mapList ? [...mapList] : [];
    currentMaps.push(map);
    setMapList(currentMaps);
  };

  return (
    <>
      <div>
        <h2>Carte Graphique</h2>
        <Button
          style={{
            backgroundColor: "#f44336",
            borderRadius: "4px",
            color: "#fff",
          }}
          onClick={handleOpen}
        >
          Explorer
        </Button>
        <Modal
          open={modalOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <ModalContents
            data={data}
            loading={loading}
            error={error}
            addMap={addMap}
          />
        </Modal>
      </div>
      <div className="maps-page-container">
        <div className="map-collector">
          {mapList && mapList.map((map) => <MapCard key={map} map={map} />)}
        </div>
      </div>
    </>
  );
};

export default Maps;
