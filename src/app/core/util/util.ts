import { forwardRef, Provider } from '@angular/core';
import { URLSearchParams } from '@angular/http';

export function provideParent(component: any, parentType?: any): Provider {
  return { provide: parentType, useExisting: forwardRef(() => component) };
};

export interface IDer { ID: number; }
export interface Poser { Pos: number; }
export interface IdPos extends IDer, Poser { }
export interface CreateAter { CreatedAt: number; }

export function posSortor<T extends Poser>(b: T, a: T) { return a.Pos - b.Pos; }
export function createdAtSortor<T extends CreateAter>(b: T, a: T) { return a.CreatedAt - b.CreatedAt; }
export function idSortor<T extends IDer>(b: T, a: T) { return a.ID - b.ID; }

// save => replace/push => copy items
export function updateAfterSave<T extends IDer>(items: T[], item: T, id: number): T[] {
  if (!id) {
    items.unshift(item);
  } else {
    let i = items.findIndex(i => i.ID === id);
    if (~i) {
      Object.assign(items[i], item);
    }
  }
  return items;
}

// http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
export function nonce(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let i;
  for (i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function toURLSearchParams(obj): URLSearchParams {
  let params = new URLSearchParams();
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      params.set(key, obj[key])
    }
  }
  return params;
}

// http://stackoverflow.com/a/1634841/2778814
export function removeURLParameter(url: string, parameter: string) {
  // prefer to use l.search if you have a location/link object
  let urlparts = url.split('?');
  let value: string;
  if (urlparts.length >= 2) {

    let prefix = encodeURIComponent(parameter) + '=';
    let pars = urlparts[1].split(/[&;]/g);

    // reverse iteration as may be destructive
    let i;
    for (i = pars.length; i-- > 0;) {
      // idiom for string.startsWith
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        value = pars[i].slice(prefix.length);
        pars.splice(i, 1);
      }
    }

    url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
  }
  return { url, value };
}

export function one2manyRelate(
  ones: Array<any>,
  manys: Array<any>,
  option?: { oneId?: string, manyId?: string, oneInMany?: string, manyInOne?: string, oneIdInMany?: string }) {

  option = option || {};
  let oneId = option.oneId || 'id';
  let manyId = option.manyId || 'id';
  let oneIdInMany = option.oneIdInMany || 'parent_id';
  let oneInMany = option.oneInMany || 'parent';
  let manyInOne = option.manyInOne || 'children';

  let oneMap = {};
  ones.forEach(one => {
    oneMap[one[oneId]] = one;
    // one[manyId] = one[manyId] || [];
    one[manyInOne] = one[manyInOne] || [];
  });

  manys.forEach(many => {
    let one = oneMap[many[oneIdInMany]];
    if (one) {
      // if (!one[manyInOne]) { one[manyInOne] = []; }
      one[manyInOne].push(many);
      many[oneInMany] = one;
    }
  });
}

export function splitToParents(
  parents: Array<any>,
  arr: Array<any>,
  option?: { idInParent?: string, parentIdInArray?: string, childrenInParent?: string }) {

  option = option || {};
  let id = option.idInParent || 'id';
  let parent = option.parentIdInArray || 'parent_id';
  let child = option.childrenInParent || 'children';

  let parentMap = {};
  parents.forEach(p => {
    parentMap[p[id]] = p;
    p[child] = p[child] || [];
  });

  arr.forEach(a => {
    let p = parentMap[a[parent]];
    if (p) {
      p[child].push(a);
    }
  });
}
