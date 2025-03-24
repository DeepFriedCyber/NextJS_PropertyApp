"use client";
import { useState } from "react";
import { storage } from "@/lib/firebaseClient";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function TestUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first");
      return;
    }

    try {
      setStatus("Uploading...");
      const storageRef = ref(storage, `test/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setStatus(`Upload successful! URL: ${url}`);
    } catch (error) {
      console.error("Upload error:", error);
      setStatus(`Upload failed: ${(error as Error).message}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto mt-8">
      <h2 className="text-lg font-bold mb-4">Test Firebase Storage</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!file}
      >
        Upload Test File
      </button>
      {status && (
        <p className="mt-4 text-sm text-gray-600">
          Status: {status}
        </p>
      )}
    </div>
  );
}
