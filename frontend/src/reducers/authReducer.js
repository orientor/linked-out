import {
  SET_CURRENT_USER,
  USER_LOADING,
  SET_JOB
} from "../actions/types";
const isEmpty = require("is-empty");
const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false
};
const authReducer= function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
	  const xds = action.payload;
	  console.log("XDS");
	  console.log(xds);
	  if("type" in action.payload)
	  {

	  }
	  else
	{
		action.payload.type = -1;
	}
      return {
        ...state,
        isAuthenticated: ("name" in action.payload),
        user: xds,
		type: action.payload.type
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
	case SET_JOB:
		return {
		  ...state,
		   job: action.payload
		}
    default:
      return state;
  }
}
export default authReducer;
