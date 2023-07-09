import Image from "next/image";
import { useRouter } from "next/router";
import {
  handleStreamedProps,
  getCookiesAsObject,
  getEnv,
  receiveMessage
} from "../utils/tools";
import React, { useState, useEffect, useRef, createRef } from "react";
import {
  ConnectionBanner,
  connectionStateAndUserData,
} from "../components/connection-banner";
import {
  MainNavigation,
  ChatsList,
  ChatMessages,
} from "../components/navigation-bar";
import { useDispatch, useSelector } from "react-redux";
import { FRONTEND_SETTINGS, MESSAGES_RECEIVE, SLECTED_CHAT } from "../store/types";
import {
  DynamicChatSelector,
  DynamicChat,
  DynamicTwoPageContentDisplay,
  NoSelectionPage,
} from "../components/dynamic-two-page-selector";
import Form from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import { withTheme } from "@rjsf/core";
import { rjsfDaisyUiTheme } from "../rjsf-daisyui-theme/rjsfDaisyUiTheme";
import { globalAgent } from "https";
import { clear } from "console";
import { init } from "next/dist/compiled/@vercel/og/satori";
import { DynamicForm } from "@/rjsf-daisyui-theme/form/form";

export const getServerSideProps = async ({ req }: { req: any }) => {
  if (req.method == "POST") {
    const res = await handleStreamedProps({ req });
    console.log("RES", res);
    return { props: { data: JSON.parse(res), dataLog: { pulled: true } } };
  }
  return { props: { dataLog: { pulled: false } } };
};


export default function Chat(): JSX.Element {
  const [selection, setSelection] = useState("empty");

  const dispatch = useDispatch();

  const profile = useSelector((state: any) => state.profile);
  const userData = useSelector((state: any) => state.userData);
  const chats = useSelector((state: any) => state.chats);
  const allMessagesSel = useSelector((state: any) => state.messages.messages);

  const [selectedChatInfo, setSelectedChatInfo] = useState({});

  let selectedChat = useSelector((state: any) => state.selectedChat);

  const [contentFocused, setContentFocused] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isChatSelected, setIsChatSelected] = useState(false);

  useEffect(() => {
    // TODO: maybe do something if the current selected chat change otherwise ignore
  }, [allMessagesSel]);

  useEffect(() => {
    console.log("SLECTED CHAT STATE UPDATE", selectedChat);
    setSelectedChatInfo(selectedChat.chat);
    setMessages(selectedChat.messages);
    setIsChatSelected(true);
  }, [selectedChat]);

  useEffect(() => {
    setIsChatSelected(false);
  }, []);
  
  const sendMessage = (message, chat_uuid) => {
    fetch(`${getEnv().serverUrl}/api/messages/${chat_uuid}/send/`, {
      credentials: "include",
      method: "POST",
      headers: {
          "X-CSRFToken": getCookiesAsObject().csrftoken,
          "Content-Type": "application/json",
          Accept: "application/json",
      },
      body: JSON.stringify({
        text: message,
      }),
    }).then((res) => { 
      if(res.ok) {
        res.json().then((data) => {
          dispatch(receiveMessage([data], selectedChat.chat.uuid, true));
        }); 
      }
    });
  };

  const updateSelection = (uuid) => {
    setSelection(uuid);
    if (uuid !== "empty") {
      const updateChatSelection = chats.results.filter(
        (item) => item.uuid === uuid,
      )[0];
      console.log("TBS SEL MSG", uuid, allMessagesSel[uuid], allMessagesSel);
      dispatch({
        type: SLECTED_CHAT,
        payload: { chat: updateChatSelection, messages: allMessagesSel[uuid] },
      });
    }
  };

  return (
    <DynamicTwoPageContentDisplay
      focused={contentFocused}
      selectorContent={
        <DynamicChatSelector
          sections={chats.results}
          selection={selection}
          setSelection={updateSelection}
          setContentFocused={setContentFocused}
          navbarMargin={true}
        />
      }
      navbarMarginContent={false}
      useDynamicSectionHeader={false}
      sectionHeaderTitle={
        chats.results.filter((item) => item.uuid === selection)[0]?.partner
          .first_name ?? "No Selection"
      }
      onSectionHeaderBackClick={() => {
        setContentFocused(false);
        //setSelection("empty");
      }}
      onBackTransitionEnd={() => {
        setSelection("empty");
      }}
      selectionContent={
        <>
          <DynamicChat
            onBackClick={() => {
              setContentFocused(false); 
            }}
            selected={isChatSelected}
            userData={userData}
            chat={selectedChatInfo}
            messages={messages}
            sendMessage={sendMessage}
          />
          <NoSelectionPage selected={selection === "empty"} />
        </>
      }
    />
  );
}
