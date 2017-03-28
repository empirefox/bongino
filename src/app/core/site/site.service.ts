import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { TreeModel, TreeNode, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { QiniuService, Qiniu } from 'ng2-ef-inputs/ng2-qiniu-img-input';
import {
  ISite, SiteMethods,
  IProfile, defaultProfile,
  INav, INavItem,
  IPage,
} from 'bongin-base';

import { api } from '../config';
import { Crud, CrudService } from '../crud';
import { ModalService } from '../modal';
import {
  md5,
  Level, Tree,
  SiteTree, ProfileTree, PageTree, NavTree, NavitemTree, HeaderTree, SectionTree, SectionPatternTree, PanelTree,
} from './models';
import { parsePageChildren } from './parse';
import { newSite, newPage, newSection, newPanel } from './template';
import { computeFromNodeMove } from './compute';

const { Base64 } = require('js-base64');
const jsonType = btoa('application/json');

@Injectable()
export class SiteService extends Crud<ISite> {

  qiniu: Qiniu;
  jsf = new ReplaySubject<TreeNode>(1);

  constructor(
    private rawHttp: Http,
    private modalService: ModalService,
    private qiniuService: QiniuService,
    crudService: CrudService) {
    super(crudService, {
      cache: 'sites',
      find: api.GetUserSites,
      save: api.PostUserSite,
      get: api.GetUserSite,
      delete: api.DeleteUserSite,
    });
    this.qiniu = this.qiniuService.get('site');
  }

  getRoots(): Observable<SiteTree[]> {
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
      root.hash = root.site.ProfileHash;
      root.rehash = md5(profile);
      root.profile = profile;
      // init nav
      let nav = root.nav = profile.nav = profile.nav || <INav>{};
      // init home
      nav.home = nav.home || <INavItem>{ name: 'Home' };
      nav.items = nav.items || [];

      let navitems = [nav.home, ...nav.items];

      // [Home]
      let pageTrees: Tree[] = navitems.map(item => new PageTree(root, item));
      if (!nav.home.hash) {
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
    return this.rawHttp.get(sm.page(pageTree.nav)).map(res => parsePageChildren(pageTree, res.json(), pageTree.nav)).toPromise();
  }

  // Actions start

  expandAction(tree, node, $event) {
    if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
  }

  dropAction(tree: TreeModel, node: TreeNode, $event: any, { from, to }) {
    // use from to get the dragged node.
    // use to.parent and to.index to get the drop location
    // use TREE_ACTIONS.MOVE_NODE to invoke the original action
    let children: Tree[] = to.parent.data.children || [];
    // find first page/section/panel in children
    let firstIndex = children.findIndex(item => !!~[Level.page, Level.section, Level.panel].indexOf(item.level));
    if (~firstIndex && to.index < firstIndex) {
      to.index = firstIndex;
    } else if (!~firstIndex && to.index < children.length) {
      to.index = children.length;
    }
    TREE_ACTIONS.MOVE_NODE(tree, node, $event, { from, to });
    computeFromNodeMove(node);
  }

  deleteAction(tree: TreeModel, node: TreeNode, $event) {
    let nodes: any[] = node.parent ? node.parent.data.children : tree.nodes;
    let level = node.data.level;
    switch (level) {
      case Level.page:
      case Level.section:
        if (nodes.length === 3) {
          return;
        }
        if (level === Level.page) {
          node.data.deleted = true;
        }
        break;
      case Level.panel:
        if (nodes.length === 2) {
          return;
        }
        break;
      case Level.site:
        node.data.deleted = true;
        break;
      default:
        return;
    }

    nodes.splice(node.index, 1);
    tree.update();
    computeFromNodeMove(node);
  }

  inserAfterAction(tree: TreeModel, node, $event) {
    // add page/section/panel
    let data: Tree = node.data;
    let nodes: Tree[] = node.parent.data.children;
    switch (data.level) {
      case Level.panel:
        let panelTree = <PanelTree>data;
        nodes.push(newPanel(panelTree.siteTree));
        break;
      case Level.section:
        let sectionTree = <SectionTree>data;
        nodes.push(newSection(sectionTree.siteTree));
        break;
      case Level.page:
        let pageTree = <PageTree>data;
        nodes.push(newPage(pageTree.siteTree));
        break;
      case Level.site:
        tree.nodes.push(newSite());
        break;
      default:
        console.log('Cannot insert node with level:', data.level);
    }
    tree.update();
    computeFromNodeMove(node);
  }

  allowDropAction(element, to) {
    let parent: Tree = to.parent.data;
    let node: Tree = element.data;
    return parent.drop === node.level && node.site && parent.site === node.site;
  }

  // Actions end

  openSaveSitesWindow(siteTrees: SiteTree[]): Promise<any> {
    return this.modalService.confirm('Save all modifies to continue?', 'Warning!').then(resultPromise => {
      return resultPromise.result.then(result => this.saveSitesModifies(siteTrees).toPromise());
    });
  }

  saveSitesModifies(siteTrees: SiteTree[]): Observable<any> {
    let trees = siteTrees.filter(siteTree => !siteTree.deleted);

    let pages = trees.map(siteTree => siteTree.children.slice(2).filter((pageTree: PageTree) => !pageTree.deleted))
      .reduce((a, b) => [...a, ...b])
      .filter((pageTree: PageTree) => pageTree.hash !== pageTree.rehash)
      .map((pageTree: PageTree) => this.saveJson(pageTree));

    let profiles = trees.filter((siteTree: SiteTree) => siteTree.hash !== siteTree.rehash).map(siteTree => this.saveJson(siteTree));

    return Observable.forkJoin(...pages, ...profiles).mergeMap(updatedkeys => {
      let deletedKeys = this.deletedKeys(siteTrees);
      updatedkeys = updatedkeys.filter(item => item);
      return this.batchDelete([...updatedkeys, ...deletedKeys]);
    }).mergeMap(_ => {
      let saves = trees.filter(siteTree => siteTree.dirty).map(tree => this.save(tree.site));
      let deletes = siteTrees.filter(siteTree => siteTree.deleted).map(tree => this.delete(tree.site.ID));
      return Observable.forkJoin(...saves, ...deletes);
    });
  }

  private deletedKeys(siteTrees: SiteTree[]): string[] {
    let keysFromDeletedSites = siteTrees.filter((siteTree: SiteTree) => siteTree.deleted && siteTree.site.ID).map((siteTree: SiteTree) => {
      let items = siteTree.children.slice(2)
        .filter((pageTree: PageTree) => pageTree.hash)
        .map((pageTree: PageTree) => pageTree.key());
      return [siteTree.key(), ...items];
    });

    let keysFromUndeletedSites = siteTrees.filter((siteTree: SiteTree) => !siteTree.deleted && siteTree.site.ID).map((siteTree: SiteTree) => {
      let items = <PageTree[]>siteTree.children.slice(2);
      // items.forEach((pageTree, i) => {
      //   if (pageTree.deleted && !pageTree.hash) {
      //     siteTree.children.splice(i + 2, i);
      //   }
      // });
      return items.filter((pageTree: PageTree) => pageTree.deleted && pageTree.hash)
        .map((pageTree: PageTree) => pageTree.key());
    });

    // siteTrees.forEach((siteTree, i) => {
    //   if (siteTree.deleted && !siteTree.site.ID) {
    //     siteTrees.splice(i, 1);
    //   }
    // });

    return [...keysFromDeletedSites, ...keysFromUndeletedSites].reduce((a, b) => [...a, ...b]);
  }

  private batchDelete(keys: string[]): Observable<any> {
    return this.qiniu.config.http.post(api.PostBatchDeleteQiniu, JSON.stringify(keys));
  }

  private saveJson(tree: { site: ISite, hash: string; rehash: string, current: any, key: () => string, rekey: () => string }): Observable<string> {
    let rekey = tree.rekey();
    return this.qiniu.uptoken(rekey)
      .mergeMap(token => this.rawHttp.request(
        `${token.uphost}/putb64/-1/key/${btoa(rekey)}/mimeType/${jsonType}`,
        {
          method: 'POST',
          headers: new Headers({
            Authorization: `UpToken ${token.token}`,
            'Content-Type': 'application/octet-stream',
          }),
          body: new Blob([Base64.encode(JSON.stringify(tree.current))], { type: 'application/text' }),
        },
      ).map(_ => {
        let key = tree.key();
        tree.hash = tree.rehash;
        return key;
      }));
  }

}
