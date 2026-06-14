import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password, role } = await req.json();
    const allowedRoles = ["admin", "editor", "author"];

    if (role && !allowedRoles.includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
    }

    // create user (password will auto-hash from model)
    const user = await User.create({
      name,
      email,
      password,
      role: role || "author",
    });

    return NextResponse.json({ success: true, message: "User registered successfully", user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
