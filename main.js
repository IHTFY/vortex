// Global variables
let multiplier = 2;
let modulus = 9;
let dots = [];
let destinations = [];

// HTML elements
const multiplierInput = document.querySelector('#multiplierInput');
const multiplierSlider = document.querySelector('#multiplierSlider');
const display = document.querySelector('#display');


// Calculate display size
const W = display.clientWidth;
const H = W;
const R = W * 0.4;
const C = W / 2

// Create the SVG element
const svg = d3.create('svg').attr('viewBox', [0, 0, W, H]);
display.appendChild(svg.node());

// D3 selections
let dotSelection;
let lineSelection;

// Draw the circle
const drawCircle = (C, R) => {
  svg
    .append('circle')
    .attr('cx', C)
    .attr('cy', C)
    .attr('r', R)
    .style('fill', 'none')
    .style('stroke', 'gray')
    .style('stroke-width', '5px');
};

// Calculate Dots
const calcDots = (mod) => {
  const offset = -Math.PI / 2;
  dots = Array(1000).fill({ x: C, y: C - R });
  for (let i = 0; i < mod; i++) {
    const angle = (i * (Math.PI * 2)) / mod + offset;
    dots[i] = {
      x: C + R * Math.cos(angle),
      y: C + R * Math.sin(angle)
    };
  };
};

// Calculate Destinations
const calcDestinations = (mult, mod) => {
  destinations = Array(1000).fill(0);
  for (let i = 0; i < mod; i++) {
    destinations[i] = (i * mult) % mod;
  }
  console.log(destinations);
}

// Initialize dots
const initDots = () => {
  dots = Array(1000).fill(0);
  dotSelection = svg.selectAll('circle[fill="orange"]').data(dots)
    .enter()
    .append('circle')
    .attr('r', R / 50)
    .style('fill', 'orange')
    .attr('cx', C)
    .attr('cy', C - R);
}

// Initilize lines
const initLines = () => {
  destinations = Array(1000).fill(0);
  lineSelection = svg.selectAll('line').data(destinations)
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', 0)
    .style('stroke', 'navy')
    .style('stroke-width', 1);
}


// Draw the dots
const updateDots = (dots) => {
  dotSelection
    .data(dots)
    .transition()
    .duration(100)
    .attr('cx', (d) => d.x)
    .attr('cy', (d) => d.y);
};

// Draw the lines
const updateLines = (dots, destinations) => {
  lineSelection
    .data(destinations)
    .transition()
    .duration(100)
    .attr('x1', (d, i) => dots[i].x)
    .attr('y1', (d, i) => dots[i].y)
    .attr('x2', (d) => dots[d].x)
    .attr('y2', (d) => dots[d].y);
};

drawCircle(C, R);
initLines(destinations);
initDots(dots);

// A function that updates the display
const updateDisplay = (mult, mod) => {
  calcDots(mod);
  updateDots(dots);
  calcDestinations(mult, mod);
  updateLines(dots, destinations);
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

/** 
 * Link inputs to variables and eachother
 */
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

/**
 * Initialize the drawing
 */
updateMultiplier(multiplier);
updateModulus(modulus);
updateDisplay(multiplier, modulus);