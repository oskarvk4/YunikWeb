import Lines from "@/components/ui/Lines";

/**
 * Renders a longer editable text from /admin/copy. A blank line starts a new
 * paragraph; lines starting with "- " become a bullet list; a single new line
 * is a line break. Pass className for the paragraph style and listClassName
 * for the list.
 */
export default function RichText({
  text,
  className,
  listClassName = "list-disc pl-5 space-y-1",
}: {
  text: string;
  className?: string;
  listClassName?: string;
}) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((line) => line.trim().startsWith("- "))) {
          return (
            <ul key={i} className={listClassName}>
              {lines.map((line, j) => (
                <li key={j}>{line.trim().slice(2)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className={className}>
            <Lines text={block} />
          </p>
        );
      })}
    </>
  );
}
