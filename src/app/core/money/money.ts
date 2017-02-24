export interface IUserCash {
  ID: number;
  OrderID: number;
  CreatedAt: number;
  Type: number;
  Amount: number;
  Remark: string;
  Balance: number;
}

export interface IUserCashFrozen {
  ID: number;
  OrderID: number;
  CreatedAt: number;
  Type: number;
  Amount: number;
  Remark: string;
  ThawedAt: number;
}

export interface IUserCashRebateItem {
  ID: number;
  RebateID: number;
  CreatedAt: number;
  Amount: number;

  rebate: IUserCashRebate; // client set
}

export interface IUserCashRebate {
  ID: number;
  OrderID: number;
  CreatedAt: number;
  Type: number;
  Amount: number;
  Remark: string;
  Stages: number;
  DoneAt: number;
  Items: IUserCashRebateItem[]; // preload
}

export interface IPointsItem {
  ID: number;
  TaskID: number;
  CreatedAt: number;
  Amount: number;
  Balance: number;
}

export interface Cashes {
  items: IUserCash[]; // can be null
  total: number;
}

export interface Frozen {
  items: IUserCashFrozen[]; // can be null
  total: number;
}

export interface Rebates {
  items: IUserCashRebate[]; // can be null
  rebated: number;
  unrebated: number;
}

export interface Points {
  items: IPointsItem[]; // can be null
  total: number;
}

export interface IWxPayArgs {
  appId: string; // 公众号名称，由商户传入
  timeStamp: string; // 时间戳，自1970年以来的秒数
  nonceStr: string; // 随机串
  package: string; // "prepay_id=u802345jgfjsdfgsdg888"
  signType: string; // 微信签名方式
  paySign: string; // 微信签名
}

export interface WithdrawPayload {
  Amount: number;
}
