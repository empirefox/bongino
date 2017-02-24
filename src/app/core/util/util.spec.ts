import { inject } from '@angular/core/testing';
import { Component } from '@angular/core';

import { updateAfterSave, one2manyRelate } from './util';

interface One {
  ID: number;

  Manys?: Many[];
}

interface Many {
  ID: number;
  OneID: number;

  One?: One;
}

const one2manyRelateOpts = { oneId: 'ID', manyId: 'ID', oneInMany: 'One', manyInOne: 'Manys', oneIdInMany: 'OneID' };

describe('util.one2manyRelate', () => {

  it('should relate one <=> many', () => {
    let ones: One[] = [{ ID: 1 }, { ID: 2 }];
    let manys: Many[] = [
      { OneID: 1, ID: 111 },
      { OneID: 2, ID: 2 },
      { OneID: 2, ID: 3 },
    ];
    one2manyRelate(ones, manys, one2manyRelateOpts);

    expect(ones[0].Manys.length).toBe(1);
    expect(ones[0].Manys[0].ID).toBe(111);
    expect(ones[1].Manys.length).toBe(2);
    expect(manys.length).toBe(3);
    expect(manys[0].One.ID).toBe(1);
  });

});

describe('util.updateAfterSave', () => {

  it('should update record', () => {
    let items = [
      { ID: 1, Pos: 1 },
      { ID: 2, Pos: 2 },
    ];
    let copy = { ID: 1, Pos: 3 }
    let item = { ID: 3, Pos: 3 };
    items = updateAfterSave(items, item, copy.ID);
    expect(items.length).toBe(2);
    expect(items[0]).toBe(item);
  });

  it('should insert record', () => {
    let items = [
      { ID: 1, Pos: 1 },
      { ID: 2, Pos: 2 },
    ];
    let copy = { ID: 0, Pos: 3 }
    let item = { ID: 3, Pos: 3 };
    items = updateAfterSave(items, item, copy.ID);
    expect(items.length).toBe(3);
    expect(items).toContain(item);
  });

});
