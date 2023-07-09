// (c) Copyright Tim Schupp (Tim Benjamin Software) 2023
// tooling to build auto checking if on mobile and preference storage loading if offline
// basic functionality to turn any nextjs project in a hybrid-native cross plattfor application without major modifications
import { Inter } from 'next/font/google'
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { useRouter } from 'next/router';
import { CapacitorCookies } from '@capacitor/core';
import {MESSAGES_RECEIVE_CURRENT_CHAT ,MESSAGES_RECEIVE,USER_DATA, USER_PROFILE, MESSAGES, CHATS, CONNECTION_STATE } from '@/store/types';
import { useDispatch } from 'react-redux';

export function updateBaseData(baseData : any) {
  return dispatch => {
      let data = baseData;

      dispatch({type: USER_PROFILE, payload: data.profile})
      dispatch({type: MESSAGES, payload: data.messages})
      dispatch({type: CHATS, payload: data.chats})
      if('connection' in data){
        dispatch({type: CONNECTION_STATE, payload: data.connection})
        delete data.connection
      }

      delete data.profile
      delete data.messages
      delete data.chats

      dispatch({type: USER_DATA, payload: data})
  }
}

export const receiveMessage = (messages, chat_uuid, selected, postRun = () => {}) => {
  return dispatch => {
      dispatch({
        type: MESSAGES_RECEIVE,
        payload: { messages, chat_uuid }
      });

      if(selected) {
        dispatch({
          type: MESSAGES_RECEIVE_CURRENT_CHAT, 
          payload: { messages }});
      }
      postRun();
  }  
}

export async function handleStreamedProps({req}){
    const streamPromise = new Promise( ( resolve, reject ) => {
        let body = ''
        req.on('data', (chunk : any) => {
          body += chunk
        })
        req.on('end', () => {
          console.log(body);
          resolve(body)
        });
    } );
    const res = await streamPromise;
    if (typeof res !== "string") throw new Error("Not a string")
    return res
}

export const getCookiesAsObject = () => {
  // stolen: https://stackoverflow.com/a/64472572
  return Object.fromEntries(
    document.cookie
      .split('; ')
      .map(v => v.split(/=(.*)/s).map(decodeURIComponent)),
  );
};

interface Environment {
  wsPath: string;
  serverUrl: string;
}

const getServerUrl = () => {
  if(process.env.NEXT_PUBLIC_LOCAL_MICROK8S === "true"){
    if(Capacitor.isNativePlatform())
      return process.env.NEXT_PUBLIC_HOST_MICROK8S_ANDROID!
    return process.env.NEXT_PUBLIC_HOST_MICROK8S_WEB!
  }else{
    if(Capacitor.isNativePlatform())
      return process.env.NEXT_PUBLIC_HOST_ANDROID!
    return process.env.NEXT_PUBLIC_HOST_WEB!
  }
}

const getWebsocketUrl = () => {
  if(process.env.NEXT_PUBLIC_LOCAL_MICROK8S === "true"){
    if(Capacitor.isNativePlatform())
      return process.env.NEXT_PUBLIC_WS_PATH_ANDROID!
    return process.env.NEXT_PUBLIC_WS_PATH!
  }else{
    if(Capacitor.isNativePlatform())
      return process.env.NEXT_PUBLIC_WS_PATH_ANDROID!
    return process.env.NEXT_PUBLIC_WS_PATH!
  }
}

export const getEnv = () => {
  const env : Environment = {
    wsPath: getWebsocketUrl(),
    serverUrl: getServerUrl(),
  }
  console.log("ENV", env);
  return env
}

export const ALL_THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];