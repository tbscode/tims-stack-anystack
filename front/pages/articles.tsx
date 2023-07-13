import Image from "next/image";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";
import { useState, useEffect } from "react";
import {
  handleStreamedProps,
  getCookiesAsObject,
  getEnv,
  updateBaseData,
  ALL_THEMES
} from "@/utils/tools";
import {
  ConnectionBanner,
  connectionStateAndUserData,
} from "../components/connection-banner";
import { useSelector, useDispatch } from "react-redux";
import { CONNECTION_STATE, USER_DATA, USER_PROFILE, FRONTEND_SETTINGS } from "@/store/types";
import { BannerState } from "../components/connection-banner";
import { ArticleNav, ArticleFeed } from "@/components/articles";

export const getServerSideProps = async ({ req }: { req: any }) => {
  if (req.method == "POST") {
    const res = await handleStreamedProps({ req });
    console.log("RES", res);
    return { props: { data: JSON.parse(res), dataLog: { pulled: true } } };
  }
  return { props: { dataLog: { pulled: false } } };
};

export default function Index(): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();
  const frontendSettings = useSelector((state: any) => state.frontendSettings);
  
  return <div className="flex items-center content-center flex-col">
    <ArticleNav />
    <ArticleFeed />
  </div>
}
