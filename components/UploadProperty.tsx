"use client";

import { useState } from "react";
import { uploadImage } from "@/utils/uploadImage";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UploadProperty() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!image) {
      alert("Please select an image.");
      setLoading(false);
      return;
    }

    // Upload the image & get the URL
    const imageUrl = await uploadImage(image);

    if (!imageUrl) {
      alert("Image upload failed.");
      setLoading(false);
      return;
    }

    // Store property details in the database
    const { error } = await supabase.from("properties").insert([
      {
        name,
        price: parseInt(price),
        location,
        imageUrl, // Store the uploaded image URL
      },
    ]);

    if (error) {
      console.error("Error adding property:", error);
      alert("Failed to add property.");
    } else {
      alert("Property added successfully!");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add a New Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Property Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-indigo-600 transition"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Add Property"}
        </button>
      </form>
    </div>
  );
}
