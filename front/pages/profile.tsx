
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



const DynamicList = ({focused, selectorContent, selectionHeader, selectionContent}) => {
  /**
   * Dynamic listing component using dasyui
   * This works by switching to a clickable list with a back-button on mobile ( like whatsapp, telegramm )
   */
  const device = useSelector((state: any) => state.device);
  return (device.loading || device.width > 1024) ? (
    <div className="flex flex-row items-center w-auto m-4 h-full">
      <div className="flex flex-col w-72 bg-primary rounded-xl mr-2 text-wrap h-full p-2">
        {selectorContent}
      </div>
      <div className="flex flex-col flex-grow h-auto bg-secondary h-full rounded-xl">
        {selectionHeader}
        {selectionContent}
      </div>
    </div>
      ) : (
    <div className="flex flex-row items-center w-auto m-4 h-full">
      {focused ? (
        <div className="flex flex-col flex-grow h-auto bg-secondary h-full rounded-xl">
          {selectionHeader}
          {selectionContent}
        </div>
      ): (
        <div className="flex flex-col w-full bg-primary rounded-xl mr-2 text-wrap h-full p-2">
          {selectorContent}
        </div>
      )}
    </div>
    )
}

const NoSelectionPage = () => {
  return <h1> No setting selected </h1>
}

const updateProfile = () => {
  /**
   * Fetch call to update the user profile
   */
}

const PersonalSettingsPage = ({selected, profile}) => {
  const [firstName, setFirstName] = useState(profile.first_name)
  
  useEffect(() => {
    setFirstName(profile.first_name)
  }, [profile])
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      /**
       * After debouncing we automaticly send the profile update request
       */
    }, 3000)

    return () => clearTimeout(delayDebounceFn)
  }, [firstName])

  return <>
    <article className="prose p-2 text-primary-content" style={{visibility: selected ? "visible" : "hidden"}}>
      <h1>Personal Settings</h1>
      {JSON.stringify(profile)}
      <input type="text" id="firstName" value={firstName} onInput={e => setFirstName(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs"/>
    </article>
  </>
}

const PROFILE_SETTINGS = [
  {
    id: "empty", 
    text: "No Selection",
  },
  {
    id: "personal", 
    text: "Personal",
  }
]


export default function Index(): JSX.Element {
  const profile = useSelector((state: any) => state.profile)
  const [contentFocused, setContentFocused] = useState(false);
  const [selection, setSelection] = useState("empty")

  console.log("PROFILE DATA", profile);
  
  return <DynamicList 
      focused={contentFocused}
      selectorContent={PROFILE_SETTINGS.filter((item) => item.id !== "empty").map((item) => {
        return <button key={item.id} className="btn gap-2" onClick={() => {
          setContentFocused(true);
          setSelection(item.id);
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          {item.text}
        </button>

      })}
      selectionHeader={<div className="w-full h-auto bg-accent-content rounded-xl">
        {contentFocused && 
          <button className="btn btn-square" onClick={() => {
            setContentFocused(false);
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l-7 7 7 7" /></svg>
          </button>}
      </div>}
        selectionContent={<>
          <PersonalSettingsPage selected={selection === "personal"} profile={profile}/>
        </>}   />
}
