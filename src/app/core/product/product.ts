import { Observable } from 'rxjs/Observable';

// Product Attrs

export interface IProductAttr {
  ID: number;
  Value: string;
  GroupID: number;
  Pos: number;

  group: IProductAttrGroup;
}

export interface IProductAttrGroup {
  ID: number;
  Name: string;
  Pos: number;

  attrs: IProductAttr[];
}

export interface IProductAttrsResponse {
  Groups: IProductAttrGroup[]; // all
  Attrs: IProductAttr[]; // all
}

export interface ProductAttrs {
  groups: Dict<IProductAttrGroup>;
  attrs: Dict<IProductAttr>;
}

// Product skus

export interface IProductAttrId {
  ID: number;
  SkuID: number;
  AttrID: number;
}

export interface ISku {
  ID: number;
  Stock: number;
  Img: string;
  Price: number;
  MarketPrice: number;
  Freight: number;
  ProductID: number;

  // ProductAttr[] sorted by Group Pos:
  // [1, 3] of {ID:1, Value:'红色'} {ID:3, Value:'XL'}
  attrs: ProductAttr[];
  product: IProduct;
  quantity: number;
}

// ProductAttr and ProductAttrGroup are copies of interface
export class ProductAttr {
  id: number;
  value: string;
  pos: number;
  group: ProductAttrGroup;
  selected: boolean;

  constructor(ia: IProductAttr, group: ProductAttrGroup) {
    this.id = ia.ID;
    this.value = ia.Value;
    this.pos = ia.Pos;
    this.group = group;
  }
}

// ProductAttr and ProductAttrGroup are copies of interface
export class ProductAttrGroup {
  id: number;
  name: string;
  pos: number;
  attrs: ProductAttr[];

  constructor(ig: IProductAttrGroup, attrs: IProductAttr[]) {
    this.id = ig.ID;
    this.name = ig.Name;
    this.pos = ig.Pos;
    this.attrs = attrs ? attrs.map(ia => new ProductAttr(ia, this)) : [];
  }
}

export interface IProduct {
  ID: number;
  Name: string;
  Img: string;
  ImgSpecial?: string;
  Intro: string;
  Detail: string;
  Saled: number;
  CreatedAt: number;
  SaledAt: number;
  ShelfOffAt: number;

  skus: ISku[];

  // {
  //   Groups: [{
  //     ID: 2,
  //     Name: '颜色',
  //     Pos: 5,
  //     attrs: [{
  //       ID: 1,
  //       Value: '红色',
  //       Pos: 6
  //     }, {
  //       ID: 2,
  //       Value: '黑色',
  //       Pos: 5
  //     }]
  //   }, {
  //     ID: 1,
  //     Name: '尺寸',
  //     Pos: 3,
  //     attrs: [{
  //       ID: 3,
  //       Value: 'X',
  //       Pos: 4
  //     }, {
  //       ID: 4,
  //       Value: 'XL',
  //       Pos: 3
  //     }]
  //   }]
  // }
  groups: ProductAttrGroup[];
  sku?: ISku; // for local sku save
}

export interface IProductsResponse {
  Products: IProduct[]; // all
  Skus: ISku[]; // all
  Attrs: IProductAttrId[]; // all
}
