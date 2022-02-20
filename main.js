// Global variables
let multiplier = 2;
let modulus = 9;
let dots = [];

// HTML elements
const multiplierInput = document.querySelector('#multiplierInput');
const multiplierSlider = document.querySelector('#multiplierSlider');
const display = document.querySelector('#display');


// Initialize the display
const W = display.clientWidth;
const H = W;
const R = W * 0.4;
const C = W / 2

// Create the SVG element
const svg = d3.create('svg').attr('viewBox', [0, 0, W, H]);
display.appendChild(svg.node());

// draw a circle using D3
svg
  .append('circle')
  .attr('cx', C)
  .attr('cy', C)
  .attr('r', R)
  .style('fill', 'none')
  .style('stroke', 'black')
  .style('stroke-width', '2px');



const drawDots = (mod) => {
  const offset = -Math.PI / 2;
  dots = [];
  for (let i = 0; i < mod; i++) {
    const x = C + R * Math.cos(offset + i * 2 * Math.PI / mod);
    const y = C + R * Math.sin(offset + i * 2 * Math.PI / mod);
    dots.push({ x, y });
  }
  
  svg
    .selectAll('circle')
    .data(dots)
    .enter()
    .append('circle')
    .attr('cx', (d) => d.x)
    .attr('cy', (d) => d.y)
    .attr('r', (d) => R / 200)
    .style('fill', 'black');

}

// A function that updates the display
const updateDisplay = (mult, mod) => {
  svg.selectAll('*').remove();
  drawDots(mod);
};

// A function that updates the multiplier
const updateMultiplier = (v) => {
  multiplier = v;
  updateDisplay(multiplier, modulus);
};

// A function that updates the modulus
const updateModulus = (v) => {
  modulus = v;
  updateDisplay(multiplier, modulus);
};

/** Link inputs to variables and eachother */
// The Multiplier
multiplierInput.oninput = (e) => {
  updateMultiplier(e.target.value);
  multiplierSlider.value = multiplier;
}
multiplierSlider.oninput = (e) => {
  updateMultiplier(e.target.value);
  multiplierInput.value = multiplier;
  multiplierInput.labels[0].classList.add('active');
}

// The Modulus
modulusInput.oninput = (e) => {
  updateModulus(e.target.value);
  modulusSlider.value = modulus;
}
modulusSlider.oninput = (e) => {
  updateModulus(e.target.value);
  modulusInput.value = modulus;
  modulusInput.labels[0].classList.add('active');
}


// Initialze the drawing
updateMultiplier(multiplier);
updateModulus(modulus);
updateDisplay(multiplier, modulus);