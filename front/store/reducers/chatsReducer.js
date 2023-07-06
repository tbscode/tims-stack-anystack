import { defaultPaginatedObject, CHATS } from "../types";

const initialState = {
  loading: true,
  ...defaultPaginatedObject,
};

export default function (state = initialState, action) {
  console.log("action device state", action);
  switch (action.type) {
    case CHATS:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
