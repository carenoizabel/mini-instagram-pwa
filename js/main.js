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

cameraTrigger.onclick = function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  
  const imageData = cameraSensor.toDataURL("image/webp");

  if (imageData) {
    let images = JSON.parse(localStorage.getItem("capturedImages")) || [];
    images.push(imageData);
    localStorage.setItem("capturedImages", JSON.stringify(images));

    cameraOutput.src = imageData;
    cameraOutput.classList.add("taken");

    console.log("Imagem salva no LocalStorage!");
  }
};

function loadStoredImages() {
  let images = JSON.parse(localStorage.getItem("capturedImages")) || [];
  const imageContainer = document.getElementById("image-container");

  imageContainer.innerHTML = "";

  images.forEach(imageData => {
    const img = document.createElement("img");
    img.src = imageData;
    img.classList.add("stored-image");
    imageContainer.appendChild(img);
  });

  console.log("Imagens carregadas do LocalStorage!");
}

window.addEventListener("load", function() {
  loadStoredImages();
  cameraStart();
});

document.getElementById("clear-images").addEventListener("click", function () {
  localStorage.removeItem("capturedImages");
  loadStoredImages();
  console.log("Todas as imagens foram apagadas!");
});
