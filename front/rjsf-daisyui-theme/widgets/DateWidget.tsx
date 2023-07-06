import React, { useCallback, useEffect } from "react";
import { getTemplate, localToUTC, utcToLocal, WidgetProps } from "@rjsf/utils";

/** The `DateWidget` component uses the `BaseInputTemplate` changing the type to `date` and transforms
 * the value to undefined when it is falsy during the `onChange` handling.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function DateWidget<T = any, F = any>(props: WidgetProps<T, F>) {
  const { onChange, value, options, registry } = props;
  const BaseInputTemplate = getTemplate<"BaseInputTemplate", T, F>(
    "BaseInputTemplate",
    registry,
    options,
  );
  return (
    <BaseInputTemplate
      type="date"
      {...props}
      value={utcToLocal(value)}
      onChange={(value) => onChange(localToUTC(value))}
    />
  );
}
