import Image from 'next/image'
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google'
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { useState, useEffect } from 'react';
import { getCookiesAsObject, getEnv } from '@/utils/tools';
import { ConnectionBanner, connectionStateAndUserData } from "../components/connection-banner";
import { useSelector, useDispatch } from 'react-redux';
import { CONNECTION_STATE } from '@/store/types';
import { BannerState } from '../components/connection-banner';

export const getServerSidePropsNo = async ({req} : {req: any}) => {
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

const LoginHero = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  
  const [loginData, setLoginData] = useState({
    username: 'testUser1',
    password: 'Test123!'
  })

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
        dispatch({
          type: CONNECTION_STATE,
          payload: {
            state: BannerState.idle
          }
        })
        router.push("/")
      }
    })
  }

  return <div className="hero min-h-screen bg-base-200">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <div className="text-center lg:text-left w-96">
      <span className='text-7xl font-bold [&::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,hsl(var(--s))_0%,hsl(var(--sf))_9%,hsl(var(--pf))_42%,hsl(var(--p))_47%,hsl(var(--a))_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&::selection]:bg-blue-700/20 [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,hsl(var(--s))_4%,color-mix(in_oklch,hsl(var(--sf)),hsl(var(--pf)))_22%,hsl(var(--p))_45%,color-mix(in_oklch,hsl(var(--p)),hsl(var(--a)))_67%,hsl(var(--a))_100.2%)]'>
        Tim&apos;s Stack
      </span>
      <p className="py-6">
        Tim Schupps submission to the bunnyshell.com hackathon. <br></br>
        Try it out now! Login data for the test user is filled, just click &apos;login-in&apos;!
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
              setLoginData(s => ({...s, username: e.target.value})) 
            }}/>
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
              setLoginData(s => ({...s, password: e.target.value})) 
            }}/>
          <label className="label">
            <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
          </label>
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary" onClick={loginRequest}>Login</button>
        </div>
      </div>
    </div>
  </div>
</div>
}

export default function Index(): JSX.Element {

  return <LoginHero />
  
  (<>
    <input type="text" placeholder="username" className="input w-full max-w-xs" onChange={(e) => {
    }} />
    <input type="password" placeholder="password" className="input w-full max-w-xs" onChange={(e) => {
      setLoginData(s => ({...s, password: e.target.value})) 
    }} />
  </>);
}
