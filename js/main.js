import { createDB, saveImage, loadImages, clearImages } from "./db.js";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      let reg;
      reg = await navigator.serviceWorker.register('/sw.js', { type: 'module' });
      console.log('Service Worker registrado com sucesso:', reg);
    } catch (err) {
      console.error('Falha ao registrar o Service Worker:', err);
    }
  });
}

var constraints = {
  video: { facingMode: "user" },
  audio: false,
};

window.addEventListener("load", async () => {
  await createDB();
  console.log("Banco de dados carregado com sucesso!");
})

const cameraView = document.querySelector("#camera--view"),
      cameraOutput = document.querySelector("#camera--output"),
      cameraSensor = document.querySelector("#camera--sensor"),
      cameraTrigger = document.querySelector("#camera--trigger");

async function cameraStart() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    cameraView.srcObject = stream;
  } catch (error) {
    console.error("Ocorreu um erro ao acessar a câmera.", error);
  }
}

cameraTrigger.onclick = async function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  
  const imageData = cameraSensor.toDataURL("image/webp");

  if (imageData) {
    await saveImage(imageData); // salvando no db
    cameraOutput.src = imageData; 
    cameraOutput.classList.add("taken");

    console.log("Imagem salva no IndexedDB!");
    console.log("📸 Foto capturada com sucesso!");
  }
};

window.addEventListener("load", async() => {
  await loadImages();
  await cameraStart();
});

document.getElementById("clear-images").addEventListener("click", async () => {
await clearImages()
await loadImages()
console.log("Todas as imagens foram apagadas!");
});
