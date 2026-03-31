function solveMarsLandProfit(n) {
  const BUILDINGS = [
    { id: "T", name: "Theatre", time: 5, rate: 1500 },
    { id: "P", name: "Pub", time: 4, rate: 1000 },
    { id: "C", name: "Commercial Park", time: 10, rate: 3000 }
  ];

  const maxEarnings = new Array(n + 1).fill(0);
  const lastBuildingAdded = new Array(n + 1).fill(null);

  for (let t = 1; t <= n; t++) {
    maxEarnings[t] = maxEarnings[t - 1];
    
    for (const building of BUILDINGS) {
      if (t >= building.time) {
        const buildingEarnings = (n - t) * building.rate;
        const currentProfit = buildingEarnings + maxEarnings[t - building.time];
        
        if (currentProfit > maxEarnings[t]) {
          maxEarnings[t] = currentProfit;
          lastBuildingAdded[t] = building;
        }
      }
    }
  }

  const mix = { T: 0, P: 0, C: 0 };
  let currentTime = n;

  while (currentTime > 0) {
    let found = false;
    for (let t = currentTime; t > 0; t--) {
      if (lastBuildingAdded[t]) {
        const building = lastBuildingAdded[t];
        mix[building.id]++;
        currentTime = t - building.time;
        found = true;
        break;
      }
    }
    if (!found) break;
  }

  return {
    earnings: maxEarnings[n],
    solution: `T: ${mix.T} P: ${mix.P} C: ${mix.C}`
  };
}

const testCases = [7, 8, 13];

console.log("--- Mars Land Challenge Results ---");
testCases.forEach((time) => {
  const result = solveMarsLandProfit(time);
  console.log(`Input Time: ${time}`);
  console.log(`Output -> Earnings: $${result.earnings}`);
  console.log(`          Solution: ${result.solution}`);
  console.log('-----------------------------------');
});
