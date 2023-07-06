import { USER_DATA } from "../types";

const initialState = {
  loading: true,
};

export default function (state = initialState, action) {
  console.log("action user data state", action);
  switch (action.type) {
    case USER_DATA:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
