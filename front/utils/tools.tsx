// (c) Copyright Tim Schupp (Tim Benjamin Software) 2023
// tooling to build auto checking if on mobile and preference storage loading if offline
// basic functionality to turn any nextjs project in a hybrid-native cross plattfor application without major modifications
import { Inter } from 'next/font/google'
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export const handleStreamedProps = ({req}) => {
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

export const fetchDataOrLoadCache = ({ state, setState }) => {
 /**
  *  There are multiple different env scenarios:
  *  1. this is deployed as a web-app and the {state} is already automaticly populated when the page is first rendered
  *  2. this is deployed as a mobile application and the {state} is not initally populated but needs to be fetched from the server
  *  3. this is a mobile application but is not surrently connected to the internet, we should try to load data from local storage and display an 'offline' banner
  * */ 
  if(typeof window === 'undefined'){
    // then we are still on serverside   
    return
  }
  if (Capacitor.isNativePlatform()) {
    if(state.data === undefined){
      fetch('/api/user_data', {
        method: 'GET',
        headers: {
          'X-CSRFToken': getCookiesAsObject().csrftoken,
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        if(res.ok){
          // the populate the state
          // TODO: handle json parse errors
          res.json().then((data) => {
            setState(s => ({...s, device: {...s.device, isCapacitorNative: true, internetConnection: true}, data: data}))
          })
        }else{
          // TODO: if this is some sort of timeout error we should display a 'offline' banner
          // On other erros ofcourse we should display a 'something went wrong' banner
          console.log("RES NOT OK", res)
          if(res.status == 401 || res.status == 403){
            // then we are not logged in
            // TODO: this could also possibly be made a non reloading redirect 
            window.location.href = "/login";
          }
        }
      }).catch((error) => {
       // most likely a network error occurred and we are offline
        if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
          // we have no internet connection
          // in that case load the previous state from capacitor preferences, and attach the 'internetConnection' : false state
          Preferences.get({ key: 'data' }).then(({value}) => {
            if(value === null){
              // TODO: translate all them strings
              setState(s => ({...s, device: {...s.device, isCapacitorNative: true, internetConnection: false}, frontError: "No data present in offline storage"}))
            }else{
              setState(s => ({...s, device: {...s.device, isCapacitorNative: true, internetConnection: false}, data: JSON.parse(value)}))
            }
          })
        } else {
          // A unknown error occured
          setState(s => ({...s, device: {...s.device, isCapacitorNative: true}, frontError: error}))
        }
      })
    }
  }else{
    // web app, then the state should be automaticly populated
    // if the user is not authenticated the backend will request a redirect with the 'redirect' property
    if(!(state.data === undefined) && !(state.data.redirect === undefined)){
      // TODO: this could also be a non-reloading redirect
      window.location.href = state.data.redirect;
    }
    console.log("IN WEB APP", state)
  }
}