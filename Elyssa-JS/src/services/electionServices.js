import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const url = "https://manager.elyssa-project.org/api";
const axios = setupCache(Axios);
//TODO: fix this eventually
const levels = ["gouvernorat", "delegation"];

const init = async () => {
  try {
    const response = await axios.post(
      url,
      {
        req: {
          type: "init",
          pays: "Tunisie",
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
          pays: "Tunisie",
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

const getPartiScores = async (election) => {
  try {
    const response = await axios.post(
      url,
      {
        req: {
          type: "data",
          pays: "Tunisie",
          code_election: election,
          decoupage: "pays",
          variables: [{ code_variable: "prc", code_parti: "*" }],
        },
      },
      {
        cache: { methods: ["get", "post"] },
        headers: { "Access-Control-Allow-Origin": "*" },
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

//TODO: RESTORE THIS AND IMPROVE IT
// const getRequestResults = async (map) => {
//   const req = requestFormatter(map);
//   try {
//     const response = await axios.post(url, req, {
//       cache: { interpretHeader: false, methods: ["get", "post"] },
//     });
//     return response.data;
//   } catch (error) {
//     return error;
//   }
// };

const getRequestResults = async (map) => {
  const quickFetch = async (level) => {
    const req = {
      req: {
        type: "data",
        pays: "Tunisie",
        code_election: map.election.code_election,
        decoupage: level,
        variables: [{ code_variable: "prc", code_parti: map.parti.code_parti }],
      },
    };
    try {
      const response = await axios.post(url, req, {
        cache: { methods: ["get", "post"] },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  try {
    const results = await Promise.all(levels.map(quickFetch));
    return results;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};

const getTpResult = async (map) => {
  const quickFetch = async (level) => {
    const req = {
      req: {
        type: "data",
        pays: "Tunisie",
        code_election: map.election.code_election,
        decoupage: level,
        variables: [{ code_variable: "tp" }],
      },
    };
    try {
      const response = await axios.post(url, req, {
        cache: { methods: ["get", "post"] },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  try {
    const results = await Promise.all(levels.map(quickFetch));
    return results;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};
const getTotalTpResult = async (map) => {
  const quickFetch = async (level) => {
    const req = {
      req: {
        type: "data",
        pays: "Tunisie",
        code_election: map.election.code_election,
        decoupage: level,
        variables: [{ code_variable: "tp" }],
      },
    };
    try {
      const response = await axios.post(url, req, {
        cache: { methods: ["get", "post"] },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  try {
    const results = await quickFetch("pays");
    return results;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};

const getIndicatorResults = async (req) => {
  const request = { type: "indic", pays: "Tunisie", ...req };

  try {
    const response = await axios.post(url, request, {
      cache: { methods: ["get", "post"] },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

//TODO: End of temporary map fetching code

const electionServices = {
  init,
  getElectionInfo,
  getPartiScores,
  getRequestResults,
  getTpResult,
  getTotalTpResult,
  getIndicatorResults,
};

export default electionServices;

export const fetchGeojson = async (level) => {
  const req = {
    req: {
      type: "map_decoupage",
      pays: "Tunisie",
      version: "10",
      decoupages: [level],
    },
  };
  try {
    const response = await axios.post(url, req, {
      cache: { interpretHeader: false, methods: ["get", "post"] },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getHelp = async (request) => {
  try {
    const response = await axios.post(url, request, {
      cache: { interpretHeader: false, methods: ["get", "post"] },
    });
    return response.data.helps[0].texte;
  } catch (error) {
    console.log(error);
    return error;
  }
};
