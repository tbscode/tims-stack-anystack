import React, { useState, useCallback, useEffect } from "react";
import { getCookiesAsObject, getEnv, updateBaseData } from "@/utils/tools";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { CONNECTION_STATE, USER_DATA, USER_PROFILE } from "@/store/types";
import useWebSocket, { ReadyState } from "react-use-websocket";

export enum BannerState {
  idle = "idle",
  online = "online",
  offline = "offline",
  offlineCache = "offlineCache",
  error = "error",
  loading = "loading",
  unauthenticated = "unauthenticated",
}

export enum WebsocketMessageEnum {
  connection_info = "connection_info",
  reducer_update = "reducer_update",
}

interface BannerInfo {
  state: BannerState;
  backgroundColor: string;
  textColor: string;
  text: string;
  visible: boolean;
}

export const bannerInfoMap: Record<BannerState, BannerInfo> = {
  [BannerState.idle]: {
    state: BannerState.idle,
    backgroundColor: "bg-green-500",
    textColor: "text-white",
    text: "Idle",
    visible: false,
  },
  [BannerState.online]: {
    state: BannerState.online,
    backgroundColor: "bg-green-500",
    textColor: "text-white",
    text: "Online",
    visible: true,
  },
  [BannerState.offline]: {
    state: BannerState.offline,
    backgroundColor: "bg-red-500",
    textColor: "text-white",
    text: "Offline",
    visible: true,
  },
  [BannerState.unauthenticated]: {
    state: BannerState.unauthenticated,
    backgroundColor: "bg-red-500",
    textColor: "text-white",
    text: "Unauthenticated",
    visible: true,
  },
  [BannerState.offlineCache]: {
    state: BannerState.offlineCache,
    backgroundColor: "bg-red-500",
    textColor: "text-white",
    text: "Offline - Using cache",
    visible: true,
  },
  [BannerState.error]: {
    state: BannerState.error,
    backgroundColor: "bg-red-500",
    textColor: "text-white",
    text: "Offline",
    visible: true,
  },
  [BannerState.loading]: {
    state: BannerState.loading,
    backgroundColor: "bg-blue-500",
    textColor: "text-white",
    text: "Loading...",
    visible: true,
  },
};

interface ConnectionBannerProps {
  bannerState: BannerState;
}

const getConnectionState = (state) => {
  console.log("STATE", state);
  if (state === undefined || state.state === undefined)
    return BannerState.loading;

  // default state offline ( reload anytime, todo maybe autoreload after some time )
  return state.state;
};

interface ConnectionState {
  userData: any;
  state: BannerState;
  info: any;
  isNative: boolean;
}

