// (c) Copyright Tim Schupp (Tim Benjamin Software) 2023
// tooling to build auto checking if on mobile and preference storage loading if offline
// basic functionality to turn any nextjs project in a hybrid-native cross plattfor application without major modifications
import { Inter } from 'next/font/google'
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { useRouter } from 'next/router';

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

export const getEnv = () => {
  const env : Environment = {
    wsPath: process.env.NEXT_PUBLIC_WS_PATH!,
    serverUrl: getServerUrl(),
  }
  console.log("ENV", env);
  return env
}