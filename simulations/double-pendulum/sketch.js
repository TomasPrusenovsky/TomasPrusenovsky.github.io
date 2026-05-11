let state = [Math.PI / 2, 0, Math.PI / 2, 0];

let path = [];

let checkboxTrace;
let isPaused = false;
let sliderM1, sliderM2, sliderL1, sliderL2, sliderSpeed;
let sliderTh1, sliderTh2, sliderOm1, sliderOm2;
let valM1, valM2, valL1, valL2, valSpeed;
let valTh1, valTh2, valOm1, valOm2;
let btnReset, btnPause;
let m1, m2, L1, L2, simSpeed;

function setup() {
  let kontejner = document.getElementById('kontejner-kyvadla');
  let canvas = createCanvas(kontejner.offsetWidth, 500);
  canvas.parent('kontejner-kyvadla');

  sliderM1 = document.getElementById('sliderM1');
  sliderM2 = document.getElementById('sliderM2');
  sliderL1 = document.getElementById('sliderL1');
  sliderL2 = document.getElementById('sliderL2');
  sliderSpeed = document.getElementById('sliderSpeed');
  checkboxTrace = document.getElementById('checkboxTrace');
  sliderTh1 = document.getElementById('sliderTh1');
  sliderTh2 = document.getElementById('sliderTh2');
  sliderOm1 = document.getElementById('sliderOm1');
  sliderOm2 = document.getElementById('sliderOm2');

  valM1 = document.getElementById('valM1');
  valM2 = document.getElementById('valM2');
  valL1 = document.getElementById('valL1');
  valL2 = document.getElementById('valL2');
  valSpeed = document.getElementById('valSpeed');
  valTh1 = document.getElementById('valTh1');
  valTh2 = document.getElementById('valTh2');
  valOm1 = document.getElementById('valOm1');
  valOm2 = document.getElementById('valOm2');
  btnReset = document.getElementById('btnReset');
  btnPause = document.getElementById('btnPause');

  const clearPath = () => { 
    path = []; 
    Plotly.deleteTraces('graf-kontejner', 0);
    Plotly.addTraces('graf-kontejner', {
        x: [], y: [], mode: 'markers', type: 'scatter', marker: { size: 3, color: '#e4002b' }
    });
  };

  sliderM1.addEventListener('input', clearPath);
  sliderM2.addEventListener('input', clearPath);
  sliderL1.addEventListener('input', clearPath);
  sliderL2.addEventListener('input', clearPath);
  sliderSpeed.addEventListener('input', clearPath);

  sliderTh1.addEventListener('input', () => valTh1.innerText = sliderTh1.value);
  sliderTh2.addEventListener('input', () => valTh2.innerText = sliderTh2.value);
  sliderOm1.addEventListener('input', () => valOm1.innerText = sliderOm1.value);
  sliderOm2.addEventListener('input', () => valOm2.innerText = sliderOm2.value);

  btnReset.addEventListener('click', () => {
    let th1 = parseFloat(sliderTh1.value) * Math.PI / 180;
    let om1 = parseFloat(sliderOm1.value);
    let th2 = parseFloat(sliderTh2.value) * Math.PI / 180;
    let om2 = parseFloat(sliderOm2.value);
    state = [th1, om1, th2, om2];
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
    title: 'Konfigurační prostor (θ1 vs θ2)',
    xaxis: { title: 'Úhel θ1 [rad]', range: [-Math.PI, Math.PI] },
    yaxis: { title: 'Úhel θ2 [rad]', range: [-Math.PI, Math.PI] },
    margin: { l: 50, r: 20, b: 50, t: 50 }
  };

  Plotly.newPlot('graf-kontejner', [trace], layout, {responsive: true});
}

function draw() {
  background(20);

  m1 = parseFloat(sliderM1.value);
  m2 = parseFloat(sliderM2.value);
  L1 = parseFloat(sliderL1.value);
  L2 = parseFloat(sliderL2.value);
  simSpeed = parseFloat(sliderSpeed.value);

  valM1.innerText = m1;
  valM2.innerText = m2;
  valL1.innerText = L1;
  valL2.innerText = L2;
  valSpeed.innerText = simSpeed;

  if (!isPaused) {
    let dt = 0.05 * simSpeed; 
    
    for(let i = 0; i < 5; i++) {
       stepRK4(state, dt / 5);
    }
  }

let [th1, om1, th2, om2] = state;

  let normTh1 = th1 % TWO_PI; 
  if (normTh1 > PI) normTh1 -= TWO_PI; else if (normTh1 < -PI) normTh1 += TWO_PI;
  
  let normTh2 = th2 % TWO_PI; 
  if (normTh2 > PI) normTh2 -= TWO_PI; else if (normTh2 < -PI) normTh2 += TWO_PI;

  let x1 = L1 * Math.sin(th1);
  let y1 = L1 * Math.cos(th1);
  let x2 = x1 + L2 * Math.sin(th2);
  let y2 = y1 + L2 * Math.cos(th2);

  if (!isPaused) {
    if (checkboxTrace.checked) {
      Plotly.extendTraces('graf-kontejner', {
        x: [[normTh1]],
        y: [[normTh2]]
      }, [0], 1000);

      path.push([x2, y2]);
      if (path.length > 300) {
        path.shift();
      }
    } else {
      path = [];
    }
  }

  push();
  translate(width / 2, 200); 

  noFill();
  stroke(255, 100);
  strokeWeight(2);
  beginShape();
  for (let pt of path) {
    vertex(pt[0], pt[1]);
  }
  endShape();

  stroke(255);
  strokeWeight(3);
  line(0, 0, x1, y1);
  line(x1, y1, x2, y2);

  fill(200, 50, 50);
  noStroke();
  circle(x1, y1, m1 * 2);
  circle(x2, y2, m2 * 2);
  pop();
}

function windowResized() {
  let kontejner = document.getElementById('kontejner-kyvadla');
  resizeCanvas(kontejner.offsetWidth, 500);
  Plotly.Plots.resize(document.getElementById('graf-kontejner'));
}