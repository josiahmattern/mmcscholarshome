"use client";
import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, get } from "firebase/database";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import { auth, db } from "@/lib/firebaseConfig.js"; // Adjust this import path as needed
import Notification from "@/components/Notification";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const adminRef = ref(db, `admins/${user.uid}`);
      const adminSnapshot = await get(adminRef);
      if (adminSnapshot.exists()) {
        toast.success("Login Successful!!!", {
          position: "top-right",
          autoClose: 1000,
        });

        setTimeout(() => {
          router.push("/admin");
        }, 1500);
      } else {
        toast.error("You don't have admin privileges.", {
          position: "top-right",
        });
        await signOut(auth);
      }
    } catch (error) {
      toast.error("Invalid email or password", {
        position: "top-right",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Nav />
      <div className="flex-grow flex items-center justify-center bg-base-200 p-4">
        {user ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}</h1>
            <button onClick={handleLogout} className="btn btn-primary">
              Logout
            </button>
          </div>
        ) : (
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleLogin}>
              <h1 className="text-3xl font-bold text-center mb-4">
                Admin Login
              </h1>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  className="input input-bordered"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <div className="text-error text-sm mt-2">{error}</div>}
              <div className="form-control mt-6">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={loader}
                >
                  {loader ? "Loading..." : "Login"}
                  <PulseLoader size={10} loading={loader} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Notification />
    </main>
  );
}
