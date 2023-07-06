import { FRONTEND_SETTINGS } from "../types";

const initialState = {
  loading: true,
  theme: "dark",
  mainNavigationHidden: false,
  mainNavigationTranslucent: false,
  mainNavigationbarLinksCollapsible: false,
  mainNavigationbarMarginContainer: false,
};

export default function (state = initialState, action) {
  console.log("action device state", action);
  switch (action.type) {
    case FRONTEND_SETTINGS:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
