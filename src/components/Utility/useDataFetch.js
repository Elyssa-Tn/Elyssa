import { useState, useEffect } from "react";
import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const axios = setupCache(Axios);
const url = "https://elyssa.tsaas.tn/api";

const useDataFetch = (request) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post(url, request, {
        cache: { interpretHeader: false, methods: ["get", "post"] },
      });
      setData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error };
};

export default useDataFetch;
