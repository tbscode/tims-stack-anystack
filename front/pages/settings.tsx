
import Image from 'next/image'
import { useRouter } from 'next/router';
import { handleStreamedProps, getCookiesAsObject } from "../utils/tools";
import React, { useState, useEffect, useRef, createRef } from "react";
import { ConnectionBanner, connectionStateAndUserData } from "../components/connection-banner";
import { MainNavigation, ChatsList, ChatMessages } from "../components/navigation-bar";
import { useDispatch, useSelector } from 'react-redux';
import { FRONTEND_SETTINGS } from '../store/types';
import { DynamicSelector, DynamicTwoPageContentDisplay } from "../components/dynamic-two-page-selector";
import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { withTheme } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { rjsfDaisyUiTheme } from '../rjsf-daisyui-theme/rjsfDaisyUiTheme';
import { globalAgent } from 'https';
import { clear } from 'console';
import { init } from 'next/dist/compiled/@vercel/og/satori';
var _ = require('lodash');


const ThemedForm = withTheme(rjsfDaisyUiTheme); 

const schema: RJSFSchema = ({
  last_updated,
  first_name,
  second_name,
  changedFields,
  revertFunc,
  prevValues,
  updateDisplayPrevious
}) => {
  console.log("TBS", "shema", "last_updated", last_updated, "first_name", first_name, "second_name", second_name)
  const withPreValues = (subSchema) => {
    Object.keys(subSchema).forEach((key) => {
      if(subSchema[key].changed && key in prevValues) {
        subSchema[key].previous = prevValues[key];
      };
    });
    return subSchema;
  };
  const withChangeHandle = (subSchema) => {
    Object.keys(subSchema).forEach((key) => {
      subSchema[key].changed = changedFields.includes(key)
      subSchema[key].changeFieldRef = key;
    });
    return subSchema;
  };
  return {
    title: '# Profile Settings',
    description: 'All profile related settings',
    last_updated: last_updated,
    type: 'object',
    required: [],
    "tbsExtras": {
      "revertFunc": revertFunc,
      "updateDisplayPrevious": updateDisplayPrevious
    },
    properties: withPreValues(withChangeHandle({
      first_name: { 
        type: 'string', 
        title: '### First Name', 
        description: 'Your first namee', 
        default: first_name
      },
      second_name: { 
        type: 'string', 
        title: '### Second Name', 
        description: 'Your first namee', 
        default: second_name
      }
    })),
  }
};

const schema2: RJSFSchema = {
  title: '# Profile Settings',
  description: 'All profile related settings',
  type: 'object',
  required: ['title'],
  properties: {
    title: { 
      type: 'string', 
      title: '### Title', 
      description: '`true` if the task is done, `false` otherwise', 
      default: 'A new task' 
    },
    "datetime": {
      "title": "## Birthday",
      "description": "We need your birthday to send you a gift",
      "type": "string",
      "format": "date"
    },
    hobbies: {
      "type": "array",
      "title": "## Hobbies",
      "description": "What do you like to do in your free time?",
      "uniqueItems": true,
      "items": {
        "type": "string",
        "enum": ["Art", "Cooking", "Music", "Sports", "Movies"]
      }
    },
    done: { 
      type: 'boolean', 
      title: '## Done?', 
      description: '`true` if the task is done, `false` otherwise', 
      default: false 
    },
  },
};

const registrationFormUiSchema = ({
    isFetching,
    unsavedChanges,
  }) => {
  return {
    'ui:submitButtonOptions': {
      "norender": true,
    },
    'tbsStateOptions' : {
      'isFetching': isFetching,
      'unsavedChanges': unsavedChanges,
    },
    "updated": {
      "ui:widget": "radio",
      "ui:options": {
        "inline": true
      }
    }
  }
};





export const getServerSidePropsNo = async ({req} : {req: any}) => {
  if (req.method == "POST") {
    const res = await handleStreamedProps({req})
    console.log("RES", res)
    return { props: { data: JSON.parse(res), dataLog: {pulled: true} } };
  }
  return { props: { dataLog: {pulled: false}} };
};

const NoSelectionPage = ({selected}) => {
  return <div style={{visibility: selected ? "visible" : "hidden"}}>No selection</div>
}

const ALL_THEMES = [
  "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
]

const FrontendSettingsPage = ({selected, profile}) => {
  const frontendSettings = useSelector((state: any) => state.frontendSettings);
  const dispatch = useDispatch();

  return <>
    <article className="prose p-2 text-primary-content" style={selected ? {} : {visibility: 'hidden', height: '0px'}}>
      <h1>Frontend Settings</h1>
      Configure local app settings here 
      <h2>Theme</h2>
      <select className="select w-full max-w-xs" onChange={(e) => {
        dispatch({type: FRONTEND_SETTINGS, payload: {theme: e.target.value}})
      }}>
        {ALL_THEMES.map((i, theme) => {
          return <option key={i} selected={theme == frontendSettings.theme}>{theme}</option>
        })}
      </select>
    </article>
  </>
}

const UPDATE_TIMEOUT = 2000;

