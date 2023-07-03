
import Image from 'next/image'
import { useRouter } from 'next/router';
import { handleStreamedProps, getCookiesAsObject } from "../utils/tools";
import React, { useState, useEffect, useRef, createRef } from "react";
import { ConnectionBanner, connectionStateAndUserData } from "../components/connection-banner";
import { MainNavigation, ChatsList, ChatMessages } from "../components/navigation-bar";
import { useDispatch, useSelector } from 'react-redux';
import { FRONTEND_SETTINGS } from '../store/types';
import { DynamicSelector, DynamicTwoPageContentDisplay } from "../components/dynamic-two-page-selector";
import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { withTheme } from '@rjsf/core';
import { rjsfDaisyUiTheme } from '../rjsf-daisyui-theme/rjsfDaisyUiTheme';
import { globalAgent } from 'https';
import { clear } from 'console';
import { init } from 'next/dist/compiled/@vercel/og/satori';
import { DynamicForm } from '@/rjsf-daisyui-theme/form/form';
const SCHEMA = {

    title: '# Profile Settings',
    description: 'All profile related settings',
    type: 'object',
    required: [],
    properties: {
      first_name: { 
        type: 'string', 
        title: '### First Name', 
        description: 'Your first namee', 
      },
      second_name: { 
        type: 'string', 
        title: '### Second Name', 
        description: 'Your first namee', 
      }
    },
}

const UI_SCHEMA = {
  'ui:submitButtonOptions': {
    "norender": true,
  },
  "updated": {
    "ui:widget": "radio",
    "ui:options": {
      "inline": true
    }
  }
}

export const getServerSidePropsNo = async ({req} : {req: any}) => {
  if (req.method == "POST") {
    const res = await handleStreamedProps({req})
    console.log("RES", res)
    return { props: { data: JSON.parse(res), dataLog: {pulled: true} } };
  }
  return { props: { dataLog: {pulled: false}} };
};

const NoSelectionPage = ({selected}) => {
  return <div style={{visibility: selected ? "visible" : "hidden"}}>No selection</div>
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
        {ALL_THEMES.map((i, theme) => {
          return <option key={i} selected={theme == frontendSettings.theme}>{theme}</option>
        })}
      </select>
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
  const [contentFocused, setContentFocused] = useState(false);
  const [selection, setSelection] = useState("empty")
  const profile = useSelector((state: any) => state.profile);
  
  console.log("PROFILE TBS", profile);

  //return <PersonalSettingsPage selected={true} profile={profile}/>;
  
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
          <DynamicForm 
            schema={SCHEMA} 
            uiSchema={UI_SCHEMA}
            baseData={profile}
            hidden={selection !== "profile"}
            hideSubmitButton={true}
            autoSubmit={true}
            submitTimeout={2000}
            handleSubmit={(formData) => fetch('/api/profile/', {
              method: 'PUT',
              headers: {
              'X-CSRFToken': getCookiesAsObject().csrftoken,
              'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)})}
            />
          {/**<FrontendSettingsPage selected={selection === "frontend"} profile={profile}/>**/}
          <NoSelectionPage selected={selection === "empty"}/>
        </>}   />
}
