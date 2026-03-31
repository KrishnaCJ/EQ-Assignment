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

// Comprehensive test cases - verified with algorithm logic
const testCases = [
  // Basic test cases from problem statement
  { input: 7, expectedEarnings: 3000, expectedSolution: "T: 1 P: 0 C: 0" },
  { input: 8, expectedEarnings: 4500, expectedSolution: "T: 1 P: 0 C: 0" },
  { input: 13, expectedEarnings: 16500, expectedSolution: "T: 2 P: 0 C: 0" },
  
  // Edge cases
  { input: 0, expectedEarnings: 0, expectedSolution: "T: 0 P: 0 C: 0" },
  { input: 1, expectedEarnings: 0, expectedSolution: "T: 0 P: 0 C: 0" },
  { input: 2, expectedEarnings: 0, expectedSolution: "T: 0 P: 0 C: 0" },
  { input: 3, expectedEarnings: 0, expectedSolution: "T: 0 P: 0 C: 0" },
  { input: 4, expectedEarnings: 0, expectedSolution: "T: 0 P: 0 C: 0" },
  
  // Single building cases
  { input: 5, expectedEarnings: 1000, expectedSolution: "T: 0 P: 1 C: 0" },
  { input: 6, expectedEarnings: 2000, expectedSolution: "T: 0 P: 1 C: 0" },
  { input: 9, expectedEarnings: 6000, expectedSolution: "T: 1 P: 0 C: 0" },
  { input: 10, expectedEarnings: 8500, expectedSolution: "T: 1 P: 1 C: 0" },
  
  // Multiple buildings
  { input: 14, expectedEarnings: 19500, expectedSolution: "T: 2 P: 0 C: 0" },
  { input: 15, expectedEarnings: 23500, expectedSolution: "T: 2 P: 1 C: 0" },
  { input: 20, expectedEarnings: 46000, expectedSolution: "T: 3 P: 1 C: 0" },
  { input: 25, expectedEarnings: 76000, expectedSolution: "T: 4 P: 1 C: 0" },
  
  // Commercial Park cases
  { input: 11, expectedEarnings: 11000, expectedSolution: "T: 1 P: 1 C: 0" },
  { input: 12, expectedEarnings: 13500, expectedSolution: "T: 2 P: 0 C: 0" },
  { input: 19, expectedEarnings: 40500, expectedSolution: "T: 3 P: 0 C: 0" },
  { input: 30, expectedEarnings: 113500, expectedSolution: "T: 5 P: 1 C: 0" },
  
  // Large values
  { input: 49, expectedEarnings: 324000, expectedSolution: "T: 9 P: 0 C: 0" },
  { input: 50, expectedEarnings: 338500, expectedSolution: "T: 9 P: 1 C: 0" },
  { input: 100, expectedEarnings: 1426000, expectedSolution: "T: 19 P: 1 C: 0" }
];

let passedTests = 0;
let failedTests = 0;

console.log("=".repeat(80));
console.log("MARS LAND PROFIT - COMPREHENSIVE TEST SUITE");
console.log("=".repeat(80));

testCases.forEach((testCase, index) => {
  const result = solveMarsLandProfit(testCase.input);
  const earningsMatch = result.earnings === testCase.expectedEarnings;
  const solutionMatch = result.solution === testCase.expectedSolution;
  const passed = earningsMatch && solutionMatch;

  if (passed) {
    passedTests++;
    console.log(`✅ Test ${index + 1} PASSED - Input: ${testCase.input}`);
  } else {
    failedTests++;
    console.log(`❌ Test ${index + 1} FAILED - Input: ${testCase.input}`);
    if (!earningsMatch) {
      console.log(`   Expected Earnings: $${testCase.expectedEarnings}, Got: $${result.earnings}`);
    }
    if (!solutionMatch) {
      console.log(`   Expected Solution: ${testCase.expectedSolution}, Got: ${result.solution}`);
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
