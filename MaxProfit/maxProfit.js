const BUILDINGS = [
  { symbol: 'T', name: 'Theatre', buildTime: 5, earningRate: 1500 },
  { symbol: 'P', name: 'Pub', buildTime: 4, earningRate: 1000 },
  { symbol: 'C', name: 'Commercial Park', buildTime: 10, earningRate: 2000 }
];

function computeEarnings(theatreCount, pubCount, commercialCount, totalTime) {
  let elapsedTime = 0, totalEarnings = 0;
  for (let i = 0; i < theatreCount; i++) {
    elapsedTime += 5;
    totalEarnings += (totalTime - elapsedTime) * 1500;
  }
  for (let i = 0; i < pubCount; i++) {
    elapsedTime += 4;
    totalEarnings += (totalTime - elapsedTime) * 1000;
  }
  for (let i = 0; i < commercialCount; i++) {
    elapsedTime += 10;
    totalEarnings += (totalTime - elapsedTime) * 2000;
  }
  return totalEarnings;
}

function maxProfitDP(totalTime) {
  const dpArray = new Array(totalTime + 1).fill(0);
  for (let currentTime = 1; currentTime <= totalTime; currentTime++) {
    for (const building of BUILDINGS) {
      if (currentTime >= building.buildTime) {
        const profitValue = (currentTime - building.buildTime) * building.earningRate + dpArray[currentTime - building.buildTime];
        if (profitValue > dpArray[currentTime]) {
          dpArray[currentTime] = profitValue;
        }
      }
    }
  }
  return dpArray[totalTime];
}

function findAllCombinations(totalTime) {
  const maxEarnings = maxProfitDP(totalTime);
  if (maxEarnings === 0) return { maxEarnings: 0, combinations: [] };

  const combinations = [];
  const maxBuildTime = totalTime - 1;

  for (let theatreCount = 0; theatreCount * 5 <= maxBuildTime; theatreCount++) {
    for (let pubCount = 0; theatreCount * 5 + pubCount * 4 <= maxBuildTime; pubCount++) {
      for (let commercialCount = 0; theatreCount * 5 + pubCount * 4 + commercialCount * 10 <= maxBuildTime; commercialCount++) {
        if (theatreCount + pubCount + commercialCount === 0) continue;
        if (computeEarnings(theatreCount, pubCount, commercialCount, totalTime) === maxEarnings) {
          combinations.push({ T: theatreCount, P: pubCount, C: commercialCount });
        }
      }
    }
  }
  return { maxEarnings: maxEarnings, combinations: combinations };
}

const testCases = [7, 8, 13, 49];

console.log("--- Mars Land Challenge Results ---");
testCases.forEach((time) => {
  const result = findAllCombinations(time);
  console.log(`Input Time: ${time}`);
  console.log(`Max Earnings: $${result.maxEarnings}`);
  console.log(`Valid combinations:`);
  result.combinations.forEach((combo) => {
    console.log(`T: ${combo.T}, P: ${combo.P}, C: ${combo.C}`);
  });
  console.log('-----------------------------------');
});
