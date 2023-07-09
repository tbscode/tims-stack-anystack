import { MESSAGES, MESSAGES_RECEIVE, defaultPaginatedObject } from "../types";

const initialState = {
  loading: true,
  messages: {
    empty: [],
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case MESSAGES:
      return {
        ...state,
        messages: {...state.messages, ...action.payload},
        loading: false,
      };
    case MESSAGES_RECEIVE:
      // In this case we expect chat_uuid and messages to be part of the redux call
      console.log("STATE CUR", state, action);
      state.messages[action.payload.chat_uuid].results = [
        ...action.payload.messages,
        ...state.messages[action.payload.chat_uuid].results,
      ];
      return { ...state };
    default:
      return state;
  }
}
