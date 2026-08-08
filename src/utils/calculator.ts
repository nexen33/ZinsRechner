export interface Transaction {
  date: string;
  amount: number;
  note?: string;
}

export interface RateHistory {
  start_date: string;
  rate: number;
}

export interface AccountData {
  id: string;
  bank_name: string;
  day_count_convention: number;
  anchor_date: string;
  rate_history: RateHistory[];
  transactions: Transaction[];
}

export interface DailyLog {
  date: string;
  tx_today: number;
  balance: number;
  rate_pct: number;
  daily_interest: number;
  cum_interest: number;
}

export interface CalculationResult {
  current_balance: number;
  total_interest: number;
  days_count: number;
  current_rate: number;
  daily_logs: DailyLog[];
}

function parseDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00Z");
}

function dateToString(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function calculateInterestTimeline(data: AccountData, targetDateStr?: string): CalculationResult {
  const now = new Date();
  const targetDate = targetDateStr ? parseDate(targetDateStr) : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const txs = [...(data.transactions || [])].sort((a, b) => a.date.localeCompare(b.date));
  const rates = [...(data.rate_history || [])].sort((a, b) => a.start_date.localeCompare(b.start_date));

  const txByDate: Record<string, number> = {};
  for (const t of txs) {
    txByDate[t.date] = (txByDate[t.date] || 0) + t.amount;
  }

  const rateByDate = rates.map(r => ({
    start: parseDate(r.start_date),
    rate: r.rate / 100.0
  }));

  const getActiveRate = (d: Date) => {
    let active = 0.0;
    for (const r of rateByDate) {
      if (d >= r.start) {
        active = r.rate;
      }
    }
    return active;
  };

  const dayBase = data.day_count_convention || 360;
  const currentYear = targetDate.getUTCFullYear();
  const yearStart = new Date(Date.UTC(currentYear, 0, 1));
  
  let start_date = yearStart;
  if (txs.length > 0) {
    const txStart = parseDate(txs[0].date);
    if (txStart < start_date) start_date = txStart;
  }

  let effTargetDate = targetDate;
  if (effTargetDate < start_date) {
    effTargetDate = start_date;
  }

  const anchorStr = data.anchor_date ? data.anchor_date.trim() : "";
  let anchorDate: Date | null = null;
  if (anchorStr) {
    anchorDate = parseDate(anchorStr);
  }

  const balanceMap: Record<string, number> = {};

  if (anchorDate) {
    let curr_b = 0.0;
    balanceMap[dateToString(anchorDate)] = curr_b;

    let d = new Date(anchorDate);
    while (d > start_date) {
      const prevD = new Date(d);
      prevD.setUTCDate(prevD.getUTCDate() - 1);
      
      const dStr = dateToString(d);
      const prevDStr = dateToString(prevD);
      
      curr_b = curr_b - (txByDate[dStr] || 0.0);
      balanceMap[prevDStr] = curr_b;
      d = prevD;
    }

    curr_b = 0.0;
    d = new Date(anchorDate);
    d.setUTCDate(d.getUTCDate() + 1);
    while (d <= effTargetDate) {
      const dStr = dateToString(d);
      curr_b = curr_b + (txByDate[dStr] || 0.0);
      balanceMap[dStr] = curr_b;
      d.setUTCDate(d.getUTCDate() + 1);
    }
  } else {
    let curr_b = 0.0;
    let d = new Date(start_date);
    while (d <= effTargetDate) {
      const dStr = dateToString(d);
      curr_b += (txByDate[dStr] || 0.0);
      balanceMap[dStr] = curr_b;
      d.setUTCDate(d.getUTCDate() + 1);
    }
  }

  let total_interest = 0.0;
  let days_count = 0;
  const daily_logs: DailyLog[] = [];

  const calcStart = start_date > yearStart ? start_date : yearStart;
  let currentDate = new Date(calcStart);

  while (currentDate <= effTargetDate) {
    days_count++;
    const currentStr = dateToString(currentDate);

    const balance_today = balanceMap[currentStr] || 0.0;
    const tx_today = txByDate[currentStr] || 0.0;

    const interest_bearing_balance = Math.max(0.0, balance_today);
    const active_rate = getActiveRate(currentDate);
    
    const daily_interest = interest_bearing_balance * (active_rate / dayBase);
    total_interest += daily_interest;

    daily_logs.push({
      date: currentStr,
      tx_today,
      balance: balance_today,
      rate_pct: active_rate * 100,
      daily_interest,
      cum_interest: total_interest
    });

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  const latest_rate = getActiveRate(effTargetDate) * 100;
  const current_balance = balanceMap[dateToString(effTargetDate)] || 0.0;

  return {
    current_balance,
    total_interest,
    days_count,
    current_rate: latest_rate,
    daily_logs
  };
}
