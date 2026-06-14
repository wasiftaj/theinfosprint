import { v2 as cloudinary } from "cloudinary";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ success: false, message: "Not logged in" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, message: "File size exceeds 10 MB limit" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, message: "Invalid file type. Only images allowed." }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();

    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "theinfosprint",
          resource_type: "auto",
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            resolve(
              NextResponse.json({ success: false, message: "Upload failed: " + error.message }, { status: 500 })
            );
          } else {
            resolve(
              NextResponse.json({
                success: true,
                message: "Image uploaded successfully",
                url: result.secure_url,
                publicId: result.public_id,
              })
            );
          }
        }
      );

      uploadStream.end(Buffer.from(buffer));
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
