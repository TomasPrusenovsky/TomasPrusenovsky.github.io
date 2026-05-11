const g = 9.81;

function getDerivatives(currentState) {
  let [th1, om1, th2, om2] = currentState;
  
  // th1' je om1. th2' je om2.
  let d_th1 = om1;
  let d_th2 = om2;

  // Rozdíl úhlů (často se opakuje)
  let delta = th1 - th2;

  // Soustava rovnic má tvar:
  // A * d_om1 + B * d_om2 = C
  // D * d_om1 + E * d_om2 = F

  // Koeficienty z první rovnice (zkráceno o l1)
  let A = (m1 + m2) * L1;
  let B = m2 * L2 * Math.cos(delta);
  let C = -m2 * L2 * Math.sin(delta) * om2 * om2 - (m1 + m2) * g * Math.sin(th1);

  // Koeficienty z druhé rovnice (zkráceno o m2 a l2)
  let D = L1 * Math.cos(delta);
  let E = L2;
  let F = L1 * Math.sin(delta) * om1 * om1 - g * Math.sin(th2);

  // Výpočet zrychlení (Cramerovo pravidlo pro soustavu 2x2)
  let denominator = A * E - B * D;
  
  let d_om1 = (C * E - B * F) / denominator;
  let d_om2 = (A * F - C * D) / denominator;

  return [d_th1, d_om1, d_th2, d_om2];
}

function stepRK4(state, dt) {
  // k1 = f(t, y)
  let k1 = getDerivatives(state);
  
  // k2 = f(t + dt/2, y + dt/2 * k1)
  let state_k2 = state.map((val, i) => val + 0.5 * dt * k1[i]);
  let k2 = getDerivatives(state_k2);
  
  // k3 = f(t + dt/2, y + dt/2 * k2)
  let state_k3 = state.map((val, i) => val + 0.5 * dt * k2[i]);
  let k3 = getDerivatives(state_k3);
  
  // k4 = f(t + dt, y + dt * k3)
  let state_k4 = state.map((val, i) => val + dt * k3[i]);
  let k4 = getDerivatives(state_k4);

  // Update state: y_new = y + dt/6 * (k1 + 2*k2 + 2*k3 + k4)
  for (let i = 0; i < state.length; i++) {
    state[i] += (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  }
}
