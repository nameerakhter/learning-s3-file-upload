"use client";
import { useState } from "react";

export default function Home() {
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

    console.log(file);
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
