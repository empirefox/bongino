import {
  ISite,
  IProfile,
  INav, INavItem,
  IPage,
  ISection, sectionPattern,
} from 'bongin-base';
import { sectionPatternSchemas } from 'bongin-base/schema';
import * as _ from 'lodash';
import { TreeNode } from 'angular-tree-component';

const { hash } = require('spark-md5');
const sortKeys = require('sort-keys');

export enum Level { x, site, page, section, panel };

export interface Tree {
  name: any;
  site: ISite;
  data: any;
  schema: any;
  hasChildren?: boolean;
  children?: Tree[];
  level: Level;
  drop: Level;

  nav?: INavItem; // for load page, in page/nav
  profile?: IProfile; // for load page, in site/page/profile/nav
}

export class SectionPatternTree implements Tree {
  level = Level.x;
  drop = Level.x;
  hasChildren = false;

  constructor(public site: ISite, public section: ISection) { }

  get name() { return `Pattern ${this.section.pattern}`; }
  get data() { return this.section[this.section.pattern]; }
  get schema() { return sectionPatternSchemas[this.section.pattern]; }

}

export function md5(page: IPage | IProfile): string {
  return hash(JSON.stringify(sortKeys(page, { deep: true }))).slice(0, 7);
}
