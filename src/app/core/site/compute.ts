import { extendObservable } from 'mobx';
import { TreeNode } from 'angular-tree-component';
import * as _ from 'lodash';
import { ISite, IProfile, INav, INavItem, IPage, IHeader, ISection, IPanel } from 'bongin-base';

import { Level, Tree, SiteTree, PageTree, HeaderTree, SectionTree, PanelTree } from './models';

export function computeProfile(siteTree: SiteTree): IProfile {
  let items = siteTree.children.slice(2).map((pageTree: PageTree) => pageTree.nav);
  let profile = _.omitBy<IProfile, IProfile>(siteTree.profile, _.isNil);
  profile.nav = _.omitBy<INav, INav>(siteTree.nav, _.isNil);
  profile.nav.home = items[0];
  profile.nav.items = items.slice(1);
  return profile;
}

export function computePage(pageTree: PageTree): IPage {
  let sections = pageTree.children.slice(2).map((sectionTree: SectionTree) => {
    let panels = sectionTree.children.slice(1).map(
      (panelTree: PanelTree) => <IPanel>_.omitBy(panelTree.data, _.isNil)
    );

    let sectionData = sectionTree.data || <ISection>{};
    let section: any = {
      title: sectionData.title,
      detail: sectionData.detail,
      cols: sectionData.cols,
      bg: sectionData.bg,
      hfull: sectionData.hfull,
      sideshow: sectionData.sideshow,
      pattern: sectionData.pattern,
      [sectionData.pattern]: _.omitBy(sectionData[sectionData.pattern], _.isNil),
      panels,
    };
    return _.omitBy<ISection, ISection>(section, _.isNil);
  });

  let pageData = pageTree.data;

  let headerData = <IHeader>(pageTree.children[1].data || {});
  let header: any = {
    hide: headerData.hide,
    hfull: headerData.hfull,
    height: headerData.height,
    body: headerData.body,
    bg: headerData.bg,
  };

  let page: any = {
    detail: pageData.detail,
    showside: pageData.showside,
    bg: pageData.bg,
    header: _.omitBy(header, _.isNil),
    sections,
  };

  return _.omitBy<IPage, IPage>(page, _.isNil);
}
