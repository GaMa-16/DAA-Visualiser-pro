const text = "DAA VISUALIZER";
const freq = {};
for (const char of text) freq[char] = (freq[char] || 0) + 1;

let leaves = Object.entries(freq).map(([char, f]) => ({
  id: `leaf-${char === ' ' ? 'Space' : char}`,
  char: char === ' ' ? 'Space' : char,
  freq: f,
  isLeaf: true
})).sort((a, b) => a.freq - b.freq || a.char.localeCompare(b.char));

let forest = [...leaves];
const sequence = [];

const cloneNode = (node) => ({
  ...node,
  left: node.left ? cloneNode(node.left) : undefined,
  right: node.right ? cloneNode(node.right) : undefined
});

let internalId = 0;
while (forest.length > 1) {
  forest.sort((a, b) => a.freq - b.freq || (a.char || a.id).localeCompare(b.char || b.id));

  const left = forest[0];
  const right = forest[1];

  const newNode = {
    id: `node-${internalId++}`,
    freq: left.freq + right.freq,
    left,
    right,
    isLeaf: false
  };

  forest = [newNode, ...forest.slice(2)];
  
  // also pushing cloned forest
  sequence.push(forest.map(cloneNode));
}

const root = forest[0];
const allCoords = {};

const assignCoords = (node, leftBound, rightBound, depth) => {
  if (!node) return;
  const x = (leftBound + rightBound) / 2;
  const y = 40 + depth * 60;
  allCoords[node.id] = { x, y };

  if (!node.isLeaf) {
    assignCoords(node.left, leftBound, x, depth + 1);
    assignCoords(node.right, x, rightBound, depth + 1);
  }
};

if (root) assignCoords(root, 20, 580, 0);

console.log("Root ID:", root.id);
console.log("allCoords keys count:", Object.keys(allCoords).length);
console.log("A coords:", allCoords["leaf-A"]);
console.log("D coords:", allCoords["leaf-D"]);
console.log("Space coords:", allCoords["leaf-Space"]);
console.log("Some sequence 0 IDs:", sequence[0].map(n => n.id).join(", "));
