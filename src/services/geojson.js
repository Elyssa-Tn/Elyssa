import { fetchGeojson } from "./electionServices";
import dbAccess from "./db";

export const getGeoJSON = async (level) => {
  try {
    const db = await dbAccess.openIndexedDB();

    const storedGeoJSON = await dbAccess.getGeoJSONFromIndexedDB(db, level);

    if (storedGeoJSON) {
      return await storedGeoJSON;
    } else {
      try {
        const response = await fetchGeojson(level);
        if (response) {
          const map = response.maps[level];
          await dbAccess.saveGeoJSONToIndexedDB(db, level, map);
          return map;
        } else {
          throw new Error(`Failed to fetch GeoJSON from ${level}`);
        }
      } catch (error) {
        throw new Error(`Error fetching or parsing GeoJSON: ${error.message}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
