function solveMarsLandProfit(n) {
  const BUILDINGS = [
    { id: "T", name: "Theatre", time: 5, rate: 1500 },
    { id: "P", name: "Pub", time: 4, rate: 1000 },
    { id: "C", name: "Commercial Park", time: 10, rate: 3000 }
  ];

  const maxEarnings = new Array(n + 1).fill(0);
  const lastBuildingAdded = new Array(n + 1).fill(null);

  for (let t = 1; t <= n; t++) {
    for (const building of BUILDINGS) {
      if (t >= building.time) {
        const currentProfit = (t - building.time) * building.rate + maxEarnings[t - building.time];

        if (currentProfit > maxEarnings[t]) {
          maxEarnings[t] = currentProfit;
          lastBuildingAdded[t] = building;
        }
      }
    }
  }

  const mix = { T: 0, P: 0, C: 0 };
  let remainingTime = n;

  while (remainingTime > 0 && lastBuildingAdded[remainingTime]) {
    const building = lastBuildingAdded[remainingTime];
    mix[building.id]++;
    remainingTime -= building.time;
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