// Global variables
let multiplier = 2;
let modulus = 9;
const MAX = 250; // html has hard coded max="250"

// HTML elements
const multiplierInput = document.querySelector('#multiplierInput');
const multiplierSlider = document.querySelector('#multiplierSlider');

const showLabelsCheckbox = document.querySelector('#showLabelsCheckbox');
const showArrowsCheckbox = document.querySelector('#showArrowsCheckbox');
const colorLinesCheckbox = document.querySelector('#colorLinesCheckbox');
const byLengthCheckbox = document.querySelector('#byLengthCheckbox');
const byLoopCheckbox = document.querySelector('#byLoopCheckbox');

const display = document.querySelector('#display');


// Calculate display size
const W = display.clientWidth;
const H = W;
const R = W * 0.45;
const C = W / 2

// Create the SVG element
const svg = d3.create('svg').attr('viewBox', [0, 0, W, H]);
display.appendChild(svg.node());


// i ∈ ℤ : i ∈ [1, floor(modulus / 2)]
// distance = min(|a-b|, modulus - |a-b|)]
const distance = (origin, destination, mod) => {
  const delta = Math.abs(origin - destination);
  const dist = Math.min(delta, mod - delta);
  if (dist < 1 || dist > mod / 2) return 0;
  return dist;

};
const lineColor = (startIndex, endIndex, mod, loops) => {
  const dist = distance(startIndex, endIndex, mod);
  if (dist < 1) return 'none';
  if (!colorLinesCheckbox.checked) return 'navy';
  if (byLengthCheckbox.checked) return d3.interpolateHclLong("blue", "red")(dist / Math.floor(mod / 2));
  if (byLoopCheckbox.checked) {
    const numLoops = Math.max(...loops);
    return d3.interpolateHclLong("blue", "red")(loops[endIndex] / numLoops);
  };
  return 'navy';
};

// Create the arrowhead
svg.append('defs').append('marker')
  .attr('id', 'arrowhead')
  .attr('viewBox', '0 0 10 6')
  .attr('refX', 10)
  .attr('refY', 3)
  .attr('markerWidth', 5)
  .attr('markerHeight', 3)
  .attr('orient', 'auto-start-reverse')
  .append('path')
  .attr('d', 'M 0 0 L 10 3 L 0 6 z')
  .attr('fill', 'gray')
// .attr('fill', 'context-fill');

// D3 selections
let dotSelection;
let lineSelection;
let labelSelection;

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
const calcDots = mod => {
  const offset = -Math.PI / 2;
  dots = Array(MAX).fill({ x: C, y: C - R });
  for (let i = 0; i < mod; i++) {
    const angle = (i * (Math.PI * 2)) / mod + offset;
    dots[i] = {
      x: C + R * Math.cos(angle),
      y: C + R * Math.sin(angle)
    };
  };
  return dots;
};

// Calculate Destinations
const calcDestinations = (mult, mod) => {
  const destinations = Array(MAX).fill(0);
  for (let i = 0; i < mod; i++) {
    destinations[i] = (i * mult) % mod;
  }
  return destinations;
}

// Calculate Loops
const calcLoops = (dest, mod) => {
  dest = dest.slice(0, mod);
  let enumerated = Array(mod);
  let loopNumber = 0;
  let frontier = [];
  let traced = [];

  while (traced.length < mod) {
    // find next untraced node
    for (let i = 0; i < mod; i++) {
      if (!traced.includes(i)) {
        frontier.push(i);
        break;
      }
    }

    // trace the frontier forwards and backwards
    while (frontier.length > 0) {
      if (traced.includes(frontier[0])) {
        frontier.shift();
        continue;
      }
      // add the destination to the frontier
      frontier.push(dest[frontier[0]]);

      // find all nodes whose destination is the current node
      for (let j = 0; j < mod; j++) {
        if (dest[j] === frontier[0]) {
          frontier.push(j);
        }
      }

      // add the current node to the traced list
      let completed = frontier.shift();
      enumerated[completed] = loopNumber;
      traced.push(completed);
    }
    loopNumber++
  }

  return enumerated;
}


