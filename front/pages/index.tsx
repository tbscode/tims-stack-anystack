import Image from 'next/image'
import { useRouter } from 'next/router';
import { handleStreamedProps, getCookiesAsObject, fetchDataOrLoadCache } from "../utils/tools";
import React, { useState, useEffect } from "react";
import { ConnectionBanner, connectionStateAndUserData } from "../components/connection-banner";




export const NOgetServerSideProps = async ({req} : {req: any}) => {
  if (req.method == "POST") {
    const res = await handleStreamedProps({req})
    console.log("RES", res)
    return { props: { data: JSON.parse(res), dataLog: {pulled: true} } };
  }
  return { props: { dataLog: {pulled: false}} };
};

const NavBar = ({children}) => {
  return (<div className="drawer">
  <input id="my-drawer-3" type="checkbox" className="drawer-toggle" /> 
  <div className="drawer-content flex flex-col">
    <div className="w-full navbar bg-base-300">
      <div className="flex-none lg:hidden">
        <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </label>
      </div> 
      <div className="flex-1 px-2 mx-2">Navbar Title</div>
      <div className="flex-none hidden lg:block">
        <ul className="menu menu-horizontal">
          <li><a>Navbar Item 1</a></li>
          <li><a>Navbar Item 2</a></li>
        </ul>
      </div>
    </div>
    Content
    {children}
  </div> 
  <div className="drawer-side">
    <label htmlFor="my-drawer-3" className="drawer-overlay"></label> 
    <ul className="menu p-4 w-80 bg-base-100">
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
      
    </ul>
    
  </div>
</div>)
}


export default function Index({ pageState, setPageState, updateTheme }): JSX.Element {
  const router = useRouter();
  // TODO: setup some logig to initalize redux store with data from server
  const [state, setState] = useState(pageState);
  
  useEffect(() => {
    const connectionState = connectionStateAndUserData({state}).then((connectionState) => {
      console.log("CONNECTION STATE", connectionState);
      if(connectionState.state === "unauthenticated"){
        router.push("/login");
      }else{
        console.log("SETTING PAGE STATE", connectionState);
        setPageState(s => ({...s, ...connectionState}));
        setState(s => ({...s, ...connectionState}));
      }
  
    })
  }, []);
  
  console.log("STATE", JSON.stringify(state));

  return (<>
    <NavBar>
      <div style={{scrollBehavior: 'smooth', scrollPaddingTop: '5rem'}} className='content-center'>
        <textarea placeholder="Bio" className="textarea textarea-bordered textarea-lg w-full max-w-xl" ></textarea>
      </div>
    </NavBar>
  <h1>
    <button className="btn" onClick={() => {
      console.log("WAS GEHT DENN SO");
      router.push("/login");
    }}>Hello daisyUI updated</button>
    <button className="btn" onClick={() => {
      connectionStateAndUserData({state})
      router.push("/");
    }}>Reload</button>
    <button className="btn btn-primary">data: {JSON.stringify(state)}</button>
    </h1>
    <ConnectionBanner state={state} />
    <h1>{JSON.stringify(state)}</h1>
    </>);
}
