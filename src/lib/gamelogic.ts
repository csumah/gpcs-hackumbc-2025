// Defines the structure for the player's financial state
export interface PlayerState {
  year: number;
  quarter: number;
  cash: number;
  investments: {
    volatileETF: number; // Value invested in the volatile ETF
    longTermETF: number; // Value invested in the long-term ETF
  };
  portfolioHistory: { year: number; value: number }[]; // For the graph
  isGameOver: boolean;
}

// Defines a single market event for a quarter
export interface MarketEvent {
  year: number;
  quarter: number;
  marketCondition: string; // e.g., "Bull Market", "Correction"
  returns: {
    volatileETF: number; // e.g., 0.1 for +10%
    longTermETF: number; // e.g., 0.04 for +4%
  };
  houseInsight: string; // Vague advice for the player
}

// Defines the economic conditions for a full year
export interface EconomicYear {
  year: number;
  inflation: number; // Yearly inflation rate, constant for all 4 quarters
  events: MarketEvent[];
}

// Defines the actions a player can take
export type PlayerAction =
  | { type: 'HIT'; etf: 'volatileETF' | 'longTermETF'; amount: number }
  | { type: 'STAND' }
  | { type: 'WITHDRAW'; etf: 'volatileETF' | 'longTermETF'; amount: number };

// --- GAME DATA ---
// A predefined 5-year data set for a controlled hackathon demo.
export const gameData: EconomicYear[] = [
  // Year 1: A good, but volatile year
  {
    year: 1,
    inflation: 0.03, // 3% inflation
    events: [
      { year: 1, quarter: 1, marketCondition: "Strong Growth", returns: { volatileETF: 0.12, longTermETF: 0.05 }, houseInsight: "The market is starting the year with strong momentum." },
      { year: 1, quarter: 2, marketCondition: "Tech Correction", returns: { volatileETF: -0.08, longTermETF: -0.01 }, houseInsight: "Some high-flying sectors seem a bit overheated." },
      { year: 1, quarter: 3, marketCondition: "Steady Gains", returns: { volatileETF: 0.07, longTermETF: 0.04 }, houseInsight: "Economic fundamentals appear solid and stable." },
      { year: 1, quarter: 4, marketCondition: "Holiday Rally", returns: { volatileETF: 0.10, longTermETF: 0.06 }, houseInsight: "Consumer spending is high, which could boost the market." },
    ],
  },
  // Year 2: A tougher year with high inflation
  {
    year: 2,
    inflation: 0.06, // 6% inflation
    events: [
      { year: 2, quarter: 1, marketCondition: "Inflation Fears", returns: { volatileETF: -0.05, longTermETF: -0.02 }, houseInsight: "Concerns about rising prices are making investors nervous." },
      { year: 2, quarter: 2, marketCondition: "Stagnation", returns: { volatileETF: 0.01, longTermETF: 0.005 }, houseInsight: "The market seems to be treading water, unsure of its direction." },
      { year: 2, quarter: 3, marketCondition: "Bear Market Rally", returns: { volatileETF: 0.08, longTermETF: 0.03 }, houseInsight: "We might be seeing a short-term bounce in a longer downturn." },
      { year: 2, quarter: 4, marketCondition: "Recession Confirmed", returns: { volatileETF: -0.15, longTermETF: -0.05 }, houseInsight: "Economic data has turned negative, brace for impact." },
    ],
  },
  // Year 3: The recovery begins
  {
    year: 3,
    inflation: 0.04, // 4% inflation
    events: [
      { year: 3, quarter: 1, marketCondition: "Finding the Bottom", returns: { volatileETF: -0.02, longTermETF: 0.01 }, houseInsight: "Volatility is high, but the worst might be over." },
      { year: 3, quarter: 2, marketCondition: "Early Recovery", returns: { volatileETF: 0.15, longTermETF: 0.07 }, houseInsight: "Optimism is returning as leading indicators turn positive." },
      { year: 3, quarter: 3, marketCondition: "Bull Market Begins", returns: { volatileETF: 0.12, longTermETF: 0.06 }, houseInsight: "This looks like the start of a new upward trend." },
      { year: 3, quarter: 4, marketCondition: "Strong Finish", returns: { volatileETF: 0.11, longTermETF: 0.05 }, houseInsight: "The year is ending on a very positive note for investors." },
    ],
  },
    // Year 4: A steady, low-drama year
  {
    year: 4,
    inflation: 0.02, // 2% inflation
    events: [
      { year: 4, quarter: 1, marketCondition: "Slow and Steady", returns: { volatileETF: 0.04, longTermETF: 0.02 }, houseInsight: "The market is taking a breather after last year's recovery." },
      { year: 4, quarter: 2, marketCondition: "Global Growth", returns: { volatileETF: 0.06, longTermETF: 0.03 }, houseInsight: "International markets are performing well, lifting all boats." },
      { year: 4, quarter: 3, marketCondition: "Summer Lull", returns: { volatileETF: 0.02, longTermETF: 0.01 }, houseInsight: "Trading volume is low and the market is quiet." },
      { year: 4, quarter: 4, marketCondition: "Modest Gains", returns: { volatileETF: 0.05, longTermETF: 0.03 }, houseInsight: "A calm and positive end to a calm and positive year." },
    ],
  },
  // Year 5: One last boom
  {
    year: 5,
    inflation: 0.025, // 2.5% inflation
    events: [
      { year: 5, quarter: 1, marketCondition: "New Tech Boom", returns: { volatileETF: 0.18, longTermETF: 0.07 }, houseInsight: "A new technology is capturing the market's imagination." },
      { year: 5, quarter: 2, marketCondition: "All-Time Highs", returns: { volatileETF: 0.15, longTermETF: 0.06 }, houseInsight: "Investor sentiment is extremely bullish right now." },
      { year: 5, quarter: 3, marketCondition: "Frothy Market", returns: { volatileETF: -0.05, longTermETF: 0.01 }, houseInsight: "The market seems a bit expensive; a small pullback is healthy." },
      { year: 5, quarter: 4, marketCondition: "Final Push", returns: { volatileETF: 0.10, longTermETF: 0.04 }, houseInsight: "Can the market end the 5-year simulation on a high note?" },
    ],
  },
];


