import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { TreeNode } from 'angular-tree-component';
import {
  ISite, SiteMethods,
  IProfile, defaultProfile,
  INav, INavItem,
  IPage,
  ISection, sectionPattern,
} from 'bongin-base';
import {
  ProfileSchema,
  NavSchema, NavItemSchema,
  HeaderSchema,
  PageSchema, SectionSchema, PanelSchema,
  sectionPatternSchemas,
} from 'bongin-base/schema';

import { api } from '../config';
import { Crud, CrudService } from '../crud';

const { hash } = require('spark-md5');
const sortKeys = require('sort-keys');

export interface HashData {
  root: IPage | IProfile;
  hash: string;
}

export interface SiteData {
  profileData: HashData;
  pages: Dict<HashData>;
}

export interface Tree {
  value: string;
  site: ISite;
  hash: HashData;
  data: any;
  schema: any;
  hasChildren?: boolean;
  children?: Tree[];
  level: Level;

  nav?: INavItem; // for load page
  profileData?: HashData;// for load page
}

export class SectionPatternTree implements Tree {
  level = Level.x;
  hasChildren = false;
  private _section: ISection;

  constructor(public site: ISite, public hash: HashData, section: ISection) {
    this.section = section;
  }

  set section(section: ISection) { this._section = section; }

  get value() { return `Pattern ${this._section.pattern}`; }
  get data() { return this._section[this._section.pattern]; }
  get schema() { return sectionPatternSchemas[this._section.pattern]; }

}

export enum Level { x, site, page, section, panel };

@Injectable()
export class SiteService extends Crud<ISite> {

  jsf = new ReplaySubject<Tree>(1);

  private datas: Observable<Dict<SiteData>> = Observable.of({});

  constructor(
    private rawHttp: Http,
    crudService: CrudService) {
    super(crudService, {
      cache: 'sites',
      find: api.GetUserSites,
      save: api.PostUserSite,
      get: api.GetUserSite,
      delete: api.DeleteUserSite,
    });
  }

  getRoots(): Observable<Tree[]> {
    return this.find().map(sites =>
      (sites || []).map<Tree>(site => ({
        site,
        hash: { root: null, hash: null },
        value: site.Domain,
        data: site,
        schema: null,
        level: Level.site,
        hasChildren: true,
      }))
    );
  }

  getChildren(node: TreeNode) {
    let data: Tree = node.data;
    let site: ISite = data.site;
    switch (data.level) {
      case Level.site:
        return this.loadSite(site);
      case Level.page:
        return this.loadPage(site, data);
      default:
        throw new Error(`level not supported: ${data.level}`);
    }
  }

  loadSite(site: ISite) {
    let sm = new SiteMethods(site);
    return this.rawHttp.get(sm.profile()).map(res => res.json()).catch((err, caught) => {
      return caught.map(res => {
        if (res.status !== 404) {
          throw new Error(err);
        }
        // init profile
        return defaultProfile(site);
      });
    }).map(profile => {
      // init nav
      let nav = profile.nav = profile.nav || <INav>{};
      // init home
      nav.home = nav.home || <INavItem>{ id: 1, name: 'Home' };
      nav.items = nav.items || [];

      let profileData = { root: profile, hash: this.hash(profile) };

      let pagesTree: Tree[] = [nav.home, ...nav.items].map(item => ({
        site,
        hash: null, // TODO
        value: item.name,
        data: null, // TODO
        schema: PageSchema,
        level: Level.page,
        hasChildren: true,
        nav: item,
        profileData,
      }));

      return <Tree[]>[
        {
          site,
          hash: profileData, // null for site
          value: 'Profile',
          data: profile,
          schema: ProfileSchema,
          level: Level.x,
          hasChildren: false,
        },
        // [page] list
        ...pagesTree,
      ];
    }).toPromise();
  }

  loadPage(site: ISite, tree: Tree) {
    let sm = new SiteMethods(site);
    return this.rawHttp.get(sm.page(tree.nav)).map(res => {
      let page: IPage = res.json();
      let pageData = tree.data = { root: page, hash: this.hash(page) };

      let sections = page.sections = page.sections || [];
      let sectionsTree: Tree[] = sections.map(section => {
        // [P1]
        let panels = (section.panels || []).map(panel => ({
          site,
          hash: pageData,
          value: panel.head || `Panel`,
          data: panel,
          schema: PanelSchema,
          level: Level.panel,
          hasChildren: false,
        }));
        return {
          site,
          hash: pageData,
          value: section.title || `Section`,
          data: section,
          schema: SectionSchema,
          children: [
            new SectionPatternTree(site, pageData, section), // Pattern -> [Carousel|Masonry|Swiper]
            ...panels,
          ],
          level: Level.section,
        };
      });
      return <Tree[]>[
        {
          site,
          hash: tree.profileData,
          value: 'Nav',
          data: tree.nav,
          schema: NavItemSchema,
          level: Level.x,
          hasChildren: false,
        },
        {
          site,
          hash: pageData,
          value: 'Header',
          data: page.header,
          schema: HeaderSchema,
          level: Level.x,
          hasChildren: false,
        },
        // [section] list
        ...sectionsTree,
      ];
    }).toPromise();
  }

  hash(page: IPage | IProfile): string {
    return hash(JSON.stringify(sortKeys(page, { deep: true }))).slice(0, 7);
  }

}
