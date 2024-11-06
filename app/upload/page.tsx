"use client";
import { useState } from "react";
import { NextResponse } from "next/server";
import { getUrl } from "../create/action";

type SignedUrlResponse = {
  success?: { url: string };
  failure?: string;
};

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export default function Upload() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFile(file);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    } else {
      setFileUrl(undefined);
    }
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (file) {
        const checksum = await computeSHA256(file);
        const getSignedUrlResult = (await getUrl(
          file.type,
          file.size,
          checksum,
        )) as SignedUrlResponse;
        console.log(getSignedUrlResult);
        if (getSignedUrlResult.failure !== undefined) {
          return NextResponse.json(
            {
              message: "failed",
            },
            { status: 400 },
          );
        }

        const url = getSignedUrlResult.success.url;
        console.log({ url });
        await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
        console.log(file);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-3  p-4  my-auto">
          <input
            type="file"
            placeholder="upload file"
            className="p-4 rounded-xl border-white border-2"
            accept="image/*,video/*" // Allows only image and video files
            onChange={handleChange}
          />
          {fileUrl && file && (
            <div className="mt-4">
              {file.type.startsWith("image/") ? (
                <img width="300" src={fileUrl} alt="Selected file" />
              ) : file.type.startsWith("video/") ? (
                <video src={fileUrl} controls width="300" muted />
              ) : null}
            </div>
          )}
          <button
            type="submit"
            className="bg-white text-black rounded-xl px-4 border-2 border-white"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}