// --- CORE GAME FUNCTIONS ---

/**
 * Initializes the game state for a new player.
 * @returns The starting PlayerState object.
 */
export function initializeGame(): PlayerState {
  return {
    year: 1,
    quarter: 1,
    cash: 10000, // Player starts with $10,000
    investments: {
      volatileETF: 0,
      longTermETF: 0,
    },
    portfolioHistory: [{ year: 0, value: 10000 }],
    isGameOver: false,
  };
}

/**
 * Processes a single quarter of the game based on the player's action.
 * @param currentState - The current state of the player's portfolio.
 * @param action - The action the player has chosen for the quarter.
 * @returns The new PlayerState after the quarter is resolved.
 */
export function processQuarter(
  currentState: PlayerState,
  action: PlayerAction
): PlayerState {
  // Deep copy the state to avoid mutations
  const newState = JSON.parse(JSON.stringify(currentState));

  // If the game is over, do nothing.
  if (newState.isGameOver) return newState;

  // Find the data for the current year and quarter
  const currentYearData = gameData.find(y => y.year === newState.year);
  if (!currentYearData) {
      console.error(`Game data not found for year: ${newState.year}`);
      newState.isGameOver = true;
      return newState;
  }
  const currentEvent = currentYearData.events.find(e => e.quarter === newState.quarter);
   if (!currentEvent) {
      console.error(`Event data not found for year: ${newState.year}, quarter: ${newState.quarter}`);
      newState.isGameOver = true;
      return newState;
  }

  // 1. Add quarterly income ($60k salary / 4 quarters)
  newState.cash += 2500;

  // 2. Process the player's action
  if (action.type === 'HIT') {
    const cost = action.amount > newState.cash ? newState.cash : action.amount; // Ensure player can't invest more cash than they have
    if (cost > 0) {
      newState.cash -= cost;
      newState.investments[action.etf] += cost;
    }
  } else if (action.type === 'WITHDRAW') {
    const amount = action.amount > newState.investments[action.etf] ? newState.investments[action.etf] : action.amount; // Ensure player can't withdraw more than invested
    if (amount > 0) {
      newState.investments[action.etf] -= amount;
      newState.cash += amount;
    }
  }
  // For 'STAND', we simply do nothing with investments this turn.

  // 3. Apply market returns to all existing investments
  newState.investments.volatileETF *= (1 + currentEvent.returns.volatileETF);
  newState.investments.longTermETF *= (1 + currentEvent.returns.longTermETF);

  // 4. Apply inflation to cash. We apply 1/4 of the yearly rate each quarter.
  newState.cash *= (1 - currentYearData.inflation / 4);

  // 5. Advance time and handle end-of-year logic
  if (newState.quarter === 4) {
    // End of year recap logic: calculate total value and add to history for the graph
    const totalValue = newState.cash + newState.investments.volatileETF + newState.investments.longTermETF;
    newState.portfolioHistory.push({ year: newState.year, value: totalValue });
    
    // Move to next year
    newState.year += 1;
    newState.quarter = 1;
  } else {
    newState.quarter += 1;
  }

  // 6. Check for game over condition
  if (newState.year > gameData.length) {
    newState.isGameOver = true;
  }

  return newState;
}
