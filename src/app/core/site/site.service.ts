import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { TreeNode } from 'angular-tree-component';
import {
  ISite, SiteMethods,
  IProfile, defaultProfile,
  INav, INavItem,
  IPage,
} from 'bongin-base';

import { api } from '../config';
import { Crud, CrudService } from '../crud';
import {
  md5,
  Level, Tree,
  SiteTree, ProfileTree, PageTree, NavTree, NavitemTree, HeaderTree, SectionTree, SectionPatternTree, PanelTree,
} from './models';
import { parsePageChildren } from './parse';
import { newPage } from './template';

@Injectable()
export class SiteService extends Crud<ISite> {

  jsf = new ReplaySubject<TreeNode>(1);

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
      (sites || []).map<Tree>(site => new SiteTree(site))
    );
  }

  getChildren(node: TreeNode) {
    let data: Tree = node.data;
    if (node.isRoot) {
      return this.loadSite(<SiteTree>data);
    } else if (data.level === Level.page) {
      return this.loadPage(<PageTree>data);
    } else {
      throw new Error(`level not supported: ${data.level}`);
    }
  }

  loadSite(root: SiteTree): Promise<Tree[]> {
    let sm = new SiteMethods(root.data);
    return this.rawHttp.get(sm.profile()).map(res => res.json()).catch((err, caught) => {
      return caught.map(res => {
        if (res.status !== 404) {
          throw new Error(err);
        }
        // init profile
        return defaultProfile(root.data);
      });
    }).map(profile => {
      root.hash = root.rehash = md5(profile);
      root.profile = profile;
      // init nav
      let nav = profile.nav = profile.nav || <INav>{};
      // init home
      nav.home = nav.home || <INavItem>{ id: null, name: 'Home' }; // TODO load example page when id===0
      nav.items = nav.items || [];

      // [Home]
      let pageTrees: Tree[] = [nav.home, ...nav.items].map(item => new PageTree(root, item));
      if (nav.home.id === null) {
        let pageTree = pageTrees[0] = <PageTree>newPage(root);
        pageTree.nav.name = 'Home';
      }

      return [
        new NavTree(root),
        new ProfileTree(root),
        // [page] list
        ...pageTrees,
      ];
    }).toPromise();
  }

  loadPage(pageTree: PageTree): Promise<Tree[]> {
    let sm = new SiteMethods(pageTree.siteTree.data);
    return this.rawHttp.get(sm.page(pageTree.nav)).map(res =>
      parsePageChildren(pageTree, res.json())
    ).toPromise();
  }

  // TODO
  saveSites(): Observable<any> {
    return Observable.of(null);
  }

}
