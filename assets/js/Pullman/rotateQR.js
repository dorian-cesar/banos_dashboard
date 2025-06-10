// rotateQR.js

let firstRotationDone = false;

function rotateQR() {
  const qrElement = document.querySelector(".img-qr");

  if (qrElement) {
    let currentRotation = parseInt(qrElement.getAttribute("data-rotation")) || 0;

    // Si es la primera vez, hacemos reset explícito
    if (!firstRotationDone) {
      currentRotation = 0;
      firstRotationDone = true;
    } else {
      currentRotation += 90;
    }

    qrElement.style.transform = `rotate(${currentRotation}deg)`;
    qrElement.setAttribute("data-rotation", currentRotation);

    console.log(`QR rotado a ${currentRotation} grados`);
  }
}


// Observador de cambios en el DOM
const observer = new MutationObserver(() => {
  const btnBaño = document.querySelector(".btn-genera-baño");
  const btnDucha = document.querySelector(".btn-genera-ducha");

  if (btnBaño && !btnBaño.hasAttribute("data-rotate-attached")) {
    btnBaño.addEventListener("click", rotateQR);
    btnBaño.setAttribute("data-rotate-attached", "true");
    console.log("Botón Baño conectado a rotar QR");
  }

  if (btnDucha && !btnDucha.hasAttribute("data-rotate-attached")) {
    btnDucha.addEventListener("click", rotateQR);
    btnDucha.setAttribute("data-rotate-attached", "true");
    console.log("Botón Ducha conectado a rotar QR");
  }
});

// Empezamos a observar
observer.observe(document.body, { childList: true, subtree: true });
