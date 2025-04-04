/**
 * Generate a random hex colour string e.g., "#1FA3F1"
 */
export function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  Array(6).forEach(() => {
    color += letters[Math.floor(Math.random() * 16)];
  });
  return color;
}
