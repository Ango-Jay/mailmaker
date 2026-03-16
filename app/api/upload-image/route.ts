import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

/**
 * POST /api/upload-image
 * Accepts multipart/form-data with field "file" (image).
 * Uploads to Cloudinary and returns { url: string } (secure_url).
 * Requires CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME + API_KEY + API_SECRET in env.
 */
export async function POST(request: NextRequest) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
      url: process.env.CLOUDINARY_URL,
    });
  } else if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  } else {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET." },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing or invalid file. Send a field named 'file'." },
      { status: 400 }
    );
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP." },
      { status: 400 }
    );
  }

  let buffer: Buffer;
  try {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } catch {
    return NextResponse.json(
      { error: "Failed to read file" },
      { status: 400 }
    );
  }

  try {
    const uploadResult = await new Promise<{ secure_url?: string; url?: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "mailmaker",
              resource_type: "image",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result ?? {});
            }
          )
          .end(buffer);
      }
    );

    const url = uploadResult.secure_url ?? uploadResult.url;
    if (!url) {
      return NextResponse.json(
        { error: "Upload succeeded but no URL returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
