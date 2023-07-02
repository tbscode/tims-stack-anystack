import React, { useCallback } from "react";
import { getTemplate, schemaRequiresTrueValue, WidgetProps } from "@rjsf/utils";
import { DynamicMarkdown } from "@/components/dynamic-two-page-selector";

/** The `CheckBoxWidget` is a widget for rendering boolean properties.
 *  It is typically used to represent a boolean.
 *
 * @param props - The `WidgetProps` for this component
 */
function CheckboxWidget<T = any, F = any>({
  schema,
  options,
  id,
  value,
  disabled,
  readonly,
  label,
  autofocus = false,
  onBlur,
  onFocus,
  onChange,
  registry,
}: WidgetProps<T, F>) {
  const DescriptionFieldTemplate = getTemplate<
    "DescriptionFieldTemplate",
    T,
    F
  >("DescriptionFieldTemplate", registry, options);
  // Because an unchecked checkbox will cause html5 validation to fail, only add
  // the "required" attribute if the field value must be "true", due to the
  // "const" or "enum" keywords
  const required = schemaRequiresTrueValue(schema);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange(event.target.checked),
    [onChange]
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) =>
      onBlur(id, event.target.checked),
    [onBlur, id]
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) =>
      onFocus(id, event.target.checked),
    [onFocus, id]
  );

  return (<>
    <DynamicMarkdown>{label}</DynamicMarkdown>
    <div className={`checkbox ${disabled || readonly ? "disabled" : ""}`}>
      <div className="flex flex-row">
        <input
          type="checkbox"
          className="checkbox"
          id={id}
          checked={typeof value === "undefined" ? false : value}
          required={required}
          disabled={disabled || readonly}
          autoFocus={autofocus}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
      {schema.description && (
        <DescriptionFieldTemplate
          id={id + "__description"}
          description={schema.description}
          registry={registry}
        />
      )}
      </div>
    </div>
  </>);
}

export default CheckboxWidget;
