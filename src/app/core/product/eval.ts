export interface IEvalItem {
  Eval?: string;
  EvalAt?: number;
  EvalName?: string;
  RateStar?: number;
}

export interface IProductEval {
  items: IEvalItem[];
  good: IEvalItem[];
  common: IEvalItem[];
  bad: IEvalItem[];
  praiseOf: number;
}
