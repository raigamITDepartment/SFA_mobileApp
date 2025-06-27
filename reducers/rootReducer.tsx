import { combineReducers } from "redux";

import LoginReducer from "./LoginReducer";
import TeRootReducer from "./TeRootReducer";



const rootReducer = combineReducers({
  login: LoginReducer,
  root : TeRootReducer,


  
});
export default rootReducer;
