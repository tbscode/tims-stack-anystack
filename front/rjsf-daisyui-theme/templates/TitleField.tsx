import React, { useEffect, useState } from "react";
import { TitleFieldProps } from "@rjsf/utils";
import { DynamicMarkdown } from "@/components/dynamic-two-page-selector";

const REQUIRED_FIELD_SYMBOL = "*";

function convertToReadableFormat(datetime) {
  let now = new Date();
  let oldDate = new Date(datetime);

  let seconds = Math.floor((now - oldDate) / 1000);
  let interval = Math.floor(seconds / 31536000);

  let baseMessage = "Last changed: ";

  if (interval >= 1) {
    return baseMessage + interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return baseMessage + interval + " months ago";
  }
  interval = Math.floor(seconds / 604800);
  if (interval >= 1) {
    return baseMessage + interval + " weeks ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return baseMessage + interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return baseMessage + interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return baseMessage + interval + " minutes ago";
  }
  return baseMessage + Math.floor(seconds) + " seconds ago";
}

/** The `TitleField` is the template to use to render the title of a field
 *
 * @param props - The `TitleFieldProps` for this component
 */
export default function TitleField<T = any, F = any>(
  props: TitleFieldProps<T, F>,
) {
  const { id, title, required, schema, uiSchema } = props;
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <legend id={id}>
      {"last_updated" in schema && (
        <span className="badge badge-lg">
          {convertToReadableFormat(schema.last_updated)}
        </span>
      )}
      {"tbsStateOptions" in uiSchema &&
        "isFetching" in uiSchema.tbsStateOptions &&
        uiSchema.tbsStateOptions.isFetching && (
          <span className="badge badge-lg">saving...</span>
        )}
      {"tbsStateOptions" in uiSchema &&
        "unsavedChanges" in uiSchema.tbsStateOptions &&
        uiSchema.tbsStateOptions.unsavedChanges && (
          <span className="badge badge-lg badge-info">unsaved changes</span>
        )}
      <DynamicMarkdown>{title}</DynamicMarkdown>
      {required && <span className="required">{REQUIRED_FIELD_SYMBOL}</span>}
    </legend>
  );
}
