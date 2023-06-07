import Image from 'next/image'
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google'
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { useState, useEffect } from 'react';
import { getCookiesAsObject, getEnv } from '@/utils/tools';
import { ConnectionBanner, connectionStateAndUserData } from "../components/connection-banner";


export const getServerSideProps = async ({req} : {req: any}) => {
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

export default function Index({ pageState, setPageState, updateTheme }): JSX.Element {
  //hello alter
  const router = useRouter();
  
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })

  // TODO: setup some logig to initalize redux store with data from server
  const [state, setState] = useState(pageState);
  console.log("STATE", state);
  
  useEffect(() => {
    const connectionState = connectionStateAndUserData({state}).then((connectionState) => {
      console.log("CONNECTION STATE", connectionState);
      if(connectionState.state === "unauthenticated"){
        //router.push("/login");
      }else{
        console.log("SETTING PAGE STATE", connectionState);
        setPageState(s => ({...s, ...connectionState}));
        setState(s => ({...s, ...connectionState}));
        router.push("/");
      }
  
    })
  }, []);
  
  const loginRequest = () => {
    fetch(`${getEnv().serverUrl}/api/login`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookiesAsObject().csrftoken,
      'Content-Type': 'application/json',
        Accept: 'application/json, text/html, */*'
      },
      body: JSON.stringify(loginData)
    }).then((res) => {
      console.log("RES LOGIN", res)
      if(res.ok){
        console.log("REDIRECTING")
        router.push("/")
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
    <ConnectionBanner state={state} />
  </>);
}
