import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { FRONTEND_SETTINGS } from "../store/types";
import ReactMarkdown from "react-markdown";
import { receiveMessage } from "@/utils/tools";

export const DynamicMarkdown = ({ children, ...props }) => {
  return (
    <article className={`prose text-neutral-content min-w-full max-w-full`}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </article>
  );
};


const NewMessagesMonitor = ({
    selectedChat,
    scrollToBottom
  }) => {
  const newMessages = useSelector((state: any) => state.newMessages);
  const dispatch = useDispatch();
  
  useEffect(() => {
  
    console.log("NEW MESSAGES", newMessages);
    if(newMessages.messages.length === 0) return;
    let chatsUpdates = {};

    newMessages.messages.forEach((item) => {
      if(!(item.chat_uuid in chatsUpdates)){
        chatsUpdates[item.chat_uuid] = [];
      }
      chatsUpdates[item.chat_uuid].push(item);
    });
    console.log("NEW MESSAGES", 2, chatsUpdates);
    
    Object.keys(chatsUpdates).forEach((key) => {
      const isChatSelected = key === selectedChat.uuid;
      dispatch(receiveMessage(chatsUpdates[key], key, isChatSelected, () => {
        if(isChatSelected){
          setTimeout(() => {
            scrollToBottom();
          }, 100);
          console.log("SCZ T")
        }
      }));
    });
    
  }, [newMessages]);
  
  

  return <></>
};

