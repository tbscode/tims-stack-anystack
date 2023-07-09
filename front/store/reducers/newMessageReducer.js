import { NEW_MESSAGES } from "../types";

const initialState = {
  loading: true,
  messages: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case NEW_MESSAGES:
      const allMessages = action.payload.messages.concat(state.messages);
      const uniqueNewMessages = Array.from(new Set(allMessages.map(a => a.id))).map(id => {
        return allMessages.find(a => a.id === id)
      });
      console.log("NEW MESSAGES", uniqueNewMessages);
      return {
        ...state,
        ...action.payload,
        messages: uniqueNewMessages,
        loading: false,
      };
    default:
      return state;
  }
}
