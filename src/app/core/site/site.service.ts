import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { TreeModel } from 'ng2-tree';
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

const {hash} = require('spark-md5');
const sortKeys = require('sort-keys');

export interface HashData {
  root: IPage | IProfile;
  hash: string;
}

export interface SiteData {
  profileData: HashData;
  pages: Dict<HashData>;
}

export interface Tree extends TreeModel {
  site: ISite;
  hash: HashData;
  data: any;
  schema: any;
  children?: Tree[];
  root?: boolean;
}

export class SectionPatternTree implements Tree {
  private _section: ISection;

  constructor(public site: ISite, public hash: HashData, section: ISection) {
    this.section = section;
  }

  set section(section: ISection) { this._section = section; }

  get value() { return `Pattern ${this._section.pattern}`; }
  get data() { return this._section[this._section.pattern]; }
  get schema() { return sectionPatternSchemas[this._section.pattern]; }

}

@Injectable()
export class SiteService extends Crud<ISite> {

  jsf = new ReplaySubject<Tree>(1);

  private datas: Observable<Dict<SiteData>> = Observable.of({});
  private trees: Observable<Dict<Tree[]>> = Observable.of({}); // all children cache
  // private trees: Observable<Dict<TreeModel>> = Observable.of({});

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

  getData(site: ISite): Observable<SiteData> {
    return this.datas.mergeMap(datas => {
      let data = datas[site.ID];
      if (data) {
        return Observable.of(data);
      }
      let sm = new SiteMethods(site);
      return this.rawHttp.get(sm.profile()).map(res => res.json()).catch((err, caught) => {
        return caught.map(res => {
          if (res.status !== 404) {
            throw new Error(err);
          }
          // init profile
          return defaultProfile(site);
        });
      }).mergeMap(profile => {
        // init nav
        let nav = profile.nav = profile.nav || <INav>{};
        // init home
        nav.home = nav.home || <INavItem>{ id: 1, name: 'Home' };
        nav.items = nav.items || [];
        let navitems = [nav.home, ...nav.items];
        let pages$ = navitems.map(item => this.rawHttp.get(sm.page(item)).map(res => ({ nav: item, root: <IPage>res.json() })));
        return Observable.forkJoin(...pages$).map(rawitems => {
          let pageMap: Dict<HashData> = {};
          let items = rawitems.map(item => {
            return pageMap[item.nav.id] = { hash: this.hash(item.root), root: item.root };
          });
          let profileData = { root: profile, hash: this.hash(profile) };
          return datas[site.ID] = <SiteData>{ profileData: profileData, pages: pageMap };
        });
      });
    });
  }

  getTrees(): Observable<Tree[]> {
    return this.find().map(sites =>
      (sites || []).map<Tree>(site => ({
        site,
        hash: { root: null, hash: null },
        value: site.Domain,
        data: site,
        schema: null,
        root: true,
      }))
    );
  }

  // split site data
  loadTree(tree: Tree): Observable<Tree> {
    let site: ISite = tree.data;
    if (tree.children) {
      return Observable.of(tree);
    }
    return this.trees.mergeMap(trees => {
      let children = trees[site.ID];
      if (children) {
        tree.children = children;
        return Observable.of(tree);
      }
      return this.getData(site).map(data => {
        let profileData = data.profileData;
        let profile = <IProfile>profileData.root;
        let nav = profile.nav;
        let navitems = [nav.home, ...nav.items];

        let pagesTree: Tree[] = navitems.map(item => {
          let pageData = data.pages[item.id];
          let page = <IPage>pageData.root;
          let sections = page.sections = page.sections || [];
          let sectionsTree: Tree[] = sections.map(section => {
            // [P1]
            let panels = (section.panels || []).map(panel => ({
              site,
              hash: pageData,
              value: panel.head || `Panel`,
              data: panel,
              schema: PanelSchema,
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
            };
          });
          // [Home]
          return {
            site,
            hash: pageData,
            value: item.name,
            data: page,
            schema: PageSchema,
            children: [
              {
                site,
                hash: profileData,
                value: 'Nav',
                data: item,
                schema: NavItemSchema,
              },
              {
                site,
                hash: pageData,
                value: 'Header',
                data: page.header,
                schema: HeaderSchema,
              },
              // [section] list
              ...sectionsTree,
            ],
          };
        });

        tree = Object.assign({}, tree);
        trees[site.ID] = tree.children = [
          {
            site,
            hash: profileData, // null for site
            value: 'Profile',
            data: profile,
            schema: ProfileSchema,
          },
          // [page] list
          ...pagesTree,
        ];

        return tree;
      });
    });
  }

  hash(page: IPage | IProfile): string {
    return hash(JSON.stringify(sortKeys(page, { deep: true }))).slice(0, 7);
  }

}
