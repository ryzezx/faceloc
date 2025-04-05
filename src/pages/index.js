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
  if (!file || !location) return;

  setUploading(true);
  const fileName = `${Date.now()}-${file.name}`;

  // 1. Upload foto ke Supabase Storage
  const { data, error: uploadError } = await supabase.storage
    .from("photos")
    .upload(fileName, file);

  if (uploadError) {
    alert("Gagal upload foto: " + uploadError.message);
    setUploading(false);
    return;
  }

  // 2. Ambil URL foto
  const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${fileName}`;

  // 3. Simpan data lokasi + foto ke table Supabase
  const { error: insertError } = await supabase
    .from("photos") // <-- nama table
    .insert([
      {
        file_url: fileUrl,
        latitude: location.latitude,
        longitude: location.longitude,
      },
    ]);

  if (insertError) {
    alert("Gagal simpan data ke database: " + insertError.message);
  } else {
    alert("Foto & lokasi berhasil disimpan!");
  }

  setUploading(false);
};


  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content="Ambil foto dan lokasi lalu upload ke Supabase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
        <main className={styles.main}>
          <h1></h1>

        {location && (
          <p>
            Latitude: {location.latitude}
            <br />
            Longitude: {location.longitude}
          </p>
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
        </footer>
      </div>
    </>
  );
}
