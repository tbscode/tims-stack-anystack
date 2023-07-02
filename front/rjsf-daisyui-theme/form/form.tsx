import React, { useState, useEffect, useRef, createRef } from "react";
import { rjsfDaisyUiTheme } from '../rjsfDaisyUiTheme';
import { withTheme } from '@rjsf/core';
let trackUpdateTime = false

const ThemedForm = withTheme(rjsfDaisyUiTheme); 

interface ReqiredCallbacks {
    revertField: ({field}: {field: string}) => void,
    updateDisplayPrevious: ({ field, display }: {field: string, display: boolean}) => void
}

interface HistoryMangerI {
     changedFields: Array<string>,
     prevValues: { [key: string]: any}
}

interface InjectDataSchemaProps {
    schema: any,
    data: object,
    callbacks: ReqiredCallbacks,
    historyManager: HistoryMangerI
}

const injectDataSchema = (props: InjectDataSchemaProps) => {
    const {schema, data, callbacks, historyManager} = props;

    Object.keys(schema.properties).forEach((key) => {
        if(key === 'last_updated')
           delete schema.properties[key] 
        console.assert(key in data, `key ${key} not in data`)
        schema.properties[key].default = data[key]
        if(key in historyManager.prevValues)
            schema.properties[key].previous = historyManager.prevValues[key]
        else if(key in historyManager.changedFields)
            schema.properties[key].changed = true
        else return;
        schema.properties[key].changeFieldRef = key
    });

    return {...schema, last_updated: data.last_updated, tbsExtras: callbacks}
};

interface UiStatesI {
    isFetching: boolean,
    unsavedChanges: boolean
}

const injectUiSchema = (uiStates: UiStatesI, uiSchema: any) => {
    return {...uiSchema, tbsStateOptions: uiStates}
}



const getTimeStamped = ({...profileData}) => {
  const timestaped = 'last_updated' in profileData
  const updated_at = timestaped ? new Date(profileData.last_updated).toISOString(): new Date().toISOString();
  
  Object.keys(profileData).forEach((key) => { profileData[key] = updated_at })
  if(updated_at)
      delete profileData.last_updated;
  return profileData;
};


interface DynamicFormParams {
    schema: any,
    uiSchema: any,
    // should be a redux state ( or static input ) containg the current values of the form
    baseData: any, 
    hidden: boolean,

    hideSubmitButton: boolean,
    // submit settings
    autoSubmit: boolean,
    submitTimeout: number,

    handleSubmit: (formData: { [key: string]: any }) => Promise<any>, // Fetch promise
}

export const TimsDynamicForm = (props: DynamicFormParams) => {

  const { 
    schema, 
    uiSchema, 
    baseData, 
    hidden, 
    hideSubmitButton, 
    autoSubmit, 
    submitTimeout, 
    handleSubmit 
  } = props;

  const formRef = createRef();
  const [data, setData] = useState(baseData);
  const [changedFields, setChangedFields] = useState<Array<string>>([]);
  const [displayPrevious, setDisplayPrevious] = useState<Array<string>>([]);
  const [errors, setErrors] = useState({});
  const [timestamps, setTimestamps] = useState(getTimeStamped(baseData));

  const [uiSchemaParams, setUiSchemaParams] = useState({
    isFetching: false,
    unsavedChanges: false,
  });

  const timeOutId = useRef<number | null>(null);

  const submitData = (formData: any) => {
    setUiSchemaParams({...uiSchemaParams, isFetching: true});
    handleSubmit(formData).then((res) => {
        res.json().then((parsed: any) => {
            if(res.ok){
              setData(parsed);
              setChangedFields([]);
              setUiSchemaParams({...uiSchema, isFetching: false, unsavedChanges: false});
              setErrors({});
            } else if (res.status === 400) {
              Object.keys(data).forEach(function(key, index) { data[key] = { __errors: data[key] }});
              setUiSchemaParams({...uiSchema, isFetching: false, unsavedChanges: true});
              setErrors(data);
            }
        });
    }).catch((err) => {/** Todo: alternate error display */})
  }

  const getPrevValues = ({fields}: {fields: Array<string>}) => {
    let prevValues: { [key: string]: any } = {};
    fields.forEach((field) => {
      prevValues[field] = baseData[field]; 
    });
    return prevValues;
  }
  
  const formDataChanged = ({formData}: {formData: any}) => {
    if(timeOutId.current)
        clearTimeout(timeOutId.current)
    
    const updatedProfile = {...baseData, ...formData};

    let updatedChangedFields: Array<string> = [];
    let updatedTimestamps: { [key: string]: any } = {}

    Object.keys(updatedProfile).forEach((key) => {
      if (updatedProfile[key] !== baseData[key]) {
        updatedTimestamps[key] = new Date().toISOString();
        changedFields.push(key);
      }else {
        updatedTimestamps[key] = timestamps[key];
      }
    })
    setData(updatedProfile);
    setTimestamps(updatedTimestamps);
    setChangedFields(updatedChangedFields.concat(changedFields));
    setUiSchemaParams({...uiSchema, unsavedChanges: true});

    const newTimer = setTimeout(() => { submitData(formData); }, submitTimeout)
    timeOutId.current = newTimer
  };
  
  const updateDisplayPrevious = (
    {field, display}: {field: string, display: boolean}) => {
      if(display){
        setDisplayPrevious([field].concat(displayPrevious)); 
      }else {
        setDisplayPrevious(displayPrevious.filter((item) => item != field));
      }
  };
  
  const revertField = ({field}: {field: string}) => {
      setTimestamps({...timestamps, [field]: 'last_updated' in baseData ? baseData.last_updated : data.last_updated});

      const updatedChangeFields = changedFields.filter((item) => item != field);
      if(updatedChangeFields.length == 0){
        setUiSchemaParams({...uiSchema, unsavedChanges: false});
      }

      setChangedFields(updatedChangeFields);
      setErrors({...errors, [field]: undefined});
      setData({...data, [field]: baseData[field]});
  }
  
  const prevValues = getPrevValues({fields: displayPrevious});
  
  const currentSchema = injectDataSchema({ schema, data, callbacks: { revertField, updateDisplayPrevious }, historyManager: { changedFields, prevValues }});
  const currentUiSchema = injectUiSchema(uiSchemaParams, uiSchema);
  
  return <div 
              className='p-4 pr-8 pl-8' 
          style={hidden ? {} : {visibility: 'hidden', height: '0px'}}>
      <ThemedForm
        schema={currentSchema}
        extraErrors={errors}
        ref={formRef}
        showErrorList="bottom"
        formData={data}
        uiSchema={currentUiSchema}
        validator={validator}
        onChange={formDataChanged}
      />
  </div>


};