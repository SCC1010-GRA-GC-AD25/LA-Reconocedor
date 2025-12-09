// Classifier Variable
let classifier;
// IMPORTANTE: Cambia esto al nombre de tu carpeta del modelo
let imageModelURL = './my_model/';

// Video
let video;
let flippedVideo;
// Para guardar la clasificación
let label = "";
let confianza = 0;
let modelLoaded = false;
let videoReady = false;

function preload() {
  console.log("🔄 Cargando modelo desde:", imageModelURL);
  classifier = ml5.imageClassifier(imageModelURL + 'model.json', modelReady, modelError);
}

function modelReady() {
  console.log("✅ ¡MODELO CARGADO CORRECTAMENTE!");
  modelLoaded = true;
  if (videoReady) {
    classifyVideo();
  }
}

function modelError(error) {
  console.error("❌ ERROR AL CARGAR MODELO:", error);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log("✅ Canvas creado");

  video = createCapture(VIDEO, camReady);
  video.size(320, 240);
  video.hide();
}

function camReady() {
  console.log("✅ ¡CÁMARA LISTA!");
  videoReady = true;
  if (modelLoaded) {
    flippedVideo = ml5.flipImage(video);
    classifyVideo();
  }
}

function draw() {
  background(0);

  if (!videoReady || !modelLoaded) {
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Cargando...", width / 2, height / 2 - 40);
    
    if (!videoReady) {
      fill(255, 200, 0);
      text("⏳ Esperando cámara", width / 2, height / 2);
    }
    if (!modelLoaded) {
      fill(255, 200, 0);
      text("⏳ Cargando modelo", width / 2, height / 2 + 40);
    }
    return;
  }

  // Dibujar video en la esquina superior izquierda con efecto espejo
  push();
  translate(320, 0);
  scale(-1, 1);
  image(video, 0, 0, 320, 240);
  pop();

  // Caja negra para el texto
  fill(0);
  rect(0, 240, 320, 60);
  
  // Mostrar predicción
  fill(255);
  textSize(16);
  textAlign(CENTER);

  let mostrar = "";

 
  if (label === "iphone") {
    mostrar = "📱 Un iPhone!";
  } else if (label === "Termo") {
    mostrar = "🫗 Un termo!";
  } else if (label === "Sabritas") {
    mostrar = "🍟 Unas Sabritas!";
  } else {
    mostrar = "❓ No sé qué es";
  }

  if (confianza < 0.70) {
    mostrar = "❓ No sé qué es";
  }

  text(mostrar, 160, 260);
  textSize(14);
  text(`Confianza: ${confianza}`, 160, 280);
}

function classifyVideo() {
  if (!videoReady || !modelLoaded) {
    return;
  }
  
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();
}

function gotResult(error, results) {
  if (error) {
    console.error("❌ Error en clasificación:", error);
    return;
  }

  if (results && results[0]) {
    label = results[0].label;
    confianza = results[0].confidence.toFixed(2);
    console.log("Detectado:", label, "- Confianza:", confianza);
  }

  classifyVideo();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}