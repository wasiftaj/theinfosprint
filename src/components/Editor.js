"use client";

import { useEffect, useRef } from "react";

// Editor.js core + tools (client-safe dynamic import approach)
export default function Editor({ onChange, data }) {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const initEditor = async () => {
      if (typeof window === "undefined") return;
      if (instanceRef.current) return;

      const EditorJS = (await import("@editorjs/editorjs")).default;
      const Header = (await import("@editorjs/header")).default;
      const List = (await import("@editorjs/list")).default;
      const Paragraph = (await import("@editorjs/paragraph")).default;
      const InlineCode = (await import("@editorjs/inline-code")).default;
      if (!isMounted) return;

      instanceRef.current = new EditorJS({
        holder: editorRef.current,
        placeholder: "Start writing your blog post...",
        data: data || {},

        tools: {
            header: {
                class: Header,
                inlineToolbar: true,
            },

            paragraph: {
                class: Paragraph,
                inlineToolbar: true,
            },

            list: {
                class: List,
                inlineToolbar: true,
            },

            inlineCode: {
                class: InlineCode,
            },
        },

        onChange: async () => {
          const savedData = await instanceRef.current.save();
          if (onChange) onChange(savedData);
        },
      });
    };

    initEditor();

    return () => {
      isMounted = false;

      if (instanceRef.current?.destroy) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <div ref={editorRef} />
    </div>
  );
}