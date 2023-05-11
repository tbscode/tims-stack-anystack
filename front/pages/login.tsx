import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { useState, useEffect } from 'react';


export const getCookiesAsObject = () => {
  // stolen: https://stackoverflow.com/a/64472572
  return Object.fromEntries(
    document.cookie
      .split('; ')
      .map(v => v.split(/=(.*)/s).map(decodeURIComponent)),
  );
};

export const NOgetServerSideProps = async ({req} : {req: any}) => {
  if (req.method == "POST") {
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
    return { props: { data: JSON.parse(res) } };
  }
  return { props: {} };
};

const fetchDataOrLoadCache = ({ state, setStateData }) => {
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
  if (!Capacitor.isNativePlatform()) {
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
          setStateData(s => ({...s, device: {...s.device, isCapacitorNative: true},data: data}))
        })
      }else{
        // TODO: if this is some sort of timeout error we should display a 'offline' banner
        // On other erros ofcourse we should display a 'something went wrong' banner
        console.log("RES NOT OK", res)
        if(res.status == 401 || res.status == 403){
          // then we are not logged in
        }
      }
    })

  }else{
    // web app, then the state should be automaticly populated
  }
}

export default function Index({ state, setStateData, updateTheme }): JSX.Element {
  //hello alter
  console.log("STATE", state);
  
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })
  
  const loginRequest = () => {
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookiesAsObject().csrftoken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    }).then((res) => {
      if(res.ok){
        window.location.href = "/";
      }
    })
  }


  return (<>
    <input type="text" placeholder="username" className="input w-full max-w-xs" onChange={(e) => {
      setLoginData(s => ({...s, username: e.target.value})) 
    }} />
    <input type="password" placeholder="password" className="input w-full max-w-xs" onChange={(e) => {
      setLoginData(s => ({...s, password: e.target.value})) 
    }} />
    <button className="btn" onClick={loginRequest}>Login</button>
  </>);
}
