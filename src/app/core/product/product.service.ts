import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { api } from '../config';
import { one2manyRelate, posSortor } from '../util';
import {
  ProductAttr, ProductAttrs, IProductAttrId, IProductAttrsResponse,
  ISku, ProductAttrGroup, IProduct, IProductsResponse,
} from './product';

export const O2M_PRODUCT_SKUS_OPTION = { oneId: 'ID', manyId: 'ID', oneInMany: 'product', manyInOne: 'skus', oneIdInMany: 'ProductID' };
export const O2M_GROUP_ATTRS_OPTION = { oneId: 'ID', manyId: 'ID', oneInMany: 'group', manyInOne: 'attrs', oneIdInMany: 'GroupID' };

@Injectable()
export class ProductService {

  private attrs: Observable<ProductAttrs> = null;
  private products: Observable<IProduct[]> = null;

  constructor(private http: Http) { }

  clearAttrsCache() { this.attrs = null; }
  clearProductsCache() { this.products = null; }

  getAttrs() {
    if (!this.attrs) {
      this.attrs = this.http.get(api.GetProductAttrGroups).
        map((res) => this.initAttrs(res.json() || {})).
        publishReplay(1).refCount();
    }
    return this.attrs;
  }

  findSku(product: IProduct, attrs: ProductAttr[]): ISku {
    return product.skus.find(sku => _.isEqual(
      sku.attrs.map(attr => attr.id).sort(),
      attrs.map(attr => attr.id).sort(),
    ));
  }

  getProducts(): Observable<IProduct[]> {
    if (!this.products) {
      this.products = Observable.forkJoin(
        this.getAttrs(),
        this.http.get(api.GetProducts).map(res => res.json() || {}),
      ).map(([attrAndGroupMap, res]: [ProductAttrs, IProductsResponse]) => this.initProducts(attrAndGroupMap, res)).
        publishReplay(1).refCount();
    }
    return this.products;
  }

  getProduct(id: number): Observable<IProduct> {
    return this.getProducts().map(items => items.find(item => item.ID === id));
  }

  private initAttrs(res: IProductAttrsResponse): ProductAttrs {
    let Groups = res.Groups || []; // tslint:disable-line:variable-name
    let Attrs = res.Attrs || []; // tslint:disable-line:variable-name

    one2manyRelate(Groups, Attrs, O2M_GROUP_ATTRS_OPTION);
    let specials = <Dict<string>>{};
    return {
      groups: _.keyBy(Groups, item => item.ID),
      attrs: _.keyBy(Attrs, item => item.ID),
    };
  }

  private initProducts(attrAndGroupMap: ProductAttrs, res: IProductsResponse): IProduct[] {
    let Products = res.Products || []; // tslint:disable-line:variable-name
    let Skus = res.Skus || []; // tslint:disable-line:variable-name
    let Attrs = res.Attrs || []; // tslint:disable-line:variable-name
    one2manyRelate(Products, Skus, O2M_PRODUCT_SKUS_OPTION);
    let attrIdsBySku = _.groupBy(Attrs, item => item.SkuID);
    Products.forEach(product => {
      let attrs = product.skus.map(sku => attrIdsBySku[sku.ID]).reduce((a, b) => [...a, ...b], []);
      this.proccessSkus(attrAndGroupMap, product, attrs);
    });
    return Products.filter(item => item.skus && item.skus.length);
  }

  private proccessSkus(attrAndGroupMap: ProductAttrs, product: IProduct, attrs: IProductAttrId[]) {
    attrs = attrs.filter(attrId => attrId.AttrID in attrAndGroupMap.attrs);

    let flattenAttrs = attrs.map(attrId => attrAndGroupMap.attrs[attrId.AttrID]);
    let attrsByGroup = _.groupBy(_.uniq(flattenAttrs), item => item.GroupID);
    product.groups = Object.keys(attrsByGroup).filter(groupId => groupId in attrAndGroupMap.groups).
      map(groupId => new ProductAttrGroup(attrAndGroupMap.groups[groupId], attrsByGroup[groupId].sort(posSortor))).
      sort(posSortor);

    let attrIdsBySku = _.groupBy(attrs, item => item.SkuID);
    let skuMap = _.keyBy(product.skus, item => item.ID);
    // join all Attrs
    let attrMap = _.keyBy(product.groups.map(group => group.attrs).reduce((a, b) => [...a, ...b], []), item => item.id);
    Object.keys(attrIdsBySku).filter(id => id in skuMap).forEach(skuId => {
      // add Attrs to sku
      skuMap[skuId].attrs = attrIdsBySku[skuId].filter(attrId => attrId.AttrID in attrMap).map(attrId => attrMap[attrId.AttrID]);
    });
  }

}
