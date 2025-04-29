/**
 * Generate a random hex colour string e.g., "#1FA3F1"
 */
export function getRandomColor() {
    var letters = "0123456789abcdef";
    var color = "#";
    Array(6)
        .fill(null)
        .forEach(() => {
        color += letters[Math.floor(Math.random() * 16)];
    });
    return color;
}
