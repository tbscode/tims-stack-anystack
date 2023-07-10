import "@/styles/globals.css";
import "@/styles/tailwindSSR.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { wrapper, store } from "../store/store";
import { Provider, useSelector } from "react-redux";
import {
  ConnectionBanner,
  connectionStateAndUserData,
} from "@/components/connection-banner";
import { MainNavigation } from "@/components/navigation-bar";
import { useDispatch } from "react-redux";
import { DEVICE_STATE } from "@/store/types";
import { BannerState } from "@/components/connection-banner";
import { CONNECTION_STATE, USER_DATA, USER_PROFILE } from "@/store/types";
import { updateBaseData } from "@/utils/tools";

import { useState, useEffect } from "react";
import Router from 'next/router';



const NO_NAVIGATION_ROUTES = ["/login"];

function App({ Component, pageProps }: AppProps) {
  const deviceState = useSelector((state: any) => state.device);
  const width = useSelector((state: any) => state.device.width);
  const frontendSettings = useSelector((state: any) => state.frontendSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  const router = useRouter();
  const dispatch = useDispatch();
  

  console.log("PAGE PROPS", pageProps);

  useEffect(() => {
    if ("data" in pageProps) {
      if ("profile" in pageProps.data) {
        // also automaticly means that we are online and rot required to conncet, dispath connection to be online!
        console.log("PROFILE", pageProps.data.profile);
        dispatch(updateBaseData(pageProps.data));
        dispatch({type: CONNECTION_STATE, payload: {state: BannerState.online}});
      }
    }
    setFirstRender(false)
  }, []);
  
  useEffect(() => {
    const routeEventStart = () => {
      setIsLoading(false);
    };
    const routeEventEnd = () => {
      setIsLoading(true);
    };

    Router.events.on('routeChangeStart', routeEventStart);
    Router.events.on('routeChangeComplete', routeEventEnd);
    Router.events.on('routeChangeError', routeEventEnd);
    return () => {
      Router.events.off('routeChangeStart', routeEventStart);
      Router.events.off('routeChangeComplete', routeEventEnd);
      Router.events.off('routeChangeError', routeEventEnd);
    };
  }, []);

  function handleWindowSizeChange() {
    const width = window.innerWidth;
    dispatch({
      type: DEVICE_STATE,
      payload: {
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile768: width <= 768,
        isDesktopLandScape: width > 1024,
      },
    });
  }

  useEffect(() => {
    handleWindowSizeChange();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [width]);

  return (
    <Provider store={store}>
      <div data-theme={frontendSettings?.theme}>
        {NO_NAVIGATION_ROUTES.includes(router.pathname) ? (
          <Component />
        ) : (
          <MainNavigation>
            <Component />
          </MainNavigation>
        )}
        {!firstRender && <ConnectionBanner />}
      </div>
    </Provider>
  );
}

export default wrapper.withRedux(App);
