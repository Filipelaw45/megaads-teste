export interface CashflowReport {
  period: {
    from: string;
    to: string;
  };
  totals: {
    received: number;
    paid: number;
    balance: number;
  };
  timeline: {
    date: string;
    in: number;
    out: number;
  }[];
}
