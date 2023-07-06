import { DEVICE_STATE, USER_PROFILE } from "../types";

const initialState = {
  loading: true,
};

export default function (state = initialState, action) {
  console.log("action device state", action);
  switch (action.type) {
    case USER_PROFILE:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
