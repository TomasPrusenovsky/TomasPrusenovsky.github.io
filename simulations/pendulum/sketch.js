let state = [Math.PI / 2, 0];
let t = 0;

let checkboxTrace;
let isPaused = false;
let sliderM, sliderL, sliderTh, sliderOm, sliderSpeed;
let valM, valL, valTh, valOm, valSpeed;
let btnReset, btnPause;

let m, L, simSpeed;

function setup() {
  let kontejner = document.getElementById('kontejner-kyvadla');
  let canvas = createCanvas(kontejner.offsetWidth, 500);
  canvas.parent('kontejner-kyvadla');

  sliderM = document.getElementById('sliderM');
  sliderL = document.getElementById('sliderL');
  sliderTh = document.getElementById('sliderTh');
  sliderOm = document.getElementById('sliderOm');
  sliderSpeed = document.getElementById('sliderSpeed');
  checkboxTrace = document.getElementById('checkboxTrace');

  valM = document.getElementById('valM');
  valL = document.getElementById('valL');
  valTh = document.getElementById('valTh');
  valOm = document.getElementById('valOm');
  valSpeed = document.getElementById('valSpeed');
  btnReset = document.getElementById('btnReset');
  btnPause = document.getElementById('btnPause');

  const clearPath = () => {
    Plotly.deleteTraces('graf-kontejner', 0);
    Plotly.addTraces('graf-kontejner', {
        x: [], y: [], mode: 'markers', type: 'scatter', marker: { size: 3, color: '#e4002b' }
    });
    Plotly.deleteTraces('graf-cas', 0);
    Plotly.addTraces('graf-cas', {
        x: [], y: [], mode: 'lines', type: 'scatter', line: { color: '#003366' }
    });
  };

  sliderM.addEventListener('input', clearPath);
  sliderL.addEventListener('input', clearPath);
  sliderSpeed.addEventListener('input', clearPath);
  
  sliderTh.addEventListener('input', () => valTh.innerText = sliderTh.value);
  sliderOm.addEventListener('input', () => valOm.innerText = sliderOm.value);

  btnReset.addEventListener('click', () => {
    let th = parseFloat(sliderTh.value) * Math.PI / 180;
    let om = parseFloat(sliderOm.value);
    state = [th, om];
    t = 0;
    isPaused = false;
    btnPause.innerText = "Pozastavit";
    clearPath();
  });

  btnPause.addEventListener('click', () => {
    isPaused = !isPaused;
    btnPause.innerText = isPaused ? "Spustit" : "Pozastavit";
  });

  let trace = {
    x: [],
    y: [],
    mode: 'markers',
    type: 'scatter',
    marker: { size: 3, color: '#e4002b' }
  };

  let layout = {
    title: 'Fázový prostor (θ vs ω)',
    xaxis: { title: 'Úhel θ [rad]', range: [-Math.PI, Math.PI] },
    yaxis: { title: 'Úhlová rychlost ω [rad/s]', range: [-10, 10] },
    margin: { l: 50, r: 20, b: 50, t: 50 }
  };

  Plotly.newPlot('graf-kontejner', [trace], layout, {responsive: true});

  let traceCas = {
    x: [],
    y: [],
    mode: 'lines',
    type: 'scatter',
    line: { color: '#003366' }
  };

  let layoutCas = {
    title: 'Úhlová rychlost vs. Čas',
    xaxis: { title: 'Čas [s]' },
    yaxis: { title: 'Úhlová rychlost ω [rad/s]' },
    margin: { l: 50, r: 20, b: 50, t: 50 }
  };

  Plotly.newPlot('graf-cas', [traceCas], layoutCas, {responsive: true});
}

function draw() {
  background(20);

  m = parseFloat(sliderM.value);
  L = parseFloat(sliderL.value);
  simSpeed = parseFloat(sliderSpeed.value);

  valM.innerText = m;
  valL.innerText = L;
  valSpeed.innerText = simSpeed;

  if (!isPaused) {
    let dt = 0.05 * simSpeed; 
    for(let i = 0; i < 5; i++) {
       stepRK4(state, dt / 5);
       t += dt / 5;
    }
  }

  let [th, om] = state;

  let normTh = th % TWO_PI; 
  if (normTh > PI) normTh -= TWO_PI; else if (normTh < -PI) normTh += TWO_PI;
  
  if (!isPaused) {
    if (checkboxTrace.checked) {
      Plotly.extendTraces('graf-kontejner', { x: [[normTh]], y: [[om]] }, [0], 800);
      Plotly.extendTraces('graf-cas', { x: [[t]], y: [[om]] }, [0], 800);
    }
  }

  push();
  translate(width / 2, 200); 

  let x = L * Math.sin(th);
  let y = L * Math.cos(th);

  stroke(255);
  strokeWeight(3);
  line(0, 0, x, y);

  fill(200, 50, 50);
  noStroke();
  circle(x, y, m * 2);
  
  fill(255);
  circle(0, 0, 8);
  pop();
}

function windowResized() {
  let kontejner = document.getElementById('kontejner-kyvadla');
  resizeCanvas(kontejner.offsetWidth, 500);
  Plotly.Plots.resize(document.getElementById('graf-kontejner'));
  Plotly.Plots.resize(document.getElementById('graf-cas'));
}