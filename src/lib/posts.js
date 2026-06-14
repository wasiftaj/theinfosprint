export function createSlug(value = "") {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createExcerpt(content, fallback = "") {
  const blocks = Array.isArray(content?.blocks) ? content.blocks : [];
  const firstTextBlock = blocks.find((block) => block?.data?.text);
  const text = firstTextBlock?.data?.text || fallback;

  return text
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

export function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

export function canManagePost(token, post) {
  if (!token || !post) return false;
  if (["admin", "editor"].includes(token.role)) return true;

  return token.role === "author" && post.author?.toString() === token.sub;
}
