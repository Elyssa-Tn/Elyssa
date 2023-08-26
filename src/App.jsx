import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeElections } from "./reducers/electionReducer";
import ModalContents from "./ModalContents/ModalContents";
import MapCard from "./MapCard/MapCard";
import "./App.css";
import Navbar from "./Navbar";

function App() {
  const dispatch = useDispatch();

  const init = useSelector((state) => state.elections.init);

  const maps = useSelector((state) => state.maps.maps);

  useEffect(() => {
    dispatch(initializeElections());
  }, [dispatch]);

  if (init)
    return (
      <>
        <Navbar />
        <div className="maps-page-container">
          <ModalContents />
          <div className="map-collector">
            {maps &&
              maps.map((mapObject) => {
                const [ID, map] = Object.entries(mapObject)[0];
                return (
                  <MapCard
                    key={ID}
                    id={ID}
                    map={map[1]}
                    electionInfo={map[0]}
                  />
                );
              })}
          </div>
        </div>
      </>
    );
}

export default App;
