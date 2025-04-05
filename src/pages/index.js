import Head from "next/head";
import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { createClient } from "@supabase/supabase-js";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [location, setLocation] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Gagal ambil lokasi:", err.message);
        }
      );
    }
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("photos")
      .upload(fileName, file);

    if (!error) {
      alert("Foto berhasil di-upload!");
    } else {
      alert("Gagal upload foto: " + error.message);
    }

    setUploading(false);
  };

  return (
    <>
      <Head>
        <title>Foto & Lokasi App</title>
        <meta name="description" content="Ambil foto dan lokasi lalu upload ke Supabase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
        <main className={styles.main}>
          <h1>📍 Foto & Lokasi</h1>

          {location ? (
            <p>
              Latitude: {location.latitude}
              <br />
              Longitude: {location.longitude}
            </p>
          ) : (
            <p>Mengambil lokasi...</p>
          )}

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            disabled={uploading}
            style={{ marginTop: "1rem" }}
          />
          {uploading && <p>Uploading...</p>}
        </main>

        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} LokasiApp</p>
        </footer>
      </div>
    </>
  );
}
