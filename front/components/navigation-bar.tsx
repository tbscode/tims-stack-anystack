import { FRONTEND_SETTINGS } from "@/store/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const ChatMessages = ({ state }) => {
  return (
    <div className="bg-accent text-accent-content rounded-box flex items-center p-4 shadow-xl">
      <div className="flex-1">{JSON.stringify(state)}</div>
    </div>
  );
};

export const ChatsList = ({}) => {
  const chats = [{ uuid: "0", name: "Chat 1" }];
  return <div></div>;
};

export const MainNavigation = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const frontendSettings = useSelector((state: any) => state.frontendSettings);
  const userData = useSelector((state: any) => state.userData);
  const navItems = [
    { id: "index", text: "Index", href: "/" },
    { id: "settings", text: "Settings", href: "/settings" },
    { id: "chat", text: "Chat", href: "/chat" },
    { id: "login", text: "Login", href: "/login" },
  ];

  const [navbarLinksCollapsed, setNavbarLinksCollapsed] = useState(true);

  useEffect(() => {
    if (!frontendSettings.mainNavigationbarLinksCollapsible) {
      setNavbarLinksCollapsed(false);
    }
  }, [frontendSettings.mainNavigationbarLinksCollapsible]);

  console.log("CURRETN ROUTER PATHNAME", router.pathname);

  useEffect(() => {
    console.log(
      "Settings changed translucent:",
      frontendSettings.mainNavigationTranslucent,
    );
  }, [frontendSettings]);

  const possiblePages = navItems.filter(
    (item) => router.pathname === item.href,
  );
  const currentPage =
    possiblePages.length > 0
      ? possiblePages[0]
      : { id: "unknown", text: "Unknown Page", href: "/" };

  return (
    <div className="drawer">
      <input
        id="my-drawer-3"
        type="checkbox"
        className="drawer-toggle"
        onInput={() => {
          setDrawerOpen(!drawerOpen);
        }}
      />
      <div
        id="dynamicScrollContainer"
        className={`drawer-content flex flex-col overflow-x-hidden overflow-y-auto`}
      >
        <div
          className={`w-auto navbar rounded-xl fixed z-20 ${
            frontendSettings.mainNavigationTranslucent
              ? "blur-sm hover:blur-none opacity-75"
              : ""
          }`}
          style={{
            display: frontendSettings.mainNavigationHidden ? "none" : "flex",
          }}
        >
          <div
            className={`bg-base-300 blur-none p-3 rounded-xl ${
              userData?.is_staff ? "bg-error" : ""
            } `}
          >
            <div className="flex-none lg:hidden">
              <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div
              className={`flex-1 px-2 mx-2 w-2/12 blur-none ${
                true ? "w-2/12" : ""
              }`}
            >
              <article className="prose w-fit">
                <h2>Tim&apos;s Stack: {currentPage.text}</h2>
              </article>
            </div>
          </div>
          <div className="flex-none hidden lg:block">
            <div
              className="flex flex-row"
              onClick={() => {
                setNavbarLinksCollapsed(!navbarLinksCollapsed);
              }}
              onMouseEnter={() => {
                setNavbarLinksCollapsed(false);
              }}
              onMouseLeave={() => {
                setNavbarLinksCollapsed(true);
              }}
            >
              {frontendSettings.mainNavigationbarLinksCollapsible && (
                <div className={`bg-neutral text-neutral rounded-xl ml-4 p-2`}>
                  <article className={`prose`}>
                    <h3>Show</h3>
                  </article>
                </div>
              )}
              <div
                className={`flex flex-row transition-all h-fit duration-500 overflow-hidden z-20 ${
                  navbarLinksCollapsed &&
                  frontendSettings.mainNavigationbarLinksCollapsible
                    ? "w-0 h-fit"
                    : "w-180"
                }`}
              >
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`${
                      currentPage.id !== item.id
                        ? "bg-base-300 text-neutral-content"
                        : "bg-neutral-content text-neutral"
                    } rounded-xl ml-4 hover:bg-neutral-content hover:text-base-300 p-3`}
                  >
                    <h3
                      className={`text-xl font-bold ${
                        currentPage.id !== item.id ? "" : "text-neutral"
                      }`}
                    >
                      {item.text}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={`w-full h-full ${drawerOpen ? "blur" : ""}`}>
          {children}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 rounded-xl h-96 mt-20 transition-transform gap-4 pl-10">
          {navItems.map((item, i) => (
            <Link
              key={item.id}
              href={item.href}
              className={`bg-base-100 rounded-xl hover:bg-base-200 hover:rotate-6`}
            >
              <div className="w-auto navbar m-1 rounded-xl">
                <div className="flex-none">
                  <label
                    htmlFor="my-drawer-3"
                    className="btn btn-square btn-ghost"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block w-6 h-6 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      ></path>
                    </svg>
                  </label>
                </div>
                <article className="prose">
                  <h2>{item.text}</h2>
                </article>
              </div>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};
