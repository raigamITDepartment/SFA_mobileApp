import axios from "axios";

 
const userManagementApi = () => {

  return axios.create({


   baseURL: "https://raigam-sfa-api-gateway.purplesand-bdf733b9.southeastasia.azurecontainerapps.io/",
   //baseURL:"http://192.168.8.167:8080"
  });

};


export { userManagementApi};
