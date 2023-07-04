
import Image from 'next/image'
import { useRouter } from 'next/router';
import { handleStreamedProps, getCookiesAsObject, getEnv } from "../utils/tools";
import React, { useState, useEffect, useRef, createRef } from "react";
import { ConnectionBanner, connectionStateAndUserData } from "../components/connection-banner";
import { MainNavigation, ChatsList, ChatMessages } from "../components/navigation-bar";
import { useDispatch, useSelector } from 'react-redux';
import { FRONTEND_SETTINGS } from '../store/types';
import { DynamicChatSelector, DynamicChat, DynamicTwoPageContentDisplay, NoSelectionPage } from "../components/dynamic-two-page-selector";
import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { withTheme } from '@rjsf/core';
import { rjsfDaisyUiTheme } from '../rjsf-daisyui-theme/rjsfDaisyUiTheme';
import { globalAgent } from 'https';
import { clear } from 'console';
import { init } from 'next/dist/compiled/@vercel/og/satori';
import { DynamicForm } from '@/rjsf-daisyui-theme/form/form';


const CHATS = [
  {
    id: "some-chat-uuid", 
    type: "human",
    partner: {
      id: "some-partner-uuid",
      first_name: "John",
      second_name: "Doe",
      last_seen: "1 minute ago",
    },
  },
  {
    id: "some-chat-uuid-2", 
    type: "human",
    partner: {
      id: "some-partner-uuid-2",
      first_name: "Siobhan",
      second_name: "Kraus",
      last_seen: "1 minute ago",
    },
  },
]

const MESSAGES = {
  "some-chat-uuid" : [
    {
      "id": "some-message-uuid",
      "read": false,
      "send_time": "",
      "read_time": "",
      "sender": "some-sender-uuid",
      "text": "# Hello World \n \`some code\`",
    },
    {
      "id": "some-message-uuid-2",
      "read": false,
      "send_time": "",
      "read_time": "",
      "sender": "fea55741-5157-4f86-b854-b4617441a3cd",
      "text": "Hello World",
    },
    {
      "id": "some-message-uuid-3",
      "read": false,
      "send_time": "",
      "read_time": "",
      "sender": "some-sender-uuid",
      "text": "Hello World",
    },
    {
      "id": "some-message-uuid-4",
      "read": false,
      "send_time": "",
      "read_time": "",
      "sender": "some-sender-uuid",
      "text": "Hello World",
    },
    // Generate 10 messages just in js syntax text right here
    ...Array(10).fill({
      "id": "some-message-uuid-5",
      "read": false,
      "send_time": "",
      "read_time": "",
      "sender": "some-sender-uuid",
      "text": "# Hello World \n \`some code\`",
    }),
]
}

export default function Chat(): JSX.Element {
  const [contentFocused, setContentFocused] = useState(false);
  const [selection, setSelection] = useState("empty")
  const profile = useSelector((state: any) => state.profile);
  const userData = useSelector((state: any) => state.userData);
  const [selectedChat, setSelectedChat] = useState({});
  const [messages, setMessages] = useState([]);
  const [isChatSelected, setIsChatSelected] = useState(false);
  
  console.log("SELECTION", selection);
  
  useEffect(() => {
    setIsChatSelected(false);
  }, []);
  
  const updateSelection = (id) => {
    console.log("UPDATE SELECTION", id, "CONTENT FOCUSED", contentFocused, "SELECTION", selection, "ID", id, "EMPTY", id === "empty")
    if(id !== "empty") {
      setSelectedChat(CHATS.filter((item) => item.id === id)[0]);
      const updatedMessages = id in MESSAGES ? MESSAGES[id] : [];
      setMessages(updatedMessages);
      setIsChatSelected(true);
    }    
    setSelection(id); 
  };
  
  return <DynamicTwoPageContentDisplay 
      focused={contentFocused}
      selectorContent={<DynamicChatSelector
          sections={CHATS} 
          selection={selection}
          setSelection={updateSelection}
          setContentFocused={setContentFocused}
          navbarMargin={true}
        />}
        navbarMarginContent={false}
        useDynamicSectionHeader={false}
        sectionHeaderTitle={CHATS.filter((item) => item.id === selection)[0]?.partner.first_name ?? "No Selection"}
        onSectionHeaderBackClick={() => {
          setContentFocused(false);
          //setSelection("empty");
        }}
        onBackTransitionEnd={() => {
          console.log("RESET SELECTION", contentFocused);
          setSelection("empty");
        }}
        selectionContent={<>
          <DynamicChat selected={isChatSelected} userData={userData} chat={selectedChat} messages={messages}/>
          <NoSelectionPage selected={selection === "empty"}/>
        </>}   />
}
