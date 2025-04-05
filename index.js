import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });

  // Nyalakan kamera saat pertama kali load
  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Gagal mengakses kamera", err);
      }
    };

    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Gagal mendapatkan lokasi", err);
        }
      );
    };

    getCamera();
    getLocation();
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    setPhoto(imageData);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>📸 Ambil Foto & Lokasi</h1>

      <div>
        <video ref={videoRef} autoPlay playsInline style={{ width: '300px', borderRadius: '10px' }} />
        <br />
        <button onClick={takePhoto} style={{ marginTop: '1rem' }}>
          Ambil Foto
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {photo && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Hasil Foto:</h3>
          <img src={photo} alt="Hasil Foto" style={{ width: '300px', borderRadius: '10px' }} />
        </div>
      )}

      {location.lat && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Lokasi Anda:</h3>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lng}</p>
        </div>
      )}
    </div>
  );
}
