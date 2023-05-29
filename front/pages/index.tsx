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
  const navItems = [
    {id: "about", text: "About", href: "/about"},
    {id: "settings", text: "Settings", href: "/"},
    {id: "index", text: "Index", href: "/"},
  ]
  /*
   *           <li><a>Navbar Item 1</a></li>
          <li><a>Navbar Item 2</a></li>
  */

  return (<div className="drawer">
  <input id="my-drawer-3" type="checkbox" className="drawer-toggle" /> 
  <div className="drawer-content flex flex-col">
    <div className="w-auto navbar bg-base-300 mr-3 ml-3 mt-3 rounded-xl">
      <div className="flex-none lg:hidden">
        <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </label>
      </div> 
      <div className="flex-1 px-2 mx-2">Navbar Title</div>
      <div className="flex-none hidden lg:block">
        <ul className="menu menu-horizontal">
            {navItems.map((item) => (
                <li key={item.id} className='bg-primary rounded-xl ml-1'>
                  <a href={item.href}>{item.text}</a>
                </li>
              ))}
        </ul>
      </div>
    </div>
    {children}
  </div> 
  <div className="drawer-side">
    <label htmlFor="my-drawer-3" className="drawer-overlay"></label> 
    <ul className="menu p-4 w-80 bg-base-100 rounded-xl h-96 mt-20 ml-4">
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
      
    </ul>
    
  </div>
</div>)
}

export const ChatMessages = ({}) => {
  return <div className='bg-accent text-accent-content rounded-box flex items-center p-4 shadow-xl'>
    <div className='flex-1'>Hello</div>
  </div>
  
}


export const ChatsList = ({}) => {
  const chats = [
    {uuid: "0", name: "Chat 1"}
  ]
  return <div></div>
}

const ProfileSettings = ({}) => {
 return <div style={{scrollBehavior: 'smooth', scrollPaddingTop: '5rem'}} className='content-center'>
        <textarea placeholder="Bio" className="textarea textarea-bordered textarea-lg w-full max-w-xl" ></textarea>
      </div>
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
  /**
   * 
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
   */

  return (<>
    <NavBar>
    <div className="flex flex-row items-center w-auto m-4 h-full">
      <div className="flex flex-col w-72 bg-primary rounded-xl mr-2 text-wrap h-full p-2">
        <button className="btn gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          Button
        </button>
      </div>
      <div className="flex flex-col flex-grow h-auto bg-secondary h-full rounded-xl p-2">
        <ChatMessages />
      </div>
    </div>
    </NavBar>
    <ConnectionBanner state={state} />
    </>);
}
