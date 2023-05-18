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
