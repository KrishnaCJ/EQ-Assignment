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

const testCases = [
  { input: 7, expectedEarnings: 3000, expectedCombinations: 2 },
  { input: 8, expectedEarnings: 4500, expectedCombinations: 1 },
  { input: 13, expectedEarnings: 16500, expectedCombinations: 1 },
  { input: 0, expectedEarnings: 0, expectedCombinations: 0 },
  { input: 1, expectedEarnings: 0, expectedCombinations: 0 },
  { input: 2, expectedEarnings: 0, expectedCombinations: 0 },
  { input: 3, expectedEarnings: 0, expectedCombinations: 0 },
  { input: 4, expectedEarnings: 0, expectedCombinations: 0 },
  { input: 5, expectedEarnings: 1000, expectedCombinations: 1 },
  { input: 6, expectedEarnings: 2000, expectedCombinations: 1 },
  { input: 9, expectedEarnings: 6000, expectedCombinations: 2 },
  { input: 10, expectedEarnings: 8500, expectedCombinations: 1 },
  { input: 14, expectedEarnings: 19500, expectedCombinations: 2 },
  { input: 15, expectedEarnings: 23500, expectedCombinations: 1 },
  { input: 20, expectedEarnings: 46000, expectedCombinations: 1 },
  { input: 25, expectedEarnings: 76000, expectedCombinations: 1 },
  { input: 11, expectedEarnings: 11000, expectedCombinations: 1 },
  { input: 12, expectedEarnings: 13500, expectedCombinations: 2 },
  { input: 19, expectedEarnings: 40500, expectedCombinations: 2 },
  { input: 30, expectedEarnings: 113500, expectedCombinations: 1 },
  { input: 49, expectedEarnings: 324000, expectedCombinations: 2 },
  { input: 50, expectedEarnings: 338500, expectedCombinations: 1 },
  { input: 100, expectedEarnings: 1426000, expectedCombinations: 1 }
];

let passedTests = 0;
let failedTests = 0;

console.log("=".repeat(80));
console.log("MARS LAND PROFIT - COMPREHENSIVE TEST SUITE");
console.log("=".repeat(80));

testCases.forEach((testCase, index) => {
  const result = findAllCombinations(testCase.input);
  const earningsMatch = result.maxEarnings === testCase.expectedEarnings;
  const combinationsMatch = result.combinations.length === testCase.expectedCombinations;
  const passed = earningsMatch && combinationsMatch;

  if (passed) {
    passedTests++;
    console.log(`✅ Test ${index + 1} PASSED - Input: ${testCase.input}`);
  } else {
    failedTests++;
    console.log(`❌ Test ${index + 1} FAILED - Input: ${testCase.input}`);
    if (!earningsMatch) {
      console.log(`   Expected Earnings: $${testCase.expectedEarnings}, Got: $${result.maxEarnings}`);
    }
    if (!combinationsMatch) {
      console.log(`   Expected Combinations: ${testCase.expectedCombinations}, Got: ${result.combinations.length}`);
    }
  }
});

console.log("=".repeat(80));
console.log(`RESULTS: ${passedTests} passed, ${failedTests} failed out of ${testCases.length} tests`);
console.log("=".repeat(80));

if (failedTests === 0) {
  console.log("🎉 ALL TESTS PASSED!");
} else {
  console.log(`⚠️  ${failedTests} test(s) failed. Please review the logic.`);
}
