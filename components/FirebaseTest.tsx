'use client';

import { useState } from "react";
import { storage, db, auth } from "@/lib/firebaseClient";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function FirebaseTest() {
  const [status, setStatus] = useState<{[key: string]: string}>({});

  // Test Storage
  const testStorage = async () => {
    try {
      setStatus(prev => ({ ...prev, storage: "Testing..." }));
      const testBlob = new Blob(["test"], { type: "text/plain" });
      const storageRef = ref(storage, `test/test-${Date.now()}.txt`);
      await uploadBytes(storageRef, testBlob);
      const url = await getDownloadURL(storageRef);
      setStatus(prev => ({ ...prev, storage: "✅ Storage working" }));
    } catch (error) {
      console.error("Storage test error:", error);
      setStatus(prev => ({ ...prev, storage: `❌ Storage error: ${(error as any).message}` }));
    }
  };

  // Test Firestore
  const testFirestore = async () => {
    try {
      setStatus(prev => ({ ...prev, firestore: "Testing..." }));
      const testCollection = collection(db, "test");
      await addDoc(testCollection, {
        test: true,
        timestamp: new Date()
      });
      setStatus(prev => ({ ...prev, firestore: "✅ Firestore working" }));
    } catch (error) {
      console.error("Firestore test error:", error);
      setStatus(prev => ({ ...prev, firestore: `❌ Firestore error: ${(error as any).message}` }));
    }
  };

  // Test Auth
  const testAuth = async () => {
    try {
      setStatus(prev => ({ ...prev, auth: "Testing..." }));
      const testEmail = `test${Date.now()}@example.com`;
      await createUserWithEmailAndPassword(auth, testEmail, "testPassword123!");
      setStatus(prev => ({ ...prev, auth: "✅ Auth working" }));
    } catch (error) {
      console.error("Auth test error:", error);
      setStatus(prev => ({ ...prev, auth: `❌ Auth error: ${(error as any).message}` }));
    }
  };

  return (
    <div className="p-6 border rounded-lg max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Firebase Configuration Test</h2>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={testStorage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Test Storage
          </button>
          <p className="mt-2 text-sm">{status.storage || "Not tested"}</p>
        </div>

        <div>
          <button
            onClick={testFirestore}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          >
            Test Firestore
          </button>
          <p className="mt-2 text-sm">{status.firestore || "Not tested"}</p>
        </div>

        <div>
          <button
            onClick={testAuth}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-full"
          >
            Test Auth
          </button>
          <p className="mt-2 text-sm">{status.auth || "Not tested"}</p>
        </div>
      </div>
    </div>
  );
}
