import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux';
import { useCallback,useEffect, useState } from 'react';
import { FRONTEND_SETTINGS } from '../store/types';
import ReactMarkdown from 'react-markdown'

export const DynamicMarkdown = ({children}) => {
  return <article className={`prose text-neutral-content w-96 min-w-full`} >
    <ReactMarkdown>{ children }</ReactMarkdown>
  </article>
}


export const DynamicSectionHeader = ({
    onBackClick, 
    displayed,
    title
  }) => {

  return <>
    <div className="w-auto navbar mr-3 ml-3 mt-3 rounded-xl" style={{display: !displayed ? 'none' : 'flex'}}>
    </div>
    <div className="w-auto navbar bg-base-200 mr-3 ml-3 mt-3 rounded-xl w-96 transform-none	fixed" style={{display: !displayed ? 'none' : 'flex'}}>
        <div className="flex-none lg:hidden">
          <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
            <button className="btn btn-square" onClick={onBackClick}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l-7 7 7 7" /></svg>
            </button>
          </label>
        </div> 
        <div className="flex-1 px-2 mx-2">
          <article className='prose'>
            <h2>{title}</h2>
          </article>
        </div>
      </div>
    </>
}

export const DynamicSelector = ({ sections, selection, setSelection, setContentFocused }) => {
  return <div className='flex flex-col items-end fixed'>
                {sections.filter((item) => item.id !== "empty").map((item) => {
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

export const DynamicTwoPageContentDisplay = ({
    focused, 
    selectorContent, 
    selectionContent,
    sectionHeaderTitle,
    onSectionHeaderBackClick,
    onBackTransitionEnd
  }) => {
  /**
   * Dynamic listing component using dasyui
   * This works by switching to a clickable list with a back-button on mobile ( like whatsapp, telegramm )
   */
  
  const dispatch = useDispatch();
  const [mainContentTransitioning, setMainContentTransitioning] = useState(false);
  const [mainContentTransitionFinished, setMainContentTransitioningFinished] = useState(true);
  const device = useSelector((state: any) => state.device);
  const frontendSettings = useSelector((state: any) => state.frontendSettings);

  const landscapeView = (device.loading || device.width > 1024)
  
  const handleScroll = () => {
    const scrollElement = document.getElementById("dynamicScrollContainer")
    const scrollPosition = scrollElement ? scrollElement.scrollTop : 0; // => scroll position
    console.log("scrolled in: ", (scrollPosition > 30) && !frontendSettings.mainNavigationTranslucent)
    console.log("scrolled out: ", (scrollPosition < 30) && frontendSettings.mainNavigationTranslucent)
    if((scrollPosition > 30) && !frontendSettings.mainNavigationTranslucent) {
      dispatch({type: FRONTEND_SETTINGS, payload: {mainNavigationTranslucent: true}})
      console.log("Translucent")
    }
    
    if((scrollPosition < 30) && frontendSettings.mainNavigationTranslucent){
      dispatch({type: FRONTEND_SETTINGS, payload: {mainNavigationTranslucent: false}})
      console.log("Not Translucent")
    }
    console.log("scroll",scrollPosition, scrollPosition < 30, scrollPosition > 30); 
  }
  
  useEffect(() => {
    handleScroll();
    document.getElementById("dynamicScrollContainer")?.addEventListener("scroll", handleScroll);
    return () => {
      document.getElementById("dynamicScrollContainer")?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [frontendSettings]);
  
  const handeTransitionEnd = useCallback((e) => {
    console.log("ENDED transition", e.target.id, mainContentTransitioning, mainContentTransitionFinished, focused)
    if(e.target.id === "selectionContent") {
      
      setMainContentTransitioning(false)
    }
  },[])

  const handeTransitionStart = useCallback((e) => {
    console.log("STARTED transition", e.target.id)
    if(e.target.id === "selectionContent") {
      if(!mainContentTransitioning)
        setMainContentTransitioning(true)
    }
  },[])
  
  useEffect(() => {
    if(!mainContentTransitioning) {
      setMainContentTransitioningFinished(true)
      if(!focused)
        onBackTransitionEnd();
    }

  }, [mainContentTransitioning])

  
  useEffect(() => {
    document.getElementById("selectionContent")?.addEventListener("transitionstart", handeTransitionStart);
    return () => {
      document.getElementById("selectionContent")?.removeEventListener("transitionstart", handeTransitionStart);
    }
  }, [focused])

  useEffect(() => {
    document.getElementById("selectionContent")?.addEventListener("transitionend", handeTransitionEnd);
    return () => {
      document.getElementById("selectionContent")?.removeEventListener("transitionend", handeTransitionEnd);
    }
  }, [focused])
  
  
  useEffect(() => {
    if (!landscapeView) {
      dispatch({type: FRONTEND_SETTINGS, payload: {mainNavigationHidden: focused}})
    }    
  }, [focused])
  
  if(landscapeView && frontendSettings.mainNavigationHidden) {
    dispatch({type: FRONTEND_SETTINGS, payload: {mainNavigationHidden: false}})
  }else if(!landscapeView && !frontendSettings.mainNavigationHidden && focused) {
    dispatch({type: FRONTEND_SETTINGS, payload: {mainNavigationHidden: true}})
  }
  
  const selectionHeader = focused ? <DynamicSectionHeader title={sectionHeaderTitle} onBackClick={onSectionHeaderBackClick} displayed={!landscapeView}/> : <></>;

  return landscapeView ? (
    <div className="flex flex-row w-auto">
      <div className="flex flex-col w-4/12 bg-neutral-focous rounded-xl mr-2 text-wrap h-auto p-2 items-end">
        {selectorContent}
      </div>
      <div className="flex flex-col w-fit h-auto bg-neutral-focous h-auto rounded-xl">
        {selectionHeader}
        {selectionContent}
      </div>
    </div>
      ) : (
      <>
        <div className={`flex flex-col duration-500 w-full fixed bg-neutral-focous rounded-xl mr-2 text-wrap h-auto p-2 items-end ${!focused ? 'transition transform': 'transition transform -translate-x-full'}`}>
          {selectorContent}
        </div>
        <div id="selectionContent" className={`flex flex-col duration-500 w-full h-auto h-auto rounded-xl ${!mainContentTransitionFinished ? `transition transform` : ``}  ${!focused ? `translate-x-full`: ``}`}>
          {selectionHeader}
          {selectionContent}
        </div>
    </>
    )
}