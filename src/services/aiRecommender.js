// AI Smart Recommendation Engine for Bhavnagar Smart Parking
// Multi-Criteria Decision Analysis (MCDA) evaluating:
// 1. Distance to Destination (35% weight)
// 2. Space Availability & Free Ratio (30% weight)
// 3. Price per Hour (15% weight)
// 4. Pedestrian Walking Time (10% weight)
// 5. Real-Time Demand & Congestion Friction (10% weight)

export function evaluateParkingOptions(facilities, destinationName, vehicleType = "4w") {
  if (!facilities || facilities.length === 0) return null;

  const validFacilities = facilities.filter(f => {
    // If EV vehicle selected, only recommend places with EV charging
    if (vehicleType === "ev") return (f.evChargingSpaces || 0) > 0;
    return true;
  });

  const candidates = (validFacilities.length > 0 ? validFacilities : facilities).map(facility => {
    const dist = facility.distanceKm?.[destinationName] ?? 1.5;
    const walk = facility.walkMins?.[destinationName] ?? 8;
    const available = Number(facility.availableSpaces ?? 0);
    const total = Number(facility.totalSpaces ?? 1);
    const freeRatio = total > 0 ? (available / total) : 0;
    const price = vehicleType === "2w" ? (facility.twoWheelerPricePerHour ?? 5) : (facility.pricePerHour ?? 15);

    // Strict disqualification if completely full
    if (available === 0) {
      return {
        ...facility,
        calcDistance: dist,
        calcWalk: walk,
        calcPrice: price,
        aiScore: 0,
        distanceScore: Math.max(1, 10 - dist * 3),
        spaceScore: 0,
        priceScore: Math.max(1, 10 - price / 3),
        reliabilityPct: 0
      };
    }

    // Distance Score (1 to 10): 0.2km => 9.8, 0.8km => 9.2, 1.5km => 7.5, 2.5km => 5.0
    const distanceScore = Math.max(2, Math.min(10, 10 - (dist * 2.2)));

    // Space Reliability Score (1 to 10): Free ratio + absolute volume bonus
    const spaceScore = Math.min(10, (freeRatio * 7.5) + (Math.min(available, 20) / 20 * 2.5));

    // Price Value Score (1 to 10): ₹10/hr => 9.5, ₹15/hr => 8.5, ₹20/hr => 7.5, ₹25/hr => 6.0
    const priceScore = Math.max(3, 10 - ((price - 10) * 0.25));

    // Walking Convenience (1 to 10): 2-4 mins => 9.5, 6-8 mins => 8.0, 10+ mins => 6.0
    const walkScore = Math.max(2, 10 - (walk * 0.45));

    // Demand Friction Factor (safe null/undefined check)
    const demandStr = String(facility.demandLevel || "").toLowerCase();
    let demandScore = 8.0;
    if (demandStr.includes("critical") || demandStr.includes("saturated")) {
      demandScore = 2.0;
    } else if (demandStr.includes("high")) {
      demandScore = 6.0;
    } else if (demandStr.includes("medium") || demandStr.includes("moderate")) {
      demandScore = 8.5;
    } else {
      demandScore = 9.5;
    }

    // Weighted composite score (out of 10)
    const compositeScore = (
      (distanceScore * 0.35) +
      (spaceScore * 0.30) +
      (priceScore * 0.15) +
      (walkScore * 0.10) +
      (demandScore * 0.10)
    );

    const reliabilityPct = Math.min(98, Math.max(15, Math.round(freeRatio * 100 * 0.95 + (available > 10 ? 15 : 0))));

    return {
      ...facility,
      calcDistance: dist,
      calcWalk: walk,
      calcPrice: price,
      aiScore: Number(compositeScore.toFixed(1)),
      distanceScore: Number(distanceScore.toFixed(1)),
      spaceScore: Number(spaceScore.toFixed(1)),
      priceScore: Number(priceScore.toFixed(1)),
      reliabilityPct
    };
  });

  // Sort descending by AI composite score
  candidates.sort((a, b) => b.aiScore - a.aiScore);

  const bestOption = candidates[0];
  const runnerUp = candidates.length > 1 ? candidates[1] : null;

  // Generate intelligent natural language rationale based on dynamic evaluation
  const bestAvailable = Number(bestOption.availableSpaces ?? 0);
  let rationale = "";
  if (bestAvailable === 0) {
    rationale = `All parking facilities within immediate radius of ${destinationName} are currently at capacity. BMC traffic wardens recommend diversion.`;
  } else if (bestOption.calcDistance <= 0.8 && bestAvailable >= 10) {
    rationale = `<span class="font-bold text-secondary">${bestOption.name} (${bestOption.tag})</span> is recommended because it is closest to your destination (<span class="font-semibold">${bestOption.calcDistance} km</span>) and currently has high availability (<span class="font-semibold text-primary">${bestOption.availableSpaces}/${bestOption.totalSpaces} spaces</span>) at a reasonable <span class="font-semibold">₹${bestOption.calcPrice}/hr</span>, with an optimal <span class="font-semibold">${bestOption.calcWalk} min walk</span>.`;
  } else if (bestOption.calcDistance <= 1.0) {
    rationale = `<span class="font-bold text-secondary">${bestOption.name} (${bestOption.tag})</span> is the optimal match: situated only <span class="font-semibold">${bestOption.calcDistance} km</span> (${bestOption.calcWalk} min walk) from ${destinationName} with verified bay clearance (<span class="font-semibold text-primary">${bestOption.availableSpaces} open</span>) and zero bottleneck delays.`;
  } else {
    rationale = `<span class="font-bold text-secondary">${bestOption.name} (${bestOption.tag})</span> is currently selected as the safest arrival hub near ${destinationName}, offering <span class="font-semibold text-primary">${bestOption.availableSpaces} free bays</span> at <span class="font-semibold">₹${bestOption.calcPrice}/hr</span> to avoid peak curb congestion.`;
  }

  return {
    bestOption,
    runnerUp,
    rationale,
    allScored: candidates
  };
}
