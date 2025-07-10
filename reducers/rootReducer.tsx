import { combineReducers } from "redux";

import LoginReducer from "./LoginReducer";
import TeRootReducer from "./TeRootReducer";
import Logout from "./LogoutReducer";



const rootReducer = combineReducers({
  login: LoginReducer,
  root : TeRootReducer,
  Logout : Logout


  
});
export default rootReducer;
