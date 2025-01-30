import { openDB } from "idb";

let db;

async function createDB() {
    try {
        db = await openDB('banco', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('imagens')) {
                    const store = db.createObjectStore('imagens', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    store.createIndex('timestamp', 'timestamp');
                    console.log("Banco de dados criado com sucesso!");
                }
            }
        });
        console.log("Banco de dados carregado com sucesso!");
    } catch (e) {
        console.error("Erro ao criar o banco de dados:", e.message);
    }
}

async function saveImage(imageData) {
    if (!db) await createDB();
    const tx = db.transaction("imagens", "readwrite");
    const store = tx.objectStore("imagens");
    await store.add({ image: imageData, timestamp: Date.now() });
    console.log("Imagem salva no IndexedDB!");
}

async function loadImages() {
    if (!db) await createDB();
    const tx = db.transaction("imagens", "readonly");
    const store = tx.objectStore("imagens");
    const images = await store.getAll();

    const imageContainer = document.getElementById("image-container");
    imageContainer.innerHTML = "";

    images.forEach(({ image }) => {
        const img = document.createElement("img");
        img.src = image;
        img.classList.add("stored-image");
        imageContainer.appendChild(img);
    });

    console.log("Imagens carregadas do IndexedDB!");
}

async function clearImages() {
    if (!db) await createDB();
    const tx = db.transaction("imagens", "readwrite");
    const store = tx.objectStore("imagens");
    await store.clear();
    console.log("Todas as imagens foram apagadas do IndexedDB!");
}

export { createDB, saveImage, loadImages, clearImages};
