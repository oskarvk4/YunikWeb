import { Fragment } from "react";

/** Renders editable copy, turning each new line typed in /admin/copy into a <br />. */
export default function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}