// Initialize dots
const initDots = () => {
  const dots = Array(MAX).fill(0);
  dotSelection = svg.selectAll('circle[fill="orange"]').data(dots)
    .enter()
    .append('circle')
    .attr('r', R / 50)
    .style('fill', 'orange')
    .attr('cx', C)
    .attr('cy', C - R);

  labelSelection = svg.selectAll('circle[fill="orange"]').data(dots)
    .enter()
    .append('text')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('fill', 'none')
    .text((d, i) => i);

};

// Initilize lines
const initLines = () => {
  const destinations = Array(MAX).fill(0);

  lineSelection = svg.selectAll('line').data(destinations)
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', 0)
    .style('stroke-width', 5)
}

// Draw the dots
const updateDots = dots => {
  dotSelection
    .data(dots)
    .transition()
    .duration(100)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);


  labelSelection
    .data(dots)
    .transition()
    .duration(100)
    .attr('x', d => (1.05 * (d.x - C)) + C)
    .attr('y', d => (1.05 * (d.y - C)) + C)
    .attr('fill', (d, i) => i >= modulus || !showLabelsCheckbox.checked ? 'none' : 'black');

};

// Draw the lines
const updateLines = (dots, destinations, loops) => {
  lineSelection
    .data(destinations)
    .attr('stroke', (d, i) => lineColor(i, d, modulus, loops))
    .attr('marker-end', (d, i) => distance(i, d, modulus) < 1 || !showArrowsCheckbox.checked ? 'none' : 'url(#arrowhead)')
    .transition()
    .duration(100)
    .attr('x1', (d, i) => dots[i].x)
    .attr('y1', (d, i) => dots[i].y)
    .attr('x2', d => dots[d].x)
    .attr('y2', d => dots[d].y);
};

const initDisplay = () => {
  drawCircle(C, R);
  initLines();
  initDots();
};

// A function that updates the display
const updateDisplay = (mult, mod) => {
  const dots = calcDots(mod);
  updateDots(dots);
  const dest = calcDestinations(mult, mod);
  const loops = calcLoops(dest, mod);
  updateLines(dots, dest, loops);
};

// If checkboxes change, update display
showLabelsCheckbox.addEventListener('change', () => updateDisplay(multiplier, modulus));
showArrowsCheckbox.addEventListener('change', () => updateDisplay(multiplier, modulus));

colorLinesCheckbox.addEventListener('change', () => {
  colorLinesCheckbox.checked ?
    byLengthCheckbox.disabled = byLoopCheckbox.disabled = false
    :
    byLengthCheckbox.disabled = byLoopCheckbox.disabled = true;

  updateDisplay(multiplier, modulus);
});

byLengthCheckbox.addEventListener('change', () => updateDisplay(multiplier, modulus));
byLoopCheckbox.addEventListener('change', () => updateDisplay(multiplier, modulus));



// A function that updates the multiplier
const updateMultiplier = v => {
  multiplier = v;
  updateDisplay(multiplier, modulus);
};

// A function that updates the modulus
const updateModulus = v => {
  modulus = v;
  updateDisplay(multiplier, modulus);
};

/** 
 * Link inputs to variables and eachother
 */
// The Multiplier
multiplierInput.oninput = e => {
  updateMultiplier(e.target.value);
  multiplierSlider.value = multiplier;
}
multiplierSlider.oninput = e => {
  updateMultiplier(e.target.value);
  multiplierInput.value = multiplier;
  multiplierInput.labels[0].classList.add('active');
}

// The Modulus
modulusInput.oninput = e => {
  updateModulus(e.target.value);
  modulusSlider.value = modulus;
}
modulusSlider.oninput = e => {
  updateModulus(e.target.value);
  modulusInput.value = modulus;
  modulusInput.labels[0].classList.add('active');
}

/**
 * Initialize the drawing
 */
initDisplay();
updateDisplay(multiplier, modulus);