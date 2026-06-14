"use client";

import { useEffect, useRef } from "react";

class QuoteTool {
  static get toolbox() {
    return {
      title: "Quote",
      icon: '"',
    };
  }

  constructor({ data }) {
    this.data = data || {};
  }

  render() {
    const input = document.createElement("textarea");
    input.placeholder = "Write a quote...";
    input.value = this.data.text || "";
    input.className =
      "min-h-24 w-full resize-y rounded-lg border border-gray-300 p-3 text-base";
    this.input = input;
    return input;
  }

  save() {
    return {
      text: this.input.value,
    };
  }
}

class CodeTool {
  static get toolbox() {
    return {
      title: "Code",
      icon: "</>",
    };
  }

  constructor({ data }) {
    this.data = data || {};
  }

  render() {
    const input = document.createElement("textarea");
    input.placeholder = "Paste code...";
    input.value = this.data.code || "";
    input.className =
      "min-h-32 w-full resize-y rounded-lg border border-gray-300 bg-slate-950 p-3 font-mono text-sm text-white";
    this.input = input;
    return input;
  }

  save() {
    return {
      code: this.input.value,
    };
  }
}

class ImageUrlTool {
  static get toolbox() {
    return {
      title: "Image",
      icon: "img",
    };
  }

  constructor({ data }) {
    this.data = data || {};
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "space-y-2";

    const urlInput = document.createElement("input");
    urlInput.placeholder = "Image URL or upload below";
    urlInput.value = this.data.file?.url || this.data.url || "";
    urlInput.className =
      "w-full rounded-lg border border-gray-300 p-3 text-base";

    const uploadContainer = document.createElement("div");
    uploadContainer.className = "flex gap-2 items-center";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg,image/png,image/webp,image/gif";
    fileInput.className = "hidden";

    const uploadBtn = document.createElement("button");
    uploadBtn.type = "button";
    uploadBtn.textContent = "📤 Upload Image";
    uploadBtn.className =
      "flex-1 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed";

    const uploadStatus = document.createElement("span");
    uploadStatus.className = "text-xs text-gray-600";

    uploadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      fileInput.click();
    });

    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      uploadBtn.disabled = true;
      uploadStatus.textContent = "Uploading...";

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          urlInput.value = data.url;
          uploadStatus.textContent = "✓ Uploaded";
          uploadStatus.className = "text-xs text-green-600";
          setTimeout(() => {
            uploadStatus.textContent = "";
          }, 2000);
        } else {
          uploadStatus.textContent = "❌ " + data.message;
          uploadStatus.className = "text-xs text-red-600";
        }
      } catch (error) {
        uploadStatus.textContent = "❌ Upload failed";
        uploadStatus.className = "text-xs text-red-600";
      } finally {
        uploadBtn.disabled = false;
      }
    });

    const captionInput = document.createElement("input");
    captionInput.placeholder = "Caption";
    captionInput.value = this.data.caption || "";
    captionInput.className =
      "w-full rounded-lg border border-gray-300 p-3 text-base";

    uploadContainer.append(uploadBtn, uploadStatus);
    wrapper.append(urlInput, uploadContainer, captionInput, fileInput);
    this.urlInput = urlInput;
    this.captionInput = captionInput;
    return wrapper;
  }

  save() {
    return {
      file: {
        url: this.urlInput.value,
      },
      caption: this.captionInput.value,
    };
  }
}

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

            quote: QuoteTool,

            code: CodeTool,

            image: ImageUrlTool,
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
