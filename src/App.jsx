import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeElections } from "./reducers/electionReducer";
import ModalContents from "./ModalContents/ModalContents";
import MapCard from "./MapCard/MapCard";
import "./App.css";

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
        <div>
          <div className="maps-page-container">
            <ModalContents />
            <div className="map-collector">
              {maps &&
                maps.map((mapObject) => {
                  const [ID, map] = Object.entries(mapObject)[0];
                  return <MapCard key={ID} map={map} />;
                })}
            </div>
          </div>
        </div>
      </>
    );
}

export default App;
