import React from "react";
import { ErrorListProps, RJSFValidationError } from "@rjsf/utils";

/** The `ErrorList` component is the template that renders the all the errors associated with the fields in the `Form`
 *
 * @param props - The `ErrorListProps` for this component
 */
export default function ErrorList<T = any>({ errors }: ErrorListProps<T>) {
  return (
    <div className="bg-error p-1 pr-2 pl-2 rounded-xl">
      <div className="panel-heading">
        <h3 className="text-xl text-base-300">Errors</h3>
      </div>
      <ul className="list-group">
        {errors.map((error: RJSFValidationError, i: number) => {
          return (
            <li key={i} className="mb-2 bg-base-100 p-1 rounded-xl">
              {error.stack}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
