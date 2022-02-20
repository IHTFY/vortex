// Global variables
let multiplier;
let modulus;

// HTML elements
const multiplierInput = document.querySelector('#multiplierInput');
const multiplierSlider = document.querySelector('#multiplierSlider');

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


// draw a circle using D3
const svg = d3.select('#display');
svg
  .append('circle')
  .attr('cx', '50%')
  .attr('cy', '50%')
  .attr('r', 100)
  .style('fill', 'none')
  .style('stroke', 'black');