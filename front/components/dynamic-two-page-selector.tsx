import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { FRONTEND_SETTINGS } from '../store/types';


export const DynamicTwoPageContentDisplay = ({focused, selectorContent, selectionHeader, selectionContent}) => {
  /**
   * Dynamic listing component using dasyui
   * This works by switching to a clickable list with a back-button on mobile ( like whatsapp, telegramm )
   */
  
  const dispatch = useDispatch();
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
  
  if(landscapeView && frontendSettings.mainNavigationHidden) {
    dispatch({type: FRONTEND_SETTINGS, payload: {mainNavigationHidden: false}})
  }else if(!landscapeView && !frontendSettings.mainNavigationHidden && focused) {
    dispatch({type: FRONTEND_SETTINGS, payload: {mainNavigationHidden: true}})
  }

  return landscapeView ? (
    <div className="flex flex-row w-auto">
      <div className="flex flex-col w-5/12 bg-neutral-focous rounded-xl mr-2 text-wrap h-auto p-2 items-end">
        {selectorContent}
      </div>
      <div className="flex flex-col w-fit h-auto bg-neutral-focous h-auto rounded-xl">
        {selectionHeader}
        {selectionContent}
      </div>
    </div>
      ) : (
    <div className="flex flex-row items-center w-auto h-auto">
      {focused ? (
        <div id="dynamicScrollContainer" className="flex flex-col flex-grow h-auto h-auto rounded-xl">
          {selectionHeader}
          {selectionContent}
        </div>
      ): (
        <div className="flex flex-col w-full bg-neutral-focous rounded-xl mr-2 text-wrap h-auto p-2 items-end">
          {selectorContent}
        </div>
      )}
    </div>
    )
}