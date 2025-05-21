const splashTexts = [
  "Welcome to Velara!",
  "ahahahhah",
  "axon sucks, fight me!",
  "you didnt even see this",
  "what did you just do",
  "i like the sound of this",
  "i dont think this is a good idea",
  "watermelon > chicken",
  "Velara > 55gms",
  "i dont know what this is",
  "V2 finally here",
  "contains no uranium 235",
  "V2 before GTA 6 is crazy",
  "also try brunys ixl",
  "Sub to @freezable3d",
  "izaiah escobar a bitch",
];

const splashTextElement = document.getElementById("random-texts");
const randomIndex = Math.floor(Math.random() * splashTexts.length);
splashTextElement.textContent = splashTexts[randomIndex];
