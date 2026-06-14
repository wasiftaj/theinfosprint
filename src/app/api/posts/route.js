import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/User";
import { getToken } from "next-auth/jwt";
import { createExcerpt, createSlug, normalizeTags } from "@/lib/posts";
import { NextResponse } from "next/server";

const postRoles = ["admin", "editor", "author"];

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const manage = searchParams.get("manage") === "true";
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const query = manage ? {} : { status: "published" };

    if (manage) {
      if (!token || !postRoles.includes(token.role)) {
        return NextResponse.json({ success: false, message: "Not allowed" }, { status: 403 });
      }

      if (token.role === "author") {
        query.author = token.sub;
      }
    }

    const posts = await Post.find(query)
      .populate("author", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ success: false, message: "Not logged in" }, { status: 401 });
    }

    if (!postRoles.includes(token.role)) {
      return NextResponse.json({ success: false, message: "Not allowed" }, { status: 403 });
    }

    const body = await req.json();
    const title = body.title?.trim();
    const slug = createSlug(body.slug || title);
    const status = body.status === "draft" ? "draft" : "published";

    if (!title) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ success: false, message: "Slug is required" }, { status: 400 });
    }

    if (!Array.isArray(body.content?.blocks) || body.content.blocks.length === 0) {
      return NextResponse.json({ success: false, message: "Post content is required" }, { status: 400 });
    }

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return NextResponse.json({ success: false, message: "A post with this slug already exists" }, { status: 400 });
    }

    const post = await Post.create({
      title,
      slug,
      content: body.content,
      excerpt: body.excerpt?.trim() || createExcerpt(body.content, title),
      featuredImage: body.featuredImage?.trim() || "",
      category: body.category?.trim() || "general",
      tags: normalizeTags(body.tags),
      status,
      author: token.sub,
    });

    return NextResponse.json({ success: true, message: "Post created", post });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
