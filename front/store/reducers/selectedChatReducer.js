import { MESSAGES_RECEIVE_CURRENT_CHAT, SLECTED_CHAT, defaultPaginatedObject } from "../types";

const initialState = {
  loading: true,
  chat: {},
  messages: defaultPaginatedObject,
};

export default function (state = initialState, action) {
  console.log("action device state", action);
  switch (action.type) {
    case SLECTED_CHAT:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case MESSAGES_RECEIVE_CURRENT_CHAT:
      console.log("UPDATED SELECT CHAT", action.payload)
      const allMessages = action.payload.messages.concat(state.messages.results)
      state.messages.results = Array.from(new Set(allMessages.map(m => m.uuid))).map(uuid => {
        return allMessages.find(m => m.uuid === uuid)
      });
      console.log("UPDATED RES", state.messages.results, Array.from(new Set(allMessages.map(m => m.uuid))));
      return { ...state };
    default:
      return state;
  }
}
