
import Image from 'next/image'
import { useRouter } from 'next/router';
import { handleStreamedProps, getCookiesAsObject } from "../utils/tools";
import React, { useState, useEffect } from "react";
import { ConnectionBanner, connectionStateAndUserData } from "../components/connection-banner";
import { MainNavigation, ChatsList, ChatMessages } from "../components/navigation-bar";
import { useSelector } from 'react-redux';




export const getServerSidePropsNo = async ({req} : {req: any}) => {
  if (req.method == "POST") {
    const res = await handleStreamedProps({req})
    console.log("RES", res)
    return { props: { data: JSON.parse(res), dataLog: {pulled: true} } };
  }
  return { props: { dataLog: {pulled: false}} };
};





const ProfileSettings = ({}) => {
 return <div style={{scrollBehavior: 'smooth', scrollPaddingTop: '5rem'}} className='content-center'>
        <textarea placeholder="Bio" className="textarea textarea-bordered textarea-lg w-full max-w-xl" ></textarea>
      </div>
}


export default function Index(): JSX.Element {
  const profile = useSelector((state: any) => state.profile)
  console.log("PROFILE DATA", profile);
  
  return (<>
      <div className="flex flex-row items-center w-auto m-4 h-full">
        <div className="flex flex-col w-72 bg-primary rounded-xl mr-2 text-wrap h-full p-2">
          
          <button className="btn gap-2" onClick={() => {
            window.location.reload();
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            Button
          </button>
        </div>
        <div className="flex flex-col flex-grow h-auto bg-secondary h-full rounded-xl p-2">
          {JSON.stringify(profile)} 
        </div>
      </div>
    </>);
}
