import React from "react";
import { TitleFieldProps } from "@rjsf/utils";
import { DynamicMarkdown } from "@/components/dynamic-two-page-selector";

const REQUIRED_FIELD_SYMBOL = "*";

/** The `TitleField` is the template to use to render the title of a field
 *
 * @param props - The `TitleFieldProps` for this component
 */
export default function TitleField<T = any, F = any>(
  props: TitleFieldProps<T, F>
) {
  const { id, title, required } = props;
  return (
    <legend id={id}>
      <DynamicMarkdown>{title}</DynamicMarkdown>
      {required && <span className="required">{REQUIRED_FIELD_SYMBOL}</span>}
    </legend>
  );
}
