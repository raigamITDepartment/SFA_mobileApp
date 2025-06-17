import axios from "axios";

 
const userManagementApi = () => {

  return axios.create({


    baseURL: "https://api-gateway-711667297937.asia-south1.run.app",

  });

};


export { userManagementApi};
