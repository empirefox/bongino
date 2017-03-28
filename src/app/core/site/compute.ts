import { omitBy, isNil } from 'lodash-es';
import { TreeNode } from 'angular-tree-component';
import { IProfile, INav, IPage, IHeader, ISection, IPanel } from 'bongin-base';

import { md5, Level, SiteTree, PageTree, SectionTree, PanelTree } from './models';

export function computeFromNodeMove(node: TreeNode) {
  if (node.data.level === Level.page) {
    // update nav
    computeProfileFromNode(node);
  } else if (~[Level.section, Level.panel].indexOf(node.data.level)) {
    // update page content
    computePageFromNode(node);
  }
}

export function computeProfileFromNode(node: TreeNode): IProfile {
  while (!node.isRoot) {
    node = node.parent;
  }
  let tree: SiteTree = node.data;
  return computeProfile(tree);
}

export function computeProfile(siteTree: SiteTree): IProfile {
  let items = siteTree.children.slice(2).filter((pageTree: PageTree) => !pageTree.deleted).map((pageTree: PageTree) => {
    let nav = pageTree.nav;
    nav.hash = pageTree.rehash || pageTree.hash || nav.hash;
    if (!nav.hash) {
      computePage(pageTree);
      nav.hash = pageTree.rehash;
    }
    return nav;
  });
  let profile = omitBy<IProfile, IProfile>(siteTree.profile, isNil);
  profile.nav = omitBy<INav, INav>(siteTree.nav, isNil);
  profile.nav.home = items[0];
  profile.nav.items = items.slice(1);
  siteTree.rehash = md5(profile);
  return siteTree.current = profile;
}

export function computePageFromNode(node: TreeNode): IPage {
  if (node.isRoot) {
    throw new Error('can not compute page for Site Node');
  }
  while (node.data.level !== Level.page) {
    node = node.parent;
  }
  let tree: PageTree = node.data;
  return computePage(tree);
}

export function computePage(pageTree: PageTree): IPage {
  let sections = pageTree.children.slice(2).filter((pageTree: PageTree) => !pageTree.deleted).map((sectionTree: SectionTree) => {
    let panels = sectionTree.children.slice(1).map(
      (panelTree: PanelTree) => <IPanel>omitBy(panelTree.data, isNil)
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
      [sectionData.pattern]: omitBy(sectionData[sectionData.pattern], isNil),
      panels,
    };
    return omitBy<ISection, ISection>(section, isNil);
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
    header: omitBy(header, isNil),
    sections,
  };

  pageTree.current = omitBy<IPage, IPage>(page, isNil);
  pageTree.rehash = md5(pageTree.current);
  return pageTree.current;
}
