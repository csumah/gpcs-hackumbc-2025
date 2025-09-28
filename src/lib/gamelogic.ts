// src/lib/gamelogic.ts

// --- TYPE DEFINITIONS ---
// Defines the structure for the player's financial state
export interface PlayerState {
  year: number;
  quarter: number;
  cash: number;
  investments: {
    volatileETF: number;
    longTermETF: number;
  };
  savingsOnlyPortfolio: number;
  portfolioHistory: { 
    year: number; 
    value: number;
    cash: number;
    volatileETF: number;
    longTermETF: number;
  }[];
  savingsHistory: { year: number; value: number }[];
  isGameOver: boolean;
}

// Defines a single market event for a quarter
export interface MarketEvent {
  year: number;
  quarter: number;
  marketCondition: string;
  returns: {
    volatileETF: number;
    longTermETF: number;
  };
  houseInsight: string;
  misleadingInsight: string;
}

// Defines the economic conditions for a full year
export interface EconomicYear {
  year: number;
  inflation: number;
  events: MarketEvent[];
}

// Defines the actions a player can take
export type PlayerAction =
  | { type: 'HIT'; etf: 'volatileETF' | 'longTermETF'; amount: number }
  | { type: 'STAND' }
  | { type: 'WITHDRAW'; etf: 'volatileETF' | 'longTermETF'; amount: number };


// --- NEW GAME DATA WITH 5-YEAR MARKET CYCLE ---
export const gameData: EconomicYear[] = [
  // Year 1: Normal Market
  {
    year: 1,
    inflation: 0.025, // 2.5%
    events: [
      { year: 1, quarter: 1, marketCondition: "Steady Start", returns: { volatileETF: 0.04, longTermETF: 0.02 }, houseInsight: "The year is starting on a stable footing.", misleadingInsight: "Recession fears are looming large." },
      { year: 1, quarter: 2, marketCondition: "Minor Dip", returns: { volatileETF: -0.02, longTermETF: -0.01 }, houseInsight: "Expect some minor profit-taking this quarter.", misleadingInsight: "This looks like the start of a bull run!" },
      { year: 1, quarter: 3, marketCondition: "Summer Growth", returns: { volatileETF: 0.05, longTermETF: 0.03 }, houseInsight: "Corporate earnings look solid.", misleadingInsight: "The summer slump seems to be hitting hard." },
      { year: 1, quarter: 4, marketCondition: "Positive Finish", returns: { volatileETF: 0.06, longTermETF: 0.04 }, houseInsight: "A holiday rally seems likely.", misleadingInsight: "Analysts are predicting a weak end to the year." },
    ],
  },
  // Year 2: Good Market
  {
    year: 2,
    inflation: 0.035, // 3.5%
    events: [
      { year: 2, quarter: 1, marketCondition: "Strong Momentum", returns: { volatileETF: 0.08, longTermETF: 0.04 }, houseInsight: "Investor confidence is building.", misleadingInsight: "The market seems overvalued here." },
      { year: 2, quarter: 2, marketCondition: "Tech Sector Boost", returns: { volatileETF: 0.12, longTermETF: 0.05 }, houseInsight: "Technology stocks are leading the charge.", misleadingInsight: "Looks like a good time to be in stable assets." },
      { year: 2, quarter: 3, marketCondition: "Broad Rally", returns: { volatileETF: 0.07, longTermETF: 0.06 }, houseInsight: "The entire market is seeing healthy gains.", misleadingInsight: "International trade tensions could cause a dip." },
      { year: 2, quarter: 4, marketCondition: "Excellent Year-End", returns: { volatileETF: 0.10, longTermETF: 0.07 }, houseInsight: "The bulls are firmly in control.", misleadingInsight: "A major correction is imminent." },
    ],
  },
  // Year 3: Peak Market (Bubble)
  {
    year: 3,
    inflation: 0.045, // 4.5%
    events: [
      { year: 3, quarter: 1, marketCondition: "Euphoria", returns: { volatileETF: 0.18, longTermETF: 0.08 }, houseInsight: "It feels like the gains will never stop!", misleadingInsight: "This growth is unsustainable." },
      { year: 3, quarter: 2, marketCondition: "All-Time Highs", returns: { volatileETF: 0.22, longTermETF: 0.10 }, houseInsight: "New market records are being set daily.", misleadingInsight: "Smart money is starting to pull out." },
      { year: 3, quarter: 3, marketCondition: "Peak Volatility", returns: { volatileETF: 0.15, longTermETF: 0.05 }, houseInsight: "High risk is bringing high reward, but be wary.", misleadingInsight: "The fundamentals have never been stronger." },
      { year: 3, quarter: 4, marketCondition: "The Top?", returns: { volatileETF: -0.05, longTermETF: 0.01 }, houseInsight: "The market is showing signs of exhaustion.", misleadingInsight: "This is just a small dip before the next leg up." },
    ],
  },
  // Year 4: Great Recession
  {
    year: 4,
    inflation: 0.01, // 1.0% (Disinflation)
    events: [
      { year: 4, quarter: 1, marketCondition: "The Crash Begins", returns: { volatileETF: -0.25, longTermETF: -0.15 }, houseInsight: "Panic is spreading. There's blood in the streets.", misleadingInsight: "This is a healthy correction." },
      { year: 4, quarter: 2, marketCondition: "Economic Crisis", returns: { volatileETF: -0.35, longTermETF: -0.20 }, houseInsight: "The economic data is dire. A deep recession is here.", misleadingInsight: "Bargain hunters should be buying now." },
      { year: 4, quarter: 3, marketCondition: "The Bottom", returns: { volatileETF: -0.10, longTermETF: -0.05 }, houseInsight: "Selling pressure seems to be easing, but fear remains.", misleadingInsight: "The market is heading to zero." },
      { year: 4, quarter: 4, marketCondition: "A Glimmer of Hope", returns: { volatileETF: 0.05, longTermETF: 0.02 }, houseInsight: "Some investors are cautiously buying the dip.", misleadingInsight: "This is a dead cat bounce. More pain to come." },
    ],
  },
  // Year 5: Recovering Market
  {
    year: 5,
    inflation: 0.02, // 2.0%
    events: [
      { year: 5, quarter: 1, marketCondition: "Early Recovery", returns: { volatileETF: 0.15, longTermETF: 0.08 }, houseInsight: "Government stimulus is starting to work.", misleadingInsight: "The recovery is fragile and won't last." },
      { year: 5, quarter: 2, marketCondition: "Confidence Returns", returns: { volatileETF: 0.20, longTermETF: 0.12 }, houseInsight: "The market is healing. Those who bought the dip are rewarded.", misleadingInsight: "This is a bear market rally." },
      { year: 5, quarter: 3, marketCondition: "New Bull Market?", returns: { volatileETF: 0.12, longTermETF: 0.09 }, houseInsight: "It seems we are back on a path to growth.", misleadingInsight: "Another crash is just around the corner." },
      { year: 5, quarter: 4, marketCondition: "Strong Finish", returns: { volatileETF: 0.10, longTermETF: 0.07 }, houseInsight: "The recovery is solidifying.", misleadingInsight: "The market is overbought." },
    ],
  },
];


