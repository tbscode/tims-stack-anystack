import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { useState, useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [stateData, setStateData] = useState({theme: 'dark'});
  const [width, setWidth] = useState(typeof window === 'undefined' ? 2048 : window.innerWidth);

  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
  
  }

  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      setStateData(s => ({...s, ...{device: {isMobile768 : width <= 768}}}))
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, [width]);

  useEffect(() => {
    setStateData(s => ({...s, ...pageProps, ...{theme: localStorage.getItem('theme') || 'dark'}}))
  }, [pageProps])

  const updateTheme = (theme) => {
    console.log("THEME updated", theme)
    setStateData(s => ({...s, theme: theme}))
    localStorage.setItem('theme', theme)
  }

  return (
    <div data-theme={stateData?.theme}>
      <Component state={stateData} setState={setStateData} updateTheme={updateTheme} />
    </div>
  )
}

