import React from "react";
import { DynamicMarkdown } from "@/components/dynamic-two-page-selector";

const REQUIRED_FIELD_SYMBOL = "*";

export type LabelProps = {
  /** The label for the field */
  label?: string;
  /** A boolean value stating if the field is required */
  required?: boolean;
  /** The id of the input field being labeled */
  id?: string;
};

/** Renders a label for a field
 *
 * @param props - The `LabelProps` for this component
 */
export default function Label(props: LabelProps) {
  const { label, required, id } = props;
  if (!label) {
    return null;
  }
  console.log("Label props", label);
  return (
    <label className="justify-start gap-1 label" htmlFor={id}>
      <span className="label-text">
        <DynamicMarkdown>{label}</DynamicMarkdown>
      </span>
      {required && <span className="required">{REQUIRED_FIELD_SYMBOL}</span>}
    </label>
  );
}
