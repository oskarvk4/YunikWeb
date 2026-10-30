import { Fragment } from "react";

/**
 * Renders editable text from /admin/copy where {email} is the customer's email
 * address, shown in bold: "Vi har sendt en mail til {email}."
 */
export default function EmailText({ text, email }: { text: string; email: string }) {
  return (
    <>
      {text.split("{email}").map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <strong>{email}</strong>}
          {part}
        </Fragment>
      ))}
    </>
  );
}
