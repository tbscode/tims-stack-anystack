import React, { ChangeEvent, FocusEvent, FocusEventHandler, useCallback } from "react";
import { EnumOptionsType, WidgetProps } from "@rjsf/utils";
import Select, { components, MultiValue, SingleValue } from 'react-select';
import { selectStyles } from "../styles/select.styles";
import { Option } from "../../../interfaces/Option.interface";
import { useState } from "react";

const MultiValueRemove = ({...props}) => {
  return <components.MultiValueRemove {...props}>
      <button className="btn btn-sm btn-circle hover:bg-base-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </components.MultiValueRemove>
  };

/** The `SelectWidget` is a widget for rendering dropdowns.
 *  It is typically used with string properties constrained with enum options.
 *
 * @param props - The `WidgetProps` for this component
 */
function SelectWidget<T = any, F = any>({
  schema,
  id,
  options,
  value,
  disabled,
  readonly,
  multiple = false,
  autofocus = false,
  onBlur,
  onFocus,
  onChange
}: WidgetProps<T, F>) {
  const { enumOptions, enumDisabled } = options;
  const emptyValue = multiple ? [] : "";
  const [focused, setFocused] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const handleFocus:FocusEventHandler<HTMLInputElement> = useCallback(
    () => {
      onFocus(id, {});
      console.log("FOUCSED!")
      setFocused(true);
    },
    [onFocus, id, schema, multiple, options]
  );

  const handleBlur:FocusEventHandler<HTMLInputElement> = useCallback(
    () =>  {
      onBlur(id, {});
      console.log("UN-FOUCSED!")
      setFocused(false);
    },
    [onBlur, id, schema, multiple, options]
  );

  const handleChange = useCallback(
    (event: MultiValue<EnumOptionsType> | SingleValue<EnumOptionsType>) => {
      let newValue: string | string[] | undefined;
      if (multiple && Array.isArray(event)) {
        newValue = event.map((option) => option.value);
      } else {
        const singleEvent = event as SingleValue<EnumOptionsType>
        newValue = singleEvent?.value;
      }
      return onChange(newValue);
    },
    [onChange, schema, multiple, options]
  );

  const getEnumObjectFromVal = (val:string) => {
    return enumOptions?.find((option:Option) => option.value === val) || {label:"", value:""}
  }
  const getSelectValue = () => {
    let selectValue: Option | Option [] | undefined = undefined;
    if (multiple && Array.isArray(value)) {
      selectValue = value.map(val => getEnumObjectFromVal(val.toString()));
    } else if (value) {
      selectValue = getEnumObjectFromVal(value.toString());
    }
    return selectValue;
  }

  //{/**onBlur={handleBlur} onFocus={handleFocus}**/}
  return (
    <Select
      id={id}
      instanceId={id}
      isMulti={multiple}
      value={getSelectValue()}
      isDisabled={disabled || readonly}
      autoFocus={autofocus}
      options={enumOptions}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      closeMenuOnSelect={!multiple}
      onMenuClose={() => setMenuIsOpen(false)}
      onMenuOpen={() => setMenuIsOpen(true)}
      components={{
        MultiValueRemove
      }}
      unstyled={true}
      styles={selectStyles}
      classNames={{
        container: (state) => "rounded-xl mt-1",
        input: (state) => focused ? "bg-base-300 p-2 text-base-content text-xl input input-ghost grow": "h-0",
        menu: (state) => focused ? "bg-base-200 p-2 rounded-xl mt-1 shadow-2xl" : "h-0 hidden",
        control: (state) => state.isFocused ? "flex flex-row bg-base-300 p-2 rounded-xl mt-1" : "flex flex-row p-2 rounded-xl mt-1 bg-base-200",
        multiValueLabel: (state) => "",
        indicatorsContainer: (state) => focused ? "bg-base-100 p-2 rounded-xl h-fit absolute right-0 top-0 mr-3 mt-4 flex": "hidden",
        dropdownIndicator: (state) => menuIsOpen ? "rotate-180" :"",
        placeholder: (state) => "text-base-content text-xl flex items-center mr-4",
        multiValueRemove: (props) => focused ? "ml-4" : "hidden",
        valueContainer: (state) => "flex flex-row flex-wrap grow",
        multiValue: (state) => "flex flex-row btn btn-sm m-1 p-1 pl-4 pr-4 h-auto normal-case text-xl",
        menuList: (state) => "flex flex-row flex-wrap",
        option : (state) => "flex flex-row btn btn-sm m-1 p-1 pl-6 pr-6 h-auto normal-case text-xl",
        noOptionsMessage: (state) => "text-xl text-base-content p-4",
      }}
    />
  );
}

export default SelectWidget;
