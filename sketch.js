// Classifier Variable
let classifier;
// Model URL
let imageModelURL = './my_model/';
let confianza = 0;
let texto = "";
// Video
let video;
let flippedVideo;
// To store the classification
let label = "";

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(320, 260);
  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  flippedVideo = ml5.flipImage(video);
  // Start classifying
  classifyVideo();
}

function draw() {
  background(0);
  // Draw the video
  image(flippedVideo, 0, 0);
  
  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  
  // TUS 3 CLASES - Cambia los nombres según los pusiste en Teachable Machine
  if (label === "iphone") {
    texto = "📱 Un iPhone!";
  } else if (label === "Termo") {
    texto = "🫗 Un termo!";
  } else if (label === "Sabritas") {
    texto = "🍟 Unas Sabritas!";
  } else {
    texto = "❓ No lo reconozco";
  }
  
  // Si la confianza es baja, mostrar que no reconoce
  if (confianza < 0.7) {
    texto = "❓ No lo reconozco";
  }
  
  text(texto + " " + confianza, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  label = results[0].label;
  confianza = results[0].confidence.toFixed(2);
  // Classify again!
  classifyVideo();
}