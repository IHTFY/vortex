// Global variables
let multiplier;
let modulus;

// HTML elements
const multiplierInput = document.querySelector('#multiplierInput');
const multiplierSlider = document.querySelector('#multiplierSlider');
const display = document.querySelector('#display');

/** Link inputs to variables and eachother */
// The Multiplier
multiplierInput.oninput = (e) => {
  multiplier = e.target.value;
  multiplierSlider.value = multiplier;
}
multiplierSlider.oninput = (e) => {
  multiplier = e.target.value;
  multiplierInput.value = multiplier;
  multiplierInput.labels[0].classList.add('active');
}

// The Modulus
modulusInput.oninput = (e) => {
  modulus = e.target.value;
  modulusSlider.value = modulus;
}
modulusSlider.oninput = (e) => {
  modulus = e.target.value;
  modulusInput.value = modulus;
  modulusInput.labels[0].classList.add('active');
}


// make the element the largest square that fits on screen


const W = display.clientWidth;
const H = W;


// Create the SVG element
const svg = d3.create('svg').attr('viewBox', [0, 0, W, H]);
display.appendChild(svg.node());

// draw a circle using D3
svg
  .append('circle')
  .attr('cx', W / 2)
  .attr('cy', H / 2)
  .attr('r', W * 0.4)
  .style('fill', 'none')
  .style('stroke', 'black').style('stroke-width', '2px');