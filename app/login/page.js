"use client";
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import Notification from "@/components/Notification";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";

const firebaseConfig = {
  apiKey: "AIzaSyA5RmKXcwcIQl7s23PxmytmSgEFtaJwhQI",
  authDomain: "mmc-data-93bf3.firebaseapp.com",
  projectId: "mmc-data-93bf3",
  storageBucket: "mmc-data-93bf3.appspot.com",
  messagingSenderId: "435887892180",
  appId: "1:435887892180:web:d060cc06f60d08bedd7d41",
  measurementId: "G-Q3VDQJNV3W",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "admins", user.uid));
      if (userDoc.exists()) {
        toast.success("Login Successful!!!", {
          position: "top-right",
          autoClose: 1500,
        });

        setTimeout(() => {
          router.push("/admin");
        }, 1500);
      } else {
        toast.error("You don't have admin privileges.", {
          position: "top-right",
        });
        await auth.signOut();
      }
    } catch (error) {
      toast.error("Invalid email or password.", {
        position: "top-right",
      });
    } finally {
      setTimeout(() => {
        setLoader(false);
      }, 500);
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