export const connectionStateAndUserData = async ({
  state, 
  userData
}) => {
  let connectionState: ConnectionState = {
    userData: {},
    state: BannerState.offline,
    isNative: Capacitor.isNativePlatform(),
    info: {},
  };
  let updatedUserData = userData;

  if (typeof window === "undefined") {
    // then we are still on serverside
    return connectionState;
  }

  console.log("STATE XY", state);
  console.log("COOKIES", getCookiesAsObject());
  
  console.log("C BAN", userData, !(userData && ('uuid' in userData)));

  if (!(userData && ('uuid' in userData))) {
    console.log("COOKIES", getCookiesAsObject());
    try {
      console.log("PROFILE PRE FETCH", userData);
      const res = await fetch(`${getEnv().serverUrl}/api/user_data`, {
        method: "GET",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCookiesAsObject().csrftoken,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        updatedUserData = data;
        connectionState.state = BannerState.online;
        connectionState.info = "Online, data updated";
        Preferences.set({
          key: "data",
          value: JSON.stringify({ ...userData, ...data }),
        });
      } else if (res.status === 401 || res.status === 403) {
        connectionState.state = BannerState.unauthenticated;
        connectionState.info = `Offline, not logged in ${res.status} ${res.statusText}`;
        console.log("FETCHDATA", "unauthenticated", res.status, res.statusText);
      } else {
        connectionState.state = BannerState.error;
        connectionState.info = `Offline, error unknown reason ${res.status} ${res.statusText}`;
        console.log("FETCHDATA", "error", connectionState.info);
      }
    } catch (err) {
      console.log("C BAN", "error", err);
      try {
        const { value } = await Preferences.get({ key: "data" });

        if (value !== null) {
          updatedUserData = JSON.parse(value);
          connectionState.state = BannerState.offlineCache;
          connectionState.info = "Offline, using cached data";
        } else {
          connectionState.state = BannerState.error;
          connectionState.info = `Offline, no cached data found. ${err}`;
        }
      } catch (error) {
        console.log("Error reading from cache:", error);
      }
    }
  } else {
    console.log("PROFILE PRE STATE",state, userData);
    if (
      !(state.state === undefined) &&
      (state.state === BannerState.unauthenticated)
    ) {
      connectionState.state = BannerState.unauthenticated;
      connectionState.info = `Offline, not logged in ${res.status} ${res.statusText}`;
    } else {
      // Then we should be online alreadychat
      connectionState.state = BannerState.online;
      connectionState.info = "Online, data loaded";
      Preferences.set({ key: "data", value: JSON.stringify(userData) });
    }
  }

  return {connectionState, userData: updatedUserData};
};

export const ConnectionBanner: React.FC = () => {
  /**
   * Takes the application state and determines the banner state,
   * this heavily relies on the logic of /front/utils/tools.tsx:fetchDataOrLoadCache
   * if error, offline or loading a banner will be shown with some message
   * if idle the banner will be hidden
   *
   * when in online state automatically switch to 'idle' after 10 seconds
   */
  const currentConnectionState = useSelector((state: any) => state.connection);
  const userData = useSelector((state: any) => state.userData);
  const router = useRouter();
  const dispatch = useDispatch();

  const updateConnectionState = () => {
    if (
      currentConnectionState.state === undefined ||
      currentConnectionState.state !== BannerState.unauthenticated
    ) {
      const connectionState = connectionStateAndUserData({
        state: currentConnectionState,
        userData,
      }).then(({
        connectionState, 
        userData
      }) => {
        console.log("CONNECTION STATE", connectionState);
        if (connectionState.state === "unauthenticated") {
          dispatch({ type: CONNECTION_STATE, payload: connectionState });
          router.push("/login");
        } else {
          console.log("SETTING PAGE STATE", connectionState);
          dispatch({ type: CONNECTION_STATE, payload: connectionState });
          dispatch(updateBaseData(userData));
        }
      });
    }
  };

  useEffect(() => {
    updateConnectionState();
  }, []);
  return (
    <ConnectionBannerDispatch
      bannerState={getConnectionState(currentConnectionState)}
    />
  );
};

const WebsocketBridge = () => {
  /**
   * Establishes a default websocket bridge between server and client
   */
  const env = getEnv();

  const dispatch = useDispatch();

  const [socketUrl, setSocketUrl] = useState(env.wsPath);
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
      const message = JSON.parse(lastMessage.data);
      console.log("MESSAGE RECEIVED", message);
      if (message.event === "reduction") {
        dispatch({
          type: message.payload.action,
          payload: message.payload.payload,
        });
      }
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl(env.wsPath),
    [],
  );

  const handleClickSendMessage = useCallback(() => sendMessage("Hello"), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];
  console.log("SOCKET LOADED", connectionStatus);

  return <>{connectionStatus}</>;
};

const ConnectionBannerDispatch: React.FC<ConnectionBannerProps> = ({
  bannerState,
}) => {
  // Add any required side effects based on the bannerState prop
  console.log("BANNERSTATE", bannerState);
  const [currentBannerState, setCurrentBannerState] =
    useState<BannerState>(bannerState);
  const currentBannerInfo = bannerInfoMap[currentBannerState];

  const userData = useSelector((state: any) => state.userData);

  const idleTimeout = 2000;
  useEffect(() => {
    // Your side effect logic here
    setCurrentBannerState(bannerState);
    if (bannerState === BannerState.online) {
      console.log("ONINESTATE", "preparint to switch after timeout");

      const timeoutId = setTimeout(() => {
        console.log("TIMEOUT OVER");
        setCurrentBannerState(BannerState.idle);
      }, idleTimeout);

      return () => clearTimeout(timeoutId);
    }
  }, [bannerState]);

  return (
    <div
      className={`fixed bottom-0 left-0 w-full z-50 ${
        currentBannerInfo.backgroundColor
      } transition-all duration-500 ${
        currentBannerInfo.visible ? "transform h-6 p-1" : "transform h-2"
      }`}
    >
      <span className={currentBannerInfo.textColor}>
        {currentBannerInfo.text}
      </span>
      <div>
        {(currentBannerState === BannerState.online ||
          currentBannerState == BannerState.idle) &&
          !userData.loading && <WebsocketBridge></WebsocketBridge>}
      </div>
    </div>
  );
};
