import { ArticleNav } from "./navigation"

export const DynamicLayout = ({articleController,children, menuContent}) => {
  return (
    <div className="drawer absolute z-60">
    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content w-full">
      <ArticleNav />
      <div className="w-full flex flex-col justify-center content-center items-center">
        {children}
      </div>
    </div> 
    <div className="drawer-side">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <div className="menu p-4 w-80 h-full bg-base-200 text-base-content bg-opacity-80">
        {menuContent}
      </div>
    </div>
  </div>
  );
};