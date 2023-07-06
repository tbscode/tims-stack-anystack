import { CONNECTION_STATE } from "../types";
import { BannerState, bannerInfoMap } from "@/components/connection-banner";

const initialState = {
  loading: true,
  state: BannerState.idle,
  info: bannerInfoMap[BannerState.idle],
  isNative: undefined,
};

export default function (state = initialState, action) {
  console.log("action", action);
  switch (action.type) {
    case CONNECTION_STATE:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
