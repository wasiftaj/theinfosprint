import { connectDB } from "@/lib/db";
import { canManagePost, createExcerpt, createSlug, normalizeTags } from "@/lib/posts";
import Post from "@/models/Post";
import "@/models/User";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const post = await Post.findById(id).populate("author", "name email role");

    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (post.status !== "published" && !canManagePost(token, post)) {
      return NextResponse.json({ success: false, message: "Not allowed" }, { status: 403 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { id } = params;
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    if (!canManagePost(token, post)) {
      return NextResponse.json({ success: false, message: "Not allowed" }, { status: 403 });
    }

    const body = await req.json();
    const title = body.title?.trim();
    const slug = createSlug(body.slug || title);

    if (!title || !slug) {
      return NextResponse.json({ success: false, message: "Title and slug are required" }, { status: 400 });
    }

    if (!Array.isArray(body.content?.blocks) || body.content.blocks.length === 0) {
      return NextResponse.json({ success: false, message: "Post content is required" }, { status: 400 });
    }

    const slugConflict = await Post.findOne({ slug, _id: { $ne: id } });
    if (slugConflict) {
      return NextResponse.json({ success: false, message: "A post with this slug already exists" }, { status: 400 });
    }

    post.title = title;
    post.slug = slug;
    post.content = body.content;
    post.excerpt = body.excerpt?.trim() || createExcerpt(body.content, title);
    post.featuredImage = body.featuredImage?.trim() || "";
    post.category = body.category?.trim() || "general";
    post.tags = normalizeTags(body.tags);
    post.status = body.status === "draft" ? "draft" : "published";

    await post.save();

    return NextResponse.json({ success: true, message: "Post updated", post });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { id } = params;
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    if (!canManagePost(token, post)) {
      return NextResponse.json({ success: false, message: "Not allowed" }, { status: 403 });
    }

    await post.deleteOne();

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
