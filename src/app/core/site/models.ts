import {
  ISite, SiteMethods,
  IProfile, defaultProfile,
  INav, INavItem,
  IHeader,
  IPage,
  ISection,
  IPanel,
} from 'bongin-base';
import {
  SiteSchema,
  ProfileSchema,
  NavSchema, NavItemSchema,
  HeaderSchema,
  PageSchema, SectionSchema, PanelSchema,
  sectionPatternSchemas,
} from 'bongin-base/schema';

import { config } from '../config';

const { hash } = require('spark-md5');
const sortKeys = require('sort-keys');

export enum Level { x, site, page, section, panel, profile, nav, navitem, header, sectionPattern };

export interface Tree {
  fa?: string;
  site: ISite;
  name: any;
  data: any;
  schema: any;
  hasChildren?: boolean;
  children?: Tree[];
  level: Level;
  drop: Level;
}

export class SiteTree implements Tree {
  fa = 'globe';
  schema: any = SiteSchema;
  level = Level.site;
  drop = Level.page;
  hasChildren = true;
  children: Tree[];
  profile: IProfile = null;
  hash: string = null; // profile hash
  rehash: string = null;
  current: IProfile;
  nav: INav;
  dirty: boolean; // for ISite
  deleted: boolean;

  private _data: ISite;

  constructor(data: ISite) {
    this._data = data;
  }

  get name() { return this.data.Domain; }
  get site() { return this.data; }

  get data() { return this._data; }
  set data(data: ISite) {
    this.dirty = true;
    this._data = data;
  }

  key() { return this.hash ? `s/${this.site.ID}/f/${this.hash}${config.siteExt}` : ''; }

  rekey() { return this.rehash ? `s/${this.site.ID}/f/${this.rehash}${config.siteExt}` : ''; }
}

export class ProfileTree implements Tree {
  fa = 'wrench';
  schema: any = ProfileSchema;
  level = Level.profile;
  drop = Level.x;
  hasChildren = false;
  name = 'Profile';

  constructor(public siteTree: SiteTree) { }

  get site() { return this.siteTree.site; }

  get data() { return this.siteTree.profile; }
  set data(data: IProfile) { this.siteTree.profile = data; }
}

export class NavTree implements Tree {
  fa = 'location-arrow';
  schema: any = NavSchema;
  level = Level.nav;
  drop = Level.x;
  hasChildren = false;
  name = 'Nav';

  constructor(public siteTree: SiteTree) { }

  get site() { return this.siteTree.site; }

  get data() { return this.siteTree.nav; }
  set data(data: INav) { this.siteTree.nav = data; }
}

// need set data
export class PageTree implements Tree {
  fa = 'file-powerpoint-o';
  schema: any = PageSchema;
  level = Level.page;
  drop = Level.section;
  hasChildren = true;
  children: Tree[];
  data: IPage = null;
  hash: string = null;
  rehash: string = null;
  current: IPage;
  deleted: boolean;

  constructor(public siteTree: SiteTree, public nav: INavItem) { }

  get name() { return this.nav.name; }
  get site() { return this.siteTree.site; }

  key() { return this.hash ? `s/${this.site.ID}/p/${this.hash}${config.siteExt}` : ''; }

  rekey() { return this.rehash ? `s/${this.site.ID}/p/${this.rehash}${config.siteExt}` : ''; }
}

export class NavitemTree implements Tree {
  fa = 'location-arrow';
  schema: any = NavItemSchema;
  level = Level.navitem;
  drop = Level.x;
  hasChildren = false;
  name = 'Nav';

  constructor(public pageTree: PageTree) { }

  get site() { return this.pageTree.site; }

  get data() { return this.pageTree.nav; }
  set data(data: INavItem) { this.pageTree.nav = data; }
}

export class HeaderTree implements Tree {
  fa = 'header';
  schema: any = HeaderSchema;
  level = Level.header;
  drop = Level.x;
  hasChildren = false;
  name = 'Header';

  constructor(public pageTree: PageTree, public data: IHeader) { }

  get site() { return this.pageTree.site; }
}

export class SectionTree implements Tree {
  schema: any = SectionSchema;
  level = Level.section;
  drop = Level.panel;
  children: Tree[];

  constructor(public siteTree: SiteTree, public data: ISection) { }

  get name() { return this.data.title || `Section`; }
  get site() { return this.siteTree.site; }
}

export class SectionPatternTree implements Tree {
  fa = 'th-large';
  level = Level.sectionPattern;
  drop = Level.x;
  hasChildren = false;

  constructor(public sectionTree: SectionTree) { }

  get site() { return this.sectionTree.site; }

  get name() { return this.section.pattern; }
  get data() { return this.section[this.section.pattern]; }
  get schema() { return sectionPatternSchemas[this.section.pattern]; }

  private get section() { return this.sectionTree.data; }
}

export class PanelTree implements Tree {
  schema: any = PanelSchema;
  level = Level.panel;
  drop = Level.x;
  hasChildren = false;

  constructor(public siteTree: SiteTree, public data: IPanel) { }

  get name() { return this.data.head || `Section`; }
  get site() { return this.siteTree.site; }
}

export function md5(obj: any): string {
  return hash(stringify(obj)).slice(0, 7);
}

export function stringify(obj: any): string {
  return JSON.stringify(sortKeys(obj, { deep: true }));
}
