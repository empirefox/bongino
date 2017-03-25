import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { extendObservable } from 'mobx';
import { TreeNode } from 'angular-tree-component';
import {
  ISite, SiteMethods,
  IProfile, defaultProfile,
  INav, INavItem,
  IPage,
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
import { md5, Level, Tree, SectionPatternTree } from './structs';

@Injectable()
export class SiteService extends Crud<ISite> {

  jsf = new ReplaySubject<Tree>(1);

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
      (sites || []).map<Tree>(site => extendObservable(
        {
          site,
          profile: null,
          schema: null,
          level: Level.site,
          drop: Level.page,
          hasChildren: true,
        }, {
          data: site,
          get name() { return this.data.Domain; },
        },
      ))
    );
  }

  getChildren(node: TreeNode) {
    let data: Tree = node.data;
    let site: ISite = data.site;
    if (node.isRoot) {
      return this.loadSite(data, site);
    } else if (data.level === Level.page) {
      return this.loadPage(site, data);
    } else {
      throw new Error(`level not supported: ${data.level}`);
    }
  }

  loadSite(root: Tree, site: ISite) {
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
      root.profile = profile;
      // init nav
      let nav = profile.nav = profile.nav || <INav>{};
      // init home
      nav.home = nav.home || <INavItem>{ id: 0, name: 'Home' };
      nav.items = nav.items || [];

      // [Home]
      let pageTrees: Tree[] = [nav.home, ...nav.items].map(item => extendObservable(
        {
          site,
          profile,
          data: null, // TODO
          schema: PageSchema,
          level: Level.page,
          drop: Level.section,
          hasChildren: true,
        }, {
          nav: item,
          get name() { return this.nav.name; },
        },
      ));

      return <Tree[]>[
        {
          site,
          name: 'Profile',
          data: profile,
          schema: ProfileSchema,
          level: Level.x,
          drop: Level.x,
          hasChildren: false,
        },
        // [page] list
        ...pageTrees,
      ];
    }).toPromise();
  }

  loadPage(site: ISite, pageTree: Tree) {
    let sm = new SiteMethods(site);
    return this.rawHttp.get(sm.page(pageTree.nav)).map(res => {
      let page: IPage = res.json();

      let sections = page.sections = page.sections || [];
      let sectionTrees: Tree[] = sections.map(section => {
        // [P1] -> panel
        let panels = (section.panels || []).map(panel => extendObservable(
          {
            site,
            schema: PanelSchema,
            level: Level.panel,
            drop: Level.x,
            hasChildren: false,
          }, {
            data: panel,
            get name() { return this.data.head || `Panel`; },
          },
        ));

        // [S1] -> section
        return extendObservable(
          {
            site,
            schema: SectionSchema,
            level: Level.section,
            drop: Level.panel,
            children: [
              // Pattern -> [Carousel|Masonry|Swiper]
              new SectionPatternTree(site, section),
              ...panels,
            ],
          }, {
            data: section,
            get name() {
              this.children[0].section = this.data;
              return this.data.title || `Section`;
            },
          },
        );
      });
      return <Tree[]>[
        {
          site,
          profile: pageTree.profile,
          name: 'Nav',
          data: pageTree.nav,
          schema: NavItemSchema,
          level: Level.x,
          drop: Level.x,
          hasChildren: false,
        },
        {
          site,
          name: 'Header',
          data: page.header || {},
          schema: HeaderSchema,
          level: Level.x,
          drop: Level.x,
          hasChildren: false,
        },
        // [section] list
        ...sectionTrees,
      ];
    }).toPromise();
  }

  // TODO
  saveSites(): Observable<any> {
    return Observable.of(null);
  }

}
