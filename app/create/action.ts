"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const acceptedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/tiff",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/avi",
  "video/mov",
  "video/wmv",
  "video/mkv",
];
const maxFileSize = 1024 * 1024 * 10; //10MB
export async function getUrl(type: string, size: number, checksum: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { failure: "Not Authenticated" };
  }

  if (!acceptedTypes.includes(type)) {
    return NextResponse.json(
      {
        message: "File type not supported",
      },
      { status: 400 },
    );
  }
  if (size > maxFileSize) {
    return NextResponse.json(
      {
        message: "File size must not exceed 10MB",
      },
      { status: 400 },
    );
  }
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: "test-file",
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    // Metadata:{
    //   userId: session.user?.email
    // }
  });

  const signedUrl = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  return { success: { url: signedUrl } };
}
