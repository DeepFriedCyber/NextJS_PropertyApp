import { storage } from '@/lib/firebaseClient';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadImage(file: File): Promise<string | null> {
  try {
    const filePath = `properties/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, filePath);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}