// --- CORE GAME FUNCTIONS ---
export function initializeGame(): PlayerState {
  return {
    year: 1,
    quarter: 1,
    cash: 10000,
    investments: {
      volatileETF: 0,
      longTermETF: 0,
    },
    savingsOnlyPortfolio: 10000,
    portfolioHistory: [{ year: 0, value: 10000, cash: 10000, volatileETF: 0, longTermETF: 0 }],
    savingsHistory: [{ year: 0, value: 10000 }],
    isGameOver: false,
  };
}

export function processQuarter(
  currentState: PlayerState,
  action: PlayerAction
): PlayerState {
  // Deep clone to avoid mutating original
  const newState: PlayerState = JSON.parse(JSON.stringify(currentState));
  if (newState.isGameOver) return newState;

  // HIT and WITHDRAW should NOT advance time anymore. They are intra-quarter adjustments.
  if (action.type === 'HIT') {
    const cost = Math.min(action.amount, newState.cash);
    if (cost > 0) {
      newState.cash -= cost;
      newState.investments[action.etf] += cost;
    }
    return newState; // No returns applied yet.
  }

  if (action.type === 'WITHDRAW') {
    const amount = Math.min(action.amount, newState.investments[action.etf]);
    if (amount > 0) {
      newState.investments[action.etf] -= amount;
      newState.cash += amount;
    }
    return newState; // Still same quarter.
  }

  // At this point only STAND remains -> advance the quarter & apply economics.
  if (action.type === 'STAND') {
    const currentYearData = gameData.find(y => y.year === newState.year)!;
    const currentEvent = currentYearData.events.find(e => e.quarter === newState.quarter)!;

    // Quarterly contribution / income occurs at end of quarter just before returns (feel free to move earlier if design changes)
    newState.cash += 2500;
    newState.savingsOnlyPortfolio += 2500;

    // Apply returns to invested capital
    newState.investments.volatileETF *= (1 + currentEvent.returns.volatileETF);
    newState.investments.longTermETF *= (1 + currentEvent.returns.longTermETF);

    // Inflation degrades cash & alternate savings-only portfolio
    const quarterlyInflation = currentYearData.inflation / 4;
    newState.cash *= (1 - quarterlyInflation);
    newState.savingsOnlyPortfolio *= (1 - quarterlyInflation);

    // Advance the calendar
    if (newState.quarter === 4) {
      const totalPlayerValue = newState.cash + newState.investments.volatileETF + newState.investments.longTermETF;
      newState.portfolioHistory.push({
        year: newState.year,
        value: totalPlayerValue,
        cash: newState.cash,
        volatileETF: newState.investments.volatileETF,
        longTermETF: newState.investments.longTermETF,
      });
      newState.savingsHistory.push({ year: newState.year, value: newState.savingsOnlyPortfolio });
      newState.year += 1;
      newState.quarter = 1;
    } else {
      newState.quarter += 1;
    }

    if (newState.year > gameData.length) {
      newState.isGameOver = true;
    }
    return newState;
  }

  return newState; // Fallback (should not reach for defined actions)
}

