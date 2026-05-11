const g = 9.81;

function getDerivatives(currentState) {
  let [th, om] = currentState;
  
  let d_th = om;
  
  // Lagrangeova rovnice pro jednoduché kyvadlo: th'' = -(g/L) * sin(th)
  let d_om = -(g / L) * Math.sin(th);

  return [d_th, d_om];
}

function stepRK4(state, dt) {
  let k1 = getDerivatives(state);
  
  let state_k2 = state.map((val, i) => val + 0.5 * dt * k1[i]);
  let k2 = getDerivatives(state_k2);
  
  let state_k3 = state.map((val, i) => val + 0.5 * dt * k2[i]);
  let k3 = getDerivatives(state_k3);
  
  let state_k4 = state.map((val, i) => val + dt * k3[i]);
  let k4 = getDerivatives(state_k4);

  for (let i = 0; i < state.length; i++) {
    state[i] += (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  }
}