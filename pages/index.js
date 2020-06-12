import Head from "next/head";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState();
  useEffect(() => {
    const currentImage = localStorage.getItem("currentImage");
    if (currentImage) setUploadedImage(currentImage);
  }, []);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = async function (e) {
              const res = await axios.post("/upload", {
                image: e.target.result,
              });
              if (res.data) {
                localStorage.setItem("currentImage", res.data.image);
                setUploadedImage(res.data.image);
              }
            };
            reader.readAsDataURL(file);
          }
        }}
      />
      <img src={uploadedImage} alt="image" />
    </>
  );
}
