import axios from "axios";

const SERVER_IP = process.env.SERVER_IP;
const SERVER_PORT = process.env.SERVER_PORT;
const DOMAIN = `http://${SERVER_IP}:${SERVER_PORT}`;

export const APIRequest = async (method, endpoint, data) => {

  return await axios({
    method,
    url: `${DOMAIN}/toss${endpoint}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: data,
  })
    .then((res) => res)
    .catch((error) => {
      console.log(error);
      return error.response;
    });
};
