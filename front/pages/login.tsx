import Image from "next/image";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";
import { useState, useEffect } from "react";
import {
  handleStreamedProps,
  getCookiesAsObject,
  getEnv,
  updateBaseData,
  ALL_THEMES
} from "@/utils/tools";
import {
  ConnectionBanner,
  connectionStateAndUserData,
} from "../components/connection-banner";
import { useSelector, useDispatch } from "react-redux";
import { CONNECTION_STATE, USER_DATA, USER_PROFILE, FRONTEND_SETTINGS } from "@/store/types";
import { BannerState } from "../components/connection-banner";

export const getServerSideProps = async ({ req }: { req: any }) => {
  if (req.method == "POST") {
    const res = await handleStreamedProps({ req });
    console.log("RES", res);
    return { props: { data: JSON.parse(res), dataLog: { pulled: true } } };
  }
  return { props: { dataLog: { pulled: false } } };
};

const LoginHero = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const frontendSettings = useSelector((state: any) => state.frontendSettings);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "testUser1",
    password: "Test123!",
  });

  const loginRequest = () => {
    setLoadingLogin(true);
    fetch(`${getEnv().serverUrl}/api/login`, {
      method: "POST",
      headers: {
        "X-CSRFToken": getCookiesAsObject().csrftoken,
        "Content-Type": "application/json",
        Accept: "application/json, text/html, */*",
      },
      body: JSON.stringify(loginData),
    }).then((res) => {
      console.log("RES LOGIN", res);
      if (res.ok) {
        console.log("REDIRECTING");
        dispatch({
          type: CONNECTION_STATE,
          payload: {
            state: BannerState.idle,
          },
        });
        res.json().then((data) => {
          setLoadingLogin(false);
          dispatch(updateBaseData(data));
          router.push("/");
        });
      }else{
        setLoadingLogin(false);
      }
    });
  };
  
  const cs = "w-32 h-32"

  return (<>
    <div className="w-full flex flex-row absolute items-center justify-center p-8 overflow-x-auto">
    <div className="p-8 bg-neutral-content text-neutral rounded-xl rounded-xl">
        <img className={cs} src="https://nodejs.org/static/images/logo.svg" alt="Node.js logo"/>
        <h2>Node.js</h2>
        <p>Version: 18</p>
    </div>
    <div className="ml-8 p-8 bg-success-content rounded-xl">
        <img className={cs} src="https://www.postgresql.org/media/img/about/press/elephant.png" alt="PostgreSQL logo"/>
        <h2>PostgreSQL</h2>
        <p>Version: 15.2</p>
    </div>
    <div className="bg-neutral-focus h-52 p-8 flex flex-col rounded-xl ml-8 content-center justify-center">
        <img className={`${cs} w-auto h-14`} src="https://raw.githubusercontent.com/redis/redis-io/master/public/images/redis-white.png" alt="Redis logo"/>
        <h2>Redis</h2>
        <p>Version: 6.2</p>
    </div>
    <div className="bg-primary-content p-8 rounded-xl ml-8">
        <img className={cs} src="https://static.djangoproject.com/img/logos/django-logo-positive.svg" alt="Django logo"/>
        <h2>Django</h2>
        <p>Version: 4.1.2</p>
    </div>
  </div>
    <div className="w-full flex flex-row absolute items-center justify-center p-8 overflow-x-auto bottom-0">
      <div className="bg-neutral-focus h-52 p-8 flex flex-col rounded-xl ml-8 content-center justify-center">
          <img className={`${cs} w-auto h-20`} src="https://raw.githubusercontent.com/reduxjs/redux/master/logo/logo.svg" alt="Redux logo"/>
          <h2>Redux</h2>
          <p>Version: 8.1.1</p>
      </div>
      <div className="bg-neutral-focus h-52 p-8 flex flex-col rounded-xl ml-8 content-center justify-center">
          <img className={`${cs} w-20 h-20`} src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png" alt="React logo"/>
          <h2>React</h2>
          <p>Version: 18.2.0</p>
      </div>
  </div>
    <div className="h-full flex flex-col absolute items-center justify-center p-8 overflow-x-auto bottom-0 right-0">
      <div className="bg-neutral-focus h-fit p-8 flex flex-col rounded-xl ml-8 content-center justify-center">
          <img className={`${cs} w-auto h-20`} src="https://daisyui.com/images/daisyui-logo/daisyui-logomark.svg" alt="Redux logo"/>
          <h2>DasyUI</h2>
          <p>Version: 3.2.1</p>
          <p>Theme: {frontendSettings.theme}</p>
          <button className="btn btn-xl bg-accent text-accent-focus" onClick={() => {
            const randomTheme = ALL_THEMES[Math.floor(Math.random() * ALL_THEMES.length)];
            dispatch({
              type: FRONTEND_SETTINGS,
              payload: { theme: randomTheme },
            });
          }}> Random Theme </button>
          <button className="btn btn-xl bg-error" onClick={() => {
            dispatch({
              type: FRONTEND_SETTINGS,
              payload: { theme: "dark" },
            });
          }}> Reset </button>
      </div>
  </div>
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left w-96 bg-neutral p-4 rounded-xl">
          <span className="text-7xl font-bold [&::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,hsl(var(--s))_0%,hsl(var(--sf))_9%,hsl(var(--pf))_42%,hsl(var(--p))_47%,hsl(var(--a))_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&::selection]:bg-blue-700/20 [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,hsl(var(--s))_4%,color-mix(in_oklch,hsl(var(--sf)),hsl(var(--pf)))_22%,hsl(var(--p))_45%,color-mix(in_oklch,hsl(var(--p)),hsl(var(--a)))_67%,hsl(var(--a))_100.2%)]">
            Tim&apos;s Stack
          </span>
          <p className="py-6">
            Tim Schupps submission to the bunnyshell.com hackathon. <br></br>
            Try it out now! Login data for the test user is filled, just click
            &apos;login-in&apos;!
          </p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="text"
                placeholder="email"
                className="input input-bordered"
                value={loginData.username}
                onChange={(e) => {
                  setLoginData((s) => ({ ...s, username: e.target.value }));
                }}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                value={loginData.password}
                onChange={(e) => {
                  setLoginData((s) => ({ ...s, password: e.target.value }));
                }}
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary" onClick={loginRequest}>
                Login
                {loadingLogin && <span className="loading loading-spinner loading-md"></span>}
              </button>
              <span className="text-cs"> ( the compose chat with posgress db included will generate test users and migrate db on first login so might take a little ) </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default function Index(): JSX.Element {
  return <LoginHero />;
}
