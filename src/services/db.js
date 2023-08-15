const openIndexedDB = async () => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open("geojsonDB", 1);

    openRequest.onupgradeneeded = function (event) {
      const db = event.target.result;
      db.createObjectStore("geojsonStore");
    };

    openRequest.onsuccess = function (event) {
      const db = event.target.result;
      resolve(db);
    };

    openRequest.onerror = function (event) {
      reject(new Error("Error opening IndexedDB"));
    };
  });
};

const saveGeoJSONToIndexedDB = async (db, key, geojson) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["geojsonStore"], "readwrite");
    const store = transaction.objectStore("geojsonStore");
    const request = store.put(geojson, key);

    request.onsuccess = function (event) {
      resolve();
    };

    request.onerror = function (event) {
      reject(new Error("Error saving GeoJSON to IndexedDB"));
    };
  });
};

const getGeoJSONFromIndexedDB = async (db, key) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["geojsonStore"], "readonly");
    const store = transaction.objectStore("geojsonStore");
    const request = store.get(key);

    request.onsuccess = function (event) {
      const geojson = event.target.result;
      resolve(geojson);
    };

    request.onerror = function (event) {
      reject(new Error("Error getting GeoJSON from IndexedDB"));
    };
  });
};
const dbAccess = {
  openIndexedDB,
  saveGeoJSONToIndexedDB,
  getGeoJSONFromIndexedDB,
};

export default dbAccess;
