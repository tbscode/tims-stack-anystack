
import Image from 'next/image'
import { useRouter } from 'next/router';
import { handleStreamedProps, getCookiesAsObject } from "../utils/tools";
import React, { useState, useEffect } from "react";
import { ConnectionBanner, connectionStateAndUserData } from "../components/connection-banner";
import { MainNavigation, ChatsList, ChatMessages } from "../components/navigation-bar";
import { useDispatch, useSelector } from 'react-redux';
import { FRONTEND_SETTINGS } from '../store/types';
import { DynamicSelector, DynamicTwoPageContentDisplay } from "../components/dynamic-two-page-selector";




export const getServerSidePropsNo = async ({req} : {req: any}) => {
  if (req.method == "POST") {
    const res = await handleStreamedProps({req})
    console.log("RES", res)
    return { props: { data: JSON.parse(res), dataLog: {pulled: true} } };
  }
  return { props: { dataLog: {pulled: false}} };
};

const NoSelectionPage = ({selected}) => {
  return <div style={{visibility: selected ? "visible" : "hidden"}}>
    <h1> No setting selected </h1>
    </div>
}

const ALL_THEMES = [
  "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
]

const FrontendSettingsPage = ({selected, profile}) => {
  const frontendSettings = useSelector((state: any) => state.frontendSettings);
  const dispatch = useDispatch();

  return <>
    <article className="prose p-2 text-primary-content" style={selected ? {} : {visibility: 'hidden', height: '0px'}}>
      <h1>Frontend Settings</h1>
      Configure local app settings here 
      <h2>Theme</h2>
      <select className="select w-full max-w-xs" onChange={(e) => {
        dispatch({type: FRONTEND_SETTINGS, payload: {theme: e.target.value}})
      }}>
        {ALL_THEMES.map((theme) => {
          return <option selected={theme == frontendSettings.theme}>{theme}</option>
        })}
      </select>
    </article>
  </>
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
    <article className="prose p-2 text-primary-content" style={selected ? {} : {visibility: 'hidden', height: '0px'}}>
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
    id: "profile", 
    text: "Profile",
  },
  {
    id: "frontend", 
    text: "Frontend",
  }
]


export default function Index(): JSX.Element {
  const profile = useSelector((state: any) => state.profile)
  const [contentFocused, setContentFocused] = useState(false);
  const [selection, setSelection] = useState("empty")

  console.log("PROFILE DATA", profile);
  
  return <DynamicTwoPageContentDisplay 
      focused={contentFocused}
      selectorContent={<DynamicSelector
          sections={PROFILE_SETTINGS} 
          selection={selection}
          setSelection={setSelection}
          setContentFocused={setContentFocused}
        />}
        sectionHeaderTitle={PROFILE_SETTINGS.filter((item) => item.id === selection)[0]?.text ?? "No Selection"}
        onSectionHeaderBackClick={() => {
          setContentFocused(false);
          //setSelection("empty");
        }}
        onBackTransitionEnd={() => {
          console.log("RESET SELECTION", contentFocused);
          setSelection("empty");
        }}
        selectionContent={<>
          <PersonalSettingsPage selected={selection === "profile"} profile={profile}/>
          <FrontendSettingsPage selected={selection === "frontend"} profile={profile}/>
          <NoSelectionPage selected={selection === "empty"}/>
        </>}   />
}
