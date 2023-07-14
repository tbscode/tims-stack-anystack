import { useState } from "react";

export const SideBarCollapsible = ({ collapsibles }) => {
  const [checkedId, setCheckedId] = useState(0);
  
  const _onClick = ({id}) => {
    return () => {
      console.log("CLICKED", id, checkedId);
      if(checkedId === id) {
        setCheckedId(null)
      }else{
        setCheckedId(id)
      }
    }
  }

  return <>{collapsibles.map((section, i) => {
    return <div key={i} className="collapse collapse-arrow bg-base-200">
        <input type="checkbox" className="pointer-events-none" name="my-accordion-2" checked={checkedId === i} /> 
        <div className="collapse-title text-xl font-medium bg-base-300" onClick={_onClick({id: i})}>
          {section.title}
        </div>
        <div className={`collapse-content bg-base-300 duration-500 overflow-hidden`}>
          {section.content}
        </div>
      </div>
  })}</>;
};