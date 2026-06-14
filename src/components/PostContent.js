function renderInlineText(text = "") {
  return text.replace(/<[^>]*>/g, "");
}

export default function PostContent({ content, excludeImageUrl = "" }) {
  const blocks = Array.isArray(content?.blocks) ? content.blocks : [];

  if (blocks.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
        No content yet.
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 text-slate-800 shadow-sm md:p-8">
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
          if (!url || url === excludeImageUrl) return null;

          return (
            <figure key={key} className="space-y-2">
              <img
                src={url}
                alt={block.data?.caption || "Post image"}
                className="w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
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
              className="rounded-2xl border border-cyan-100 bg-cyan-50 px-5 py-4 text-lg italic text-slate-700"
            >
              {renderInlineText(block.data?.text)}
            </blockquote>
          );
        }

        if (block.type === "code") {
          return (
            <pre
              key={key}
              className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-50 shadow-lg"
            >
              <code>{block.data?.code}</code>
            </pre>
          );
        }

        return (
          <p key={key} className="text-lg leading-8 text-slate-700">
            {renderInlineText(block.data?.text)}
          </p>
        );
      })}
    </div>
  );
}
