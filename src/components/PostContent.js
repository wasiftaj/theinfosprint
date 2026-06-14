function renderInlineText(text = "") {
  return text.replace(/<[^>]*>/g, "");
}

export default function PostContent({ content }) {
  const blocks = Array.isArray(content?.blocks) ? content.blocks : [];

  if (blocks.length === 0) {
    return <p className="text-slate-500">No content yet.</p>;
  }

  return (
    <div className="space-y-5 text-slate-800">
      {blocks.map((block) => {
        const key = block.id || `${block.type}-${Math.random()}`;

        if (block.type === "header") {
          const level = Math.min(Math.max(block.data?.level || 2, 2), 4);
          const text = renderInlineText(block.data?.text);

          if (level === 2) {
            return (
              <h2 key={key} className="pt-4 text-3xl font-bold text-slate-950">
                {text}
              </h2>
            );
          }

          if (level === 3) {
            return (
              <h3 key={key} className="pt-3 text-2xl font-semibold text-slate-950">
                {text}
              </h3>
            );
          }

          return (
            <h4 key={key} className="pt-2 text-xl font-semibold text-slate-950">
              {text}
            </h4>
          );
        }

        if (block.type === "list") {
          const items = block.data?.items || [];
          const ListTag = block.data?.style === "ordered" ? "ol" : "ul";

          return (
            <ListTag
              key={key}
              className={
                block.data?.style === "ordered"
                  ? "list-decimal space-y-2 pl-6"
                  : "list-disc space-y-2 pl-6"
              }
            >
              {items.map((item, index) => (
                <li key={`${key}-${index}`}>{renderInlineText(item)}</li>
              ))}
            </ListTag>
          );
        }

        if (block.type === "image") {
          const url = block.data?.file?.url || block.data?.url;
          if (!url) return null;

          return (
            <figure key={key} className="space-y-2">
              <img
                src={url}
                alt={block.data?.caption || "Post image"}
                className="w-full rounded-lg border border-slate-200 object-cover"
              />
              {block.data?.caption && (
                <figcaption className="text-center text-sm text-slate-500">
                  {renderInlineText(block.data.caption)}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={key}
              className="border-l-4 border-cyan-500 pl-4 text-lg italic text-slate-700"
            >
              {renderInlineText(block.data?.text)}
            </blockquote>
          );
        }

        if (block.type === "code") {
          return (
            <pre
              key={key}
              className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-50"
            >
              <code>{block.data?.code}</code>
            </pre>
          );
        }

        return (
          <p key={key} className="text-lg leading-8">
            {renderInlineText(block.data?.text)}
          </p>
        );
      })}
    </div>
  );
}
