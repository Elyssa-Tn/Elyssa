import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const url = "https://elyssa.tsaas.tn/api";
const axios = setupCache(Axios);

const init = async () => {
  try {
    const response = await axios.post(
      url,
      {
        req: {
          type: "init",
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

const getElectionInfo = async (election) => {
  try {
    const response = await axios.post(
      url,
      {
        req: {
          type: "election",
          code_election: election,
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

const requestFormatter = (map) => {
  let req = {
    req: {
      type: "data",
      code_election: map.election.code_election,
      decoupage: map.level ? map.level.code : "gouvernorat",
      ...(map.variable
        ? { variables: [{ code_variable: map.variable.code_variable }] }
        : null),
      ...(map.parti
        ? {
            variables: [
              { code_variable: "prc", code_parti: map.parti.code_parti },
              { code_variable: "voix", code_parti: map.parti.code_parti },
            ],
          }
        : null),
      ...(!map.parti && !map.variable
        ? {
            variables: [
              { code_variable: "prc", code_parti: "*" },
              { code_variable: "voix", code_parti: "*" },
            ],
          }
        : null),
      ...(map.circonscription && !map.parti
        ? {
            filtre: {
              decoupage: "circonscription",
              valeur: map.circonscription.code_circonscription,
            },
            variables: [
              { code_variable: "prc", code_parti: "*" },
              { code_variable: "voix", code_parti: "*" },
            ],
          }
        : null),
      ...(map.filtre && !map.circonscription ? { filtre: map.filtre } : null),
    },
  };

  return req;
};

const getRequestResults = async (map) => {
  const req = requestFormatter(map);
  try {
    const response = await axios.post(url, req, {
      cache: { interpretHeader: false, methods: ["get", "post"] },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

const electionServices = { init, getElectionInfo, getRequestResults };

export default electionServices;
