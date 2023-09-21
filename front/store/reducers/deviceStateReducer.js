import { DEVICE_STATE } from "../types";

const initialState = {
  loading: true,
  width: 2048,
  height: 2048,
  isNative: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case DEVICE_STATE:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
