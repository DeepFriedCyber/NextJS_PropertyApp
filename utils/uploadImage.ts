import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadImage(file: File): Promise<string | null> {
  try {
    // Generate a unique file name
    const filePath = `properties/${Date.now()}-${file.name}`;

    // Upload to Supabase Storage (Replace "property-images" with your bucket name)
    const { data, error } = await supabase.storage
      .from("property-images") // Your storage bucket name
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    // Construct the public URL
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-images/${filePath}`;
    
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}