export const DynamicSectionHeader = ({
  onBackClick,
  displayed,
  title,
  navbarMargin,
}) => {
  return (
    <>
      {navbarMargin && displayed && (
        <div className="w-auto navbar mr-3 ml-3 mt-3 rounded-xl"></div>
      )}
      <div
        className="w-auto navbar bg-base-200 mr-3 ml-3 mt-3 rounded-xl w-96 transform-none	fixed"
        style={{ display: !displayed ? "none" : "flex" }}
      >
        <div className="flex-none lg:hidden">
          <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
            <button className="btn btn-square" onClick={onBackClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l-7 7 7 7"
                />
              </svg>
            </button>
          </label>
        </div>
        <div className="flex-1 px-2 mx-2">
          <article className="prose">
            <h2>{title}</h2>
          </article>
        </div>
      </div>
    </>
  );
};

export const NoSelectionPage = ({ selected }) => {
  return selected ? (
    <>
      <div className="w-auto navbar mr-3 ml-3 mt-3 rounded-xl"></div>
      <article
        className="prose p-2 text-neutral grow"
        style={{ display: selected ? "block" : "none" }}
      >
        <h1> Select any of the elements on the left!</h1>
      </article>
    </>
  ) : (
    <></>
  );
};

export const DynamicChat = ({ 
    selected, 
    userData, 
    chat, 
    messages, 
    onBackClick, 
    sendMessage 
  }) => {
  console.log("TBS CHAT", chat, messages);
  
  const scrollToBottom = () => {
    const chat = document.getElementById("chat-scroll");
    chat.scrollTop = chat.scrollHeight;  
  };

  if (!selected) return <></>;
  return (
    <><NewMessagesMonitor selectedChat={chat} scrollToBottom={scrollToBottom}/>
    <div
      className={`w-200 max-w-full h-full flex flex-col pb-4 pt-2 ${
        selected ? "" : "hidden"
      }`}
    >
      <div className="flex flex-row items-center bg-base-300 h-20 w-full rounded-xl p-2 pr-4 mb-1 max-w-full">
        <div className="flex flex-grow bg-base-100 h-full mr-4 rounded-xl justify-center content-center items-center">
          <div className="pr-4 pl-4">
            <button className="btn btn-square" onClick={onBackClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l-7 7 7 7"
                />
              </svg>
            </button>
          </div>
          <div className="text-xl prose flex flex-grow items-center content-center justify-center">
            <h2>{chat.partner.first_name}</h2>
          </div>
        </div>
        <div className="avatar online placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
            <span>{chat.partner.first_name.substring(0, 2)}</span>
          </div>
        </div>
      </div>
      <div id="chat-scroll" className="flex flex-col grow p-1 rounded-xl overflow-y-auto max-h-full">
        <div className="flex flex-col w-full">
          {chat?.next && (
            <div className="w-full flex content-center justify-center">
              <button className="btn btn-xs">Load more</button>
            </div>
          )}
          {messages.results && messages.results.toReversed().map((message, i) => {
            console.log("message", message, message.sender, userData.uuid);
            return (
              <div key={i} className="w-full relative">
                <div className={`bg-base-300 w-5/6 h-fit min-w-fit overflow-x-auto rounded-xl p-2 mt-2 ${
                    message.sender === userData.uuid ? "float-right" : ""
                  }`}
                >
                  <DynamicMarkdown>{message.text}</DynamicMarkdown>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-base-300 bottom-0 h-fit rounded-xl mt-1 p-2">
        <div className="flex flex-row items-center">
          <textarea
            id="sendMessageContainer"
            placeholder="Type a Message ..."
            className="textarea textarea-bordered textarea-lg flex flex-grow p-1 pl-2 h-24"
          ></textarea>
          <div className="w-32 flex justify-center">
            <button 
              onClick={() => {
                sendMessage(document.getElementById("sendMessageContainer").value, chat.uuid);
                document.getElementById("sendMessageContainer").value = ""; 
              }}
              className="btn btn-xl">
                Send
            </button>
          </div>
        </div>
      </div>
    </div></>
  );
};

export const DynamicChatSelector = ({
  sections,
  selection,
  setSelection,
  setContentFocused,
  navbarMargin,
}) => {
  const frontendSettings = useSelector((state) => state.frontendSettings);

  console.log("CHAT SELECTOR", sections, selection);
  return (
    <>
      <div className="flex flex-col items-end fixed max-h-full w-full relative">
        {navbarMargin && (
          <div className="w-auto navbar mr-3 ml-3 mt-3 rounded-xl"></div>
        )}
        <div className="flex flex-row items-end flex-wrap w-full max-w-full overflow-y-auto">
          {sections
            .filter((item) => item.uuid !== "empty")
            .map((item) => {
              return (
                <label
                  key={item.uuid}
                  className={`btn normal-case text-lg gap-2 mb-4 mr-4 -translate-x-4 hover:translate-x-2 h-auto bg-base-200 p-2 pl-6 pr-6 w-fit ${
                    selection === item.id
                      ? "translate-x-2 bg-neutral-content text-neutral hover:bg-neutral-content"
                      : ""
                  }`}
                  onClick={() => {
                    setSelection(item.uuid);
                    setContentFocused(true);
                  }}
                >
                  <div className="avatar online placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                      <span>{item.partner.first_name.substring(0, 2)}</span>
                    </div>
                  </div>
                  <div className="text-left w-20 ml-6">
                    {item.partner.first_name}
                    <div className="text-xs">Chilling</div>
                  </div>
                </label>
              );
            })}
        </div>
      </div>
    </>
  );
};

export const DynamicSelector = ({
  sections,
  selection,
  setSelection,
  setContentFocused,
  navbarMargin,
}) => {
  return (
    <div className="flex flex-col items-end fixed">
      {navbarMargin && (
        <div className="w-auto navbar mr-3 ml-3 mt-3 rounded-xl"></div>
      )}
      {sections
        .filter((item) => item.id !== "empty")
        .map((item) => {
          return (
            <label
              key={item.id}
              className={`btn normal-case text-lg gap-2 mb-2 -translate-x-4 hover:translate-x-2 ${
                selection === item.id
                  ? "translate-x-2 bg-neutral-content text-neutral hover:bg-neutral-content"
                  : ""
              }`}
              onClick={() => {
                setSelection(item.id);
                setContentFocused(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {item.text}
            </label>
          );
        })}
    </div>
  );
};

export const DynamicTwoPageContentDisplay = ({
  focused,
  selectorContent,
  selectionContent,
  sectionHeaderTitle,
  onSectionHeaderBackClick,
  onBackTransitionEnd,
  useDynamicSectionHeader,
  navbarMarginContent,
}) => {
  /**
   * Dynamic listing component using dasyui
   * This works by switching to a clickable list with a back-button on mobile ( like whatsapp, telegramm )
   */

  const dispatch = useDispatch();
  const [mainContentTransitioning, setMainContentTransitioning] =
    useState(false);
  const [mainContentTransitionFinished, setMainContentTransitioningFinished] =
    useState(true);
  const device = useSelector((state: any) => state.device);
  const frontendSettings = useSelector((state: any) => state.frontendSettings);

  const landscapeView = device.loading || device.width > 1024;

  const handleScroll = () => {
    const scrollElement = document.getElementById("dynamicScrollContainer");
    const scrollPosition = scrollElement ? scrollElement.scrollTop : 0; // => scroll position
    console.log(
      "scrolled in: ",
      scrollPosition > 30 && !frontendSettings.mainNavigationTranslucent,
    );
    console.log(
      "scrolled out: ",
      scrollPosition < 30 && frontendSettings.mainNavigationTranslucent,
    );
    if (scrollPosition > 30 && !frontendSettings.mainNavigationTranslucent) {
      dispatch({
        type: FRONTEND_SETTINGS,
        payload: { mainNavigationTranslucent: true },
      });
      console.log("Translucent");
    }

    if (scrollPosition < 30 && frontendSettings.mainNavigationTranslucent) {
      dispatch({
        type: FRONTEND_SETTINGS,
        payload: { mainNavigationTranslucent: false },
      });
      console.log("Not Translucent");
    }
    console.log(
      "scroll",
      scrollPosition,
      scrollPosition < 30,
      scrollPosition > 30,
    );
  };

  useEffect(() => {
    handleScroll();
    document
      .getElementById("dynamicScrollContainer")
      ?.addEventListener("scroll", handleScroll);
    return () => {
      document
        .getElementById("dynamicScrollContainer")
        ?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [frontendSettings]);

  const handeTransitionEnd = useCallback((e) => {
    console.log(
      "ENDED transition",
      e.target.id,
      mainContentTransitioning,
      mainContentTransitionFinished,
      focused,
    );
    if (e.target.id === "selectionContent") {
      setMainContentTransitioning(false);
    }
  }, []);

  const handeTransitionStart = useCallback((e) => {
    console.log("STARTED transition", e.target.id);
    if (e.target.id === "selectionContent") {
      if (!mainContentTransitioning) setMainContentTransitioning(true);
    }
  }, []);

  useEffect(() => {
    if (!mainContentTransitioning) {
      setMainContentTransitioningFinished(true);
      if (!focused) onBackTransitionEnd();
    }
  }, [mainContentTransitioning]);

  useEffect(() => {
    if (
      !navbarMarginContent &&
      !frontendSettings.mainNavigationbarLinksCollapsible
    ) {
      dispatch({
        type: FRONTEND_SETTINGS,
        payload: { mainNavigationbarLinksCollapsible: true },
      });
    }

    if (
      navbarMarginContent &&
      frontendSettings.mainNavigationbarLinksCollapsible
    ) {
      dispatch({
        type: FRONTEND_SETTINGS,
        payload: { mainNavigationbarLinksCollapsible: false },
      });
    }
  }, []);

  useEffect(() => {
    document
      .getElementById("selectionContent")
      ?.addEventListener("transitionstart", handeTransitionStart);
    return () => {
      document
        .getElementById("selectionContent")
        ?.removeEventListener("transitionstart", handeTransitionStart);
    };
  }, [focused]);

  useEffect(() => {
    document
      .getElementById("selectionContent")
      ?.addEventListener("transitionend", handeTransitionEnd);
    return () => {
      document
        .getElementById("selectionContent")
        ?.removeEventListener("transitionend", handeTransitionEnd);
    };
  }, [focused]);

  useEffect(() => {
    if (!landscapeView) {
      dispatch({
        type: FRONTEND_SETTINGS,
        payload: { mainNavigationHidden: focused },
      });
    }
  }, [focused]);

  if (landscapeView && frontendSettings.mainNavigationHidden) {
    dispatch({
      type: FRONTEND_SETTINGS,
      payload: { mainNavigationHidden: false },
    });
  } else if (
    !landscapeView &&
    !frontendSettings.mainNavigationHidden &&
    focused
  ) {
    dispatch({
      type: FRONTEND_SETTINGS,
      payload: { mainNavigationHidden: true },
    });
  }

  const selectionHeader = useDynamicSectionHeader ? (
    <DynamicSectionHeader
      title={sectionHeaderTitle}
      onBackClick={onSectionHeaderBackClick}
      displayed={!landscapeView && focused}
      navbarMargin={navbarMarginContent}
    />
  ) : (
    <></>
  );

  if (typeof document !== "undefined") {
    const elem = document.getElementById("selectionContent");
    if (elem) {
      elem.scrollTop = 0;
      console.log("SCROLLING TO BOTTOM", elem.scrollHeight, elem?.scrollTop);
    }
  }

  return landscapeView ? (
    <div className="flex flex-row w-auto h-full max-h-full">
      <div className="flex flex-col w-4/12 bg-neutral-focous rounded-xl mr-2 text-wrap h-auto p-2 items-end">
        {selectorContent}
      </div>
      <div className="flex flex-col h-full bg-neutral-focous h-auto rounded-xl">
        {selectionHeader}
        {selectionContent}
      </div>
    </div>
  ) : (
    <>
      <div
        className={`flex flex-col duration-500 w-full fixed bg-neutral-focous rounded-xl mr-2 text-wrap h-auto p-2 items-end ${
          !focused
            ? "transition transform"
            : "transition transform -translate-x-full"
        }`}
      >
        {selectorContent}
      </div>
      <div
        id="selectionContent"
        className={`flex flex-col duration-500 w-full h-full h-auto rounded-xl ${
          !mainContentTransitionFinished ? `transition transform` : ``
        }  ${!focused ? `translate-x-full` : ``}`}
      >
        {selectionHeader}
        {selectionContent}
      </div>
    </>
  );
};