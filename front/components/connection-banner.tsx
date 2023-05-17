import React, { useState, useEffect } from "react";

enum BannerState {
    idle = "idle",
    online = "online",
    offline = "offline",
    error = "error",
    loading = "loading",
}

interface BannerInfo {
    state: BannerState;
    backgroundColor: string;
    textColor: string;
    text: string;
    visible: boolean;
}

const bannerInfoMap: Record<BannerState, BannerInfo> = {
    [BannerState.idle]: {
        state: BannerState.idle,
        backgroundColor: "bg-blue-500",
        textColor: "text-white",
        visible: false,
        text: "Idle",
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
    // a frontend error occured, render the error ...
    if (state.frontendError !== undefined)
      return BannerState.error;
  
    // device is net yet defined, so the render is ongoing or we are on mobile
    if (state.device === undefined)
      return BannerState.loading;
  
    // the internet connection and data are still undefined, definately still loading...
    if (
      state.device.internetConnection === undefined &&
      state.data === undefined
    ) {
      return BannerState.loading;
    }
  
    // internet connection available and data defined -> we are online and loaded!
    if (state.device.internetConnection || state.data !== undefined)
      return BannerState.online;
  
    // default state offline ( reload anytime, todo maybe autoreload after some time )
    return BannerState.offline;
  };
  
export const ConnectionBanner: React.FC = ({state}) => {
    /** 
     * Takes the application state and determines the banner state,
     * this heavily relies on the logic of /front/utils/tools.tsx:fetchDataOrLoadCache
     * if error, offline or loading a banner will be shown with some message
     * if idle the banner will be hidden
     * 
     * when in online state automatically switch to 'idle' after 10 seconds
     */
    return <ConnectionBannerDispatch bannerState={getConnectionState(state)} />;
}
const ConnectionBannerDispatch: React.FC<ConnectionBannerProps> = ({ bannerState }) => {
    // Add any required side effects based on the bannerState prop
    console.log("BANNERSTATE", bannerState)
    const [currentBannerState, setCurrentBannerState] = useState<BannerState>(bannerState);
    const currentBannerInfo = bannerInfoMap[currentBannerState];

    const idleTimeout = 2000;
    useEffect(() => {
        // Your side effect logic here
        setCurrentBannerState(bannerState);
        if (bannerState === BannerState.online) {
            console.log("ONINESTATE", "preparint to switch after timeout")

          const timeoutId = setTimeout(() => {
              console.log("TIMEOUT OVER");
              setCurrentBannerState(BannerState.idle);
          }, idleTimeout);

          return () => clearTimeout(timeoutId);
        }
    }, [bannerState]);
    

    return (
      <div
        className={`fixed bottom-0 left-0 w-full h-8 z-50 p-2 ${currentBannerInfo.backgroundColor} duration-500 ${currentBannerInfo.visible ? 'transform' : 'transform translate-y-full'}`}
      >
        <span className={currentBannerInfo.textColor}>
          {currentBannerInfo.text}
        </span>
      </div>
    );
};