const PersonalSettingsPage = ({selected}) => {

  const getTimeStamped = ({...profileData}) => {
    if('last_updated' in profileData) {
      const updated_at = new Date(profileData.last_updated).toISOString();
      
      Object.keys(profileData).forEach((key) => {
        if (key != 'last_updated') {
          profileData[key] = updated_at
        }
      })
      delete profileData.last_updated;
      return profileData;
    }else {

      Object.keys(profileData).forEach((key) => {
        if (key != 'last_updated') {
          profileData[key] = new Date().toISOString()
        }
      })
      return profileData;
    }
  };
  
  const initProfile = useSelector((state: any) => state.profile)
  const [profile, setProfile] = useState(initProfile);
  const [changedFields, setChangedFields] = useState([]);
  const [displayPrevious, setDisplayPrevious] = useState([]);
  const [timestamps, setTimestamps] = useState(getTimeStamped(initProfile));

  const formRef = createRef();
  const [errors, setErrors] = useState({});

  const [uiSchema, setUiSchema] = useState({
    isFetching: false,
    unsavedChanges: false,
  });
  const timeOutId = useRef(null);
  
  const overwriteNonTemporary = (newData) => {
    
  };
  
  
  useEffect(() => {
    setProfile(initProfile);
  }, [initProfile]);
  

  const updateDataFetch = (formData) => {
    setUiSchema({...uiSchema, isFetching: true});
    fetch('/api/profile/', {
      method: 'PUT',
      headers: {
        'X-CSRFToken': getCookiesAsObject().csrftoken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData) 
    }).then((res) => {
      if(res.ok){
        res.json().then((data) => {
          console.log("SUCCESS UPDATED !", res);
          setProfile(data);
          setChangedFields([]);
          setUiSchema({...uiSchema, isFetching: false, unsavedChanges: false});
          setErrors({});
        });
      }else if(res.status == 400){
        res.json().then((data) => {
          Object.keys(data).forEach(function(key, index) {
            data[key] = {
              __errors: data[key]
            }
          });
          setUiSchema({...uiSchema, isFetching: false, unsavedChanges: true});
          setErrors(data);
        })
      }
    })
  };

  const inputChanged = ({formData}) => {
  
    clearTimeout(timeOutId.current)
    
    const updatedProfile = {...profile, ...formData};
    let updatedChangedFields = [];
    let updatedTimestamps = {}
    Object.keys(updatedProfile).forEach((key) => {
      if (updatedProfile[key] !== profile[key]) {
        updatedTimestamps[key] = new Date().toISOString();
        changedFields.push(key);
      }else {
        updatedTimestamps[key] = timestamps[key];
      }
    })
    setProfile(updatedProfile);
    setTimestamps(updatedTimestamps);
    setChangedFields(updatedChangedFields.concat(changedFields));
    setUiSchema({...uiSchema, unsavedChanges: true});

    const newTimer = setTimeout(() => {
      console.log("TBS","DATA UPDATE", formData);
      updateDataFetch(formData);
    }, UPDATE_TIMEOUT)
    timeOutId.current = newTimer
  }
  
  const getPrevValues = ({fields}) => {
    let prevValues = {};
    fields.forEach((field) => {
      prevValues[field] = initProfile[field]; 
    });
    return prevValues;
  }
  
  console.log("TBS", "PROFILE", profile);

  return <div className='p-4 pr-8 pl-8' style={selected ? {} : {visibility: 'hidden', height: '0px'}}>
      <ThemedForm
        schema={schema({
            ...profile, 
            changedFields, 
            prevValues: getPrevValues({fields: displayPrevious}),
            updateDisplayPrevious: ({field, display}) => {
              if(display){
                setDisplayPrevious([field].concat(displayPrevious)); 
              }else {
                setDisplayPrevious(displayPrevious.filter((item) => item != field));
              }
            },
            revertFunc: ({field}) => {
          console.log("Triggered revert", initProfile, field);
          setTimestamps({...timestamps, [field]: 'last_updated' in initProfile ? initProfile.last_updated : profile.last_updated});
          const updatedChangeFields = changedFields.filter((item) => item != field);
          if(updatedChangeFields.length == 0){
            setUiSchema({...uiSchema, unsavedChanges: false});
          }
          setChangedFields(updatedChangeFields);
          setErrors({...errors, [field]: undefined});
          setProfile({...profile, [field]: initProfile[field]});
        }})}
        extraErrors={errors}
        ref={formRef}
        showErrorList="bottom"
        formData={profile}
        uiSchema={registrationFormUiSchema(uiSchema)}
        validator={validator}
        onChange={({...props}) => {
          inputChanged({formData: props.formData});
        }}
        onSubmit={({...props}) => {
          console.log("TBS",'submitted', props.formData);
        }}
        onError={({...props}) => {console.log("TBS",'error', props)}}
      />
  </div>
}

const PROFILE_SETTINGS = [
  {
    id: "empty", 
    text: "No Selection",
  },
  {
    id: "profile", 
    text: "Profile",
  },
  {
    id: "frontend", 
    text: "Frontend",
  }
]


export default function Index(): JSX.Element {
  const [contentFocused, setContentFocused] = useState(false);
  const [selection, setSelection] = useState("empty")

  //return <PersonalSettingsPage selected={true} profile={profile}/>;
  
  return <DynamicTwoPageContentDisplay 
      focused={contentFocused}
      selectorContent={<DynamicSelector
          sections={PROFILE_SETTINGS} 
          selection={selection}
          setSelection={setSelection}
          setContentFocused={setContentFocused}
        />}
        sectionHeaderTitle={PROFILE_SETTINGS.filter((item) => item.id === selection)[0]?.text ?? "No Selection"}
        onSectionHeaderBackClick={() => {
          setContentFocused(false);
          //setSelection("empty");
        }}
        onBackTransitionEnd={() => {
          console.log("RESET SELECTION", contentFocused);
          setSelection("empty");
        }}
        selectionContent={<>
          <PersonalSettingsPage selected={selection === "profile"} />
          {/**<FrontendSettingsPage selected={selection === "frontend"} profile={profile}/>**/}
          <NoSelectionPage selected={selection === "empty"}/>
        </>}   />
}
