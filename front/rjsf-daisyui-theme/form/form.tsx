import React, { useState, useEffect, useRef, createRef } from "react";
import validator from '@rjsf/validator-ajv8';
import { rjsfDaisyUiTheme } from '../rjsfDaisyUiTheme';
import { withTheme } from '@rjsf/core';
import { get } from "http";
let trackUpdateTime = false

const ThemedForm = withTheme(rjsfDaisyUiTheme); 

interface ReqiredCallbacks {
    revertField: ({field, setValue}: {field: string, setValue: any}) => void,
    updateDisplayPrevious: ({ field, display, setPrevious }: {field: string, display: boolean, setPrevious: any}) => void
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

    let properties = schema.properties
    Object.keys(properties).forEach((key) => {
        if(key === 'last_updated')
            return;
        if(!(key in data)) return;
        properties[key].default = data[key]
        console.log("KEY", key, historyManager.prevValues, historyManager.changedFields)
        if(key in historyManager.prevValues)
          properties[key].previous = historyManager.prevValues[key]
        else if('previous' in properties[key])
          delete properties[key].previous

        if(historyManager.changedFields.includes(key))
          properties[key].changed = true
        else
          properties[key].changed = false
        properties[key].changeFieldRef = key
    });
    if('last_updated' in properties)
        delete properties.last_updated;

    return {...schema, properties: properties, last_updated: data.last_updated, tbsExtras: callbacks}
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

export const DynamicForm = (props: DynamicFormParams) => {

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

  useEffect(() => {
    setData(baseData);
  }, [baseData]);

  const submitData = (formData: any) => {
    setUiSchemaParams({...uiSchemaParams, isFetching: true});
    if('loading' in formData)
      delete formData.loading;
    if('last_updated' in formData)
      delete formData.last_updated;
    handleSubmit(formData).then((res) => {
        res.json().then((parsed: any) => {
            if(res.ok){
              setData(parsed);
              setChangedFields([]);
              setUiSchemaParams({...uiSchema, isFetching: false, unsavedChanges: false});
              setErrors({});
            } else if (res.status === 400) {
              Object.keys(parsed).forEach(function(key, index) { parsed[key] = { __errors: parsed[key] }});
              setUiSchemaParams({...uiSchema, isFetching: false, unsavedChanges: true});
              setErrors(parsed);
            }
        });
    }).catch((err) => {/** Todo: alternate error display */})
  }

  const getPrevValues = ({fields}: {fields: Array<string>}) => {
    let prevValues: { [key: string]: any } = {};
    fields.forEach((field) => {
      prevValues[field] = baseData[field]; 
    });
    console.log("PREV EXTRA", fields, prevValues);
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
    const newChangeFields = updatedChangedFields.concat(changedFields)
    console.log("UPDATE CHANGE FIELD", newChangeFields)
    setChangedFields(newChangeFields);
    setUiSchemaParams({...uiSchema, unsavedChanges: true});

    const newTimer = setTimeout(() => { submitData(formData); }, submitTimeout)
    timeOutId.current = newTimer
  };
  
  const updateDisplayPrevious = ({field, display, setPrevious}: {field: string, display: boolean, setPrevious: any}) => {
    const newPreDisp = display ? [field].concat(displayPrevious) : displayPrevious.filter((item) => item !== field);
    console.log("UPDATE DISPLAY", field, display, newPreDisp, getPrevValues({fields: newPreDisp}));
    setDisplayPrevious(newPreDisp);
    const prev = display ? getPrevValues({fields: [field]})[field] : null;
    setPrevious(prev);
  };
  
  const revertField = ({field, setValue}: {field: string, setValue: any}) => {
      setTimestamps({...timestamps, [field]: 'last_updated' in baseData ? baseData.last_updated : data.last_updated});

      const updatedChangeFields = changedFields.filter((item) => item != field);
      if(updatedChangeFields.length == 0){
        setUiSchemaParams({...uiSchema, unsavedChanges: false});
      }
      console.log("REVERTING TO", field,baseData[field], data[field])

      setChangedFields(updatedChangeFields);
      setErrors({...errors, [field]: undefined});
      setDisplayPrevious(displayPrevious.filter((item) => item !== field));
      setData({...data, [field]: baseData[field]});
      setValue(baseData[field]);
  }
 
  const currentSchema = injectDataSchema({ schema, data, callbacks: { revertField, updateDisplayPrevious }, historyManager: { changedFields: changedFields, prevValues: getPrevValues({fields: displayPrevious}) }});
  const currentUiSchema = injectUiSchema(uiSchemaParams, uiSchema);
  
  console.log("DISPLAY PREV", displayPrevious, currentSchema?.properties, currentSchema?.historyManager)
  
  return <div 
          className='p-4 pr-8 pl-8' 
          style={hidden ? {visibility: 'hidden', height: '0px'}: {}}>
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