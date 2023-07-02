import React, { useCallback } from "react";
import { getInputProps, WidgetProps } from "@rjsf/utils";

/** The `BaseInputTemplate` is the template to use to render the basic `<input>` component for the `core` theme.
 * It is used as the template for rendering many of the <input> based widgets that differ by `type` and callbacks only.
 * It can be customized/overridden for other themes or individual implementations as needed.
 *
 * @param props - The `WidgetProps` for this template
 */
export default function BaseInputTemplate<T = any, F = any>(
  props: WidgetProps<T, F>
) {
  const {
    id,
    value,
    readonly,
    disabled,
    autofocus,
    onBlur,
    onFocus,
    onChange,
    options,
    schema,
    uiSchema,
    formContext,
    registry,
    rawErrors,
    type,
    ...rest
  } = props;

  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  if (!id) {
    console.log("No id for", props);
    throw new Error(`no id for props ${JSON.stringify(props)}`);
  }
  const inputProps = { ...rest, ...getInputProps<T, F>(schema, type, options) };

  let inputValue;
  if (inputProps.type === "number" || inputProps.type === "integer") {
    inputValue = value || value === 0 ? value : "";
  } else {
    inputValue = value == null ? "" : value;
  }

  const _onChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
      onChange(value === "" ? options.emptyValue : value),
    [onChange, options]
  );
  const _onBlur = useCallback(
    ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
      onBlur(id, value),
    [onBlur, id]
  );
  const _onFocus = useCallback(
    ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
      onFocus(id, value),
    [onFocus, id]
  );
  
  console.log("SHEMA", schema, id, value, registry, options, inputProps);

  return (
    <>
      {(rawErrors?.length > 0) ? <div className="tooltip tooltip-open tooltip-error" data-tip={rawErrors?.join(", ")}>
        <input className="input input bordered hidden"/>
      </div> : <></>}
      {(('changed' in schema) && schema.changed) ? <div className="indicator w-auto pointer-events-auto">
        <span className="indicator-item indicator-top indicator-end badge badge-info pr-1 hover:bg-base-100 pointer-events-auto" >
          revert
        </span>
        <span className="indicator-item indicator-top indicator-end badge badge-info pr-2 pl-2 hover:opacity-0 pointer-events-auto" 
          onMouseEnter={() => {
           if('updateDisplayPrevious' in registry.rootSchema.tbsExtras) {
              registry.rootSchema.tbsExtras.updateDisplayPrevious({field: schema.changeFieldRef, display: true})
           }
          }}
          onMouseLeave={() => {
           if('updateDisplayPrevious' in registry.rootSchema.tbsExtras) {
              registry.rootSchema.tbsExtras.updateDisplayPrevious({field: schema.changeFieldRef, display: false})
           }
          }}
          onClick={() => {
            console.log("REVERT CLICKED", registry.rootSchema);
            if(("tbsExtras" in registry.rootSchema) && ("revertFunc" in registry.rootSchema.tbsExtras)) {
              console.log("REVERTING", registry.rootSchema.tbsExtras);
              registry.rootSchema.tbsExtras.revertFunc({field: schema.changeFieldRef})
            }
          }}>
          updated
        </span>
          <input className="input input bordered h-0 w-full"/>
      </div> : <></>}
      {('previous' in schema) ? 
        <input
          key={id}
          id={id}
          className="input input-bordered text-info"
          readOnly={readonly}
          disabled={disabled}
          autoFocus={autofocus}
          value={schema.previous}
          {...inputProps}
          list={schema.examples ? `examples_${id}` : undefined}
          onChange={_onChange}
          onBlur={_onBlur}
          onFocus={_onFocus}
        /> :
        <input
          key={id}
          id={id}
          className="input input-bordered"
          readOnly={readonly}
          disabled={disabled}
          autoFocus={autofocus}
          value={inputValue}
          {...inputProps}
          list={schema.examples ? `examples_${id}` : undefined}
          onChange={_onChange}
          onBlur={_onBlur}
          onFocus={_onFocus}
        />}
      {Array.isArray(schema.examples) && (
        <datalist key={`datalist_${id}`} id={`examples_${id}`}>
          {[
            ...new Set(
              schema.examples.concat(schema.default ? [schema.default] : [])
            ),
          ].map((example: any) => (
            <option key={example} value={example} />
          ))}
        </datalist>
      )}
    </>
  );
}
