import axios from "axios";

 
const userManagementApi = () => {

  return axios.create({


   //baseURL: "https://api-gateway-441978242392.us-central1.run.app",
     baseURL:"http://192.168.8.167:8080"
  });

};


export { userManagementApi};
