import Image from 'next/image'
import { useRouter } from 'next/router';
import { handleStreamedProps, getCookiesAsObject } from "../utils/tools";
import React, { useState, useEffect } from "react";
import { ConnectionBanner, connectionStateAndUserData } from "../components/connection-banner";
import { MainNavigation, ChatsList, ChatMessages } from "../components/navigation-bar";
import { useDispatch, useSelector } from 'react-redux';
import { DynamicSectionHeader, DynamicTwoPageContentDisplay } from "../components/dynamic-two-page-selector";
import { Capacitor } from '@capacitor/core';
import { FRONTEND_SETTINGS } from "@/store/types";
import ReactMarkdown from 'react-markdown'




export const getServerSidePropsNo = async ({req} : {req: any}) => {
  if (req.method == "POST") {
    const res = await handleStreamedProps({req})
    console.log("RES", res)
    return { props: { data: JSON.parse(res), dataLog: {pulled: true} } };
  }
  return { props: { dataLog: {pulled: false}} };
};


const INDEX_SECTIONS = [
  {
    id: "empty", 
    text: "No Selection",
  },
  {
    id: "getting_started", 
    text: "Getting Started",
  },
  {
    id: "getting_started2", 
    text: "Getting Started2",
  }
]

const gettingsStarted = `
# Tim's Stack: Dynamic Cross-platform Web App Stack

This is a clean rewrite of a stack that I've evolved over the past 2 years.
It is also my entry to the Bunnyshell hackathon, all components used here have free-to-use licenses.

![stack overview](./_misc/overview_graph.png)

## Use Case

This stack is designed for dynamic real-time web apps with mobile clients.
Backend changes can be directly sent to clients using a live WebSocket connection,
state in the client is managed with Redux.
This allows automatically updating all affected clients on any backend changes.

For the web-application setting, the Django backend dynamically requests Next.js pages,
this includes dynamic page data so we get full SSR for all pages.

The Next.js frontend is integrated with Capacitor and directly exports to Android and iOS.
In a native setting, the frontend will try to request user data from the backend,
if it fails it can fallback to a cached version allowing the user to view the full state of the app in an 'offline' mode.

## Stack Components

- Next.js + React frontend (deployment)
    - Tailwind CSS + DaisyUI
    - Automatic platform adjustments for API calls, authentication, and native functions (my custom implementation)
    - Global Redis store + auto background update WebSocket
    - Capacitor setup for native integrations and iOS / Android PWA export

- Django backend (deployment)
    - Celery for task management (or for offloading time-intensive tasks)
    - Django REST Framework + django_rest_dataclasses for rapid REST API development
    - Django proxy for authenticating views on other pods like the docs
    - DRF Spectacular for auto-generated API documentation
    - Django Channels for managing WebSockets and sending updates to clients

- Documentation (deployment)
    - pdoc3 code documentation generated from backend code

- PostgreSQL (helm chart)
    - Main backend database

- Redis (helm chart)
    - Broker for Celery
    - Database for Django Channels
`

const ARTICLES = [
  {
    id: "getting_started",
    title: "Getting Started",
    released: "2021-09-01",
    content: gettingsStarted,
  },
  {
    id: "the_backend",
    title: "The Backend",
    released: "2021-09-01",
    content: gettingsStarted,
  },
  {
    id: "the_frontend",
    title: "The Frontend",
    released: "2021-09-01",
    content: gettingsStarted,
  }
]

const GettingStartedPage = ({selected}) => {
  return <div className='flex-grow bg-base-300 rounded-l m-4 mt-2'>
        <article className="prose p-4 text-neutral-content" style={{display: selected ? "block" : "none"}}>
          <ReactMarkdown>{gettingsStarted}</ReactMarkdown>
      </article>
    </div>
}

const DynamicMarkdownPage = ({ children, selected }) => {
  return <div className='flex-grow bg-base-300 rounded-l m-4 mt-2'>
        <article className="prose p-4 text-neutral-content" style={{display: selected ? "block" : "none"}}>
          <ReactMarkdown>{ children }</ReactMarkdown>
      </article>
    </div>
}

const NoSelectionPage = ({selected}) => {
  return <article className="prose p-2 text-neutral" style={{display: selected ? "block" : "none"}}>
        <h1> Select any of the readmes on the left!</h1>
      </article>
}


export default function Index(): JSX.Element {
  const dispatch = useDispatch();
  const stateData = useSelector((state: any) => state.userData);
  console.log("USER DATA", stateData);
  const [contentFocused, setContentFocused] = useState(false);
  const [selection, setSelection] = useState("empty")
  const [markdown, setMarkdown] = useState("")
  
  
  useEffect(() => {
    if (true){
      dispatch({type: FRONTEND_SETTINGS, payload: {mainNavigationHidden: contentFocused}})
    }    
  }, [contentFocused])
  
  useEffect(() => {
    if (selection !== "empty"){
      const article = ARTICLES.filter((item) => item.id === selection);
      if (article.length === 0){
        setMarkdown("# 404 Article not found");
      }else{
        setMarkdown(article[0].content);
      }
    }
  }, [selection])
  
  return <DynamicTwoPageContentDisplay 
      focused={contentFocused}
      selectorContent={
              <div className='flex flex-col items-end fixed'>
                {INDEX_SECTIONS.filter((item) => item.id !== "empty").map((item) => {
                  return <label key={item.id} className={`btn normal-case text-lg gap-2 mb-2 -translate-x-4 hover:translate-x-2 ${selection === item.id ? 'translate-x-2 bg-neutral-content text-neutral hover:bg-neutral-content': ''}`} onClick={() => {
                    setSelection(item.id);
                    setContentFocused(true);
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  {item.text}
                </label>
                })}
            </div>
        }
        onSectionHeaderBackClick={() => {
          setContentFocused(false);
          //setSelection("empty");
        }}
        onBackTransitionEnd={() => {
          console.log("RESET SELECTION", contentFocused);
          setSelection("empty");
        }}
        selectionContent={<>
          <NoSelectionPage selected={selection === "empty"}/>
          <DynamicMarkdownPage selected={selection !== "empty"}>{markdown}</DynamicMarkdownPage>
        </>}   />
}
