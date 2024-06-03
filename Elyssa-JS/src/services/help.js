import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const url = "https://elyssa.tsaas.tn/api";
const axios = setupCache(Axios);

export const getHelp = async ({ id1, id2, id3 }) => {
  try {
    const response = await axios.post(
      url,
      {
        req: {
          type: "help",
          id_1: id1,
          id_2: id2,
          id_3: id3,
        },
      },
      {
        cache: { interpretHeader: false, methods: ["get", "post"] },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
