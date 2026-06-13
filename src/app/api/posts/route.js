import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  try {
    await connectDB();

    // check logged in user
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return Response.json({ success: false, message: "Not logged in" }, { status: 401 });
    }

    // role check
    if (!["admin", "editor"].includes(token.role)) {
      return Response.json({ success: false, message: "Not allowed" }, { status: 403 });
    }

    const body = await req.json();

    const post = await Post.create({
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      featuredImage: body.featuredImage,
      category: body.category,
      tags: body.tags,
      author: token.sub,
    });

    return Response.json({
      success: true,
      message: "Post created",
      post,
    });

  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}