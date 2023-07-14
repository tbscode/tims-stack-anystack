import { rjsfDaisyUiTheme } from "@/rjsf-daisyui-theme/rjsfDaisyUiTheme";
import { BASE_TAGS } from "./moc";
import { withTheme } from "@rjsf/core";
const ThemedForm = withTheme(rjsfDaisyUiTheme);
import validator from "@rjsf/validator-ajv8";

const filterShema = {
  type: "array",
  uniqueItems: true,
  items: {
    type: "string",
    enum: BASE_TAGS,
  },
};

export const ArticleFeedMenuBar = ({articleController, inSidebar}) => {
  const changeChangeForm = ({formData}) => {
    console.log("UPDATED", formData);
    articleController.filterController.setFilters(formData)
  }
  
  const baseMenuFeedStyles = (() => {
    if(inSidebar) {
      return "sm:flex relative flex flex-col w-full items-center p-4  2xl:mb-10 2xl:mt-10 rounded-xl border border-2 z-40 bg-base-100 bg-opacity-90 gap-4"
    }else{
      return "hidden sm:flex relative flex flex-row w-full h-32 items-center p-4  2xl:mb-10 2xl:mt-10 rounded-xl border border-2 sticky top-2 z-40 bg-base-100 bg-opacity-90"
    }
  })()
  
  const baseMenuItemsStyles = (() => {
    if(inSidebar) {
      return "flex flex-col content-center justify-center text-center items-center pointer-events-auto"
    }else{
      return "flex flex-col w-1/3 content-center justify-center text-center items-center pointer-events-auto"
    }
  })()
  

  return (
    <div className={baseMenuFeedStyles}>
      <div className={baseMenuItemsStyles}>
        <span className="font-bold p-1 rounded-xl">Authors</span>
        <ThemedForm
          schema={filterShema}
          extraErrors={{}}
          showErrorList="bottom"
          uiSchema={{
            "ui:submitButtonOptions": {
              norender: true,
            },
          }}
          formData={{}}
          validator={validator}
          onChange={() => {}}
        />
      </div>
      <div className={baseMenuItemsStyles}>
        <span className="font-bold p-1 rounded-xl">Filter</span>
        <ThemedForm
          schema={filterShema}
          extraErrors={{}}
          showErrorList="bottom"
          uiSchema={{
            "ui:submitButtonOptions": {
              norender: true,
            },
          }}
          formData={articleController.filterController.filters}
          validator={validator}
          onChange={changeChangeForm}
        />
      </div>
      <div className={baseMenuItemsStyles}>
        <span className="font-bold pb-3">Search</span>
        <input
          type="text"
          placeholder="title or phrase"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
    </div>
  );
};
