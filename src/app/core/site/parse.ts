import {
  ISite,
  IProfile,
  INav, INavItem,
  IPage,
} from 'bongin-base';

import { md5, Level, Tree, SiteTree, PageTree, NavitemTree, HeaderTree, SectionTree, SectionPatternTree, PanelTree } from './models';

export function parsePageChildren(pageTree: PageTree, page: IPage, nav: INavItem): Tree[] {
  pageTree.hash = nav.hash;
  pageTree.rehash = md5(page);
  pageTree.data = page;

  let sections = page.sections = page.sections || [];
  let sectionTrees: Tree[] = sections.map(section => {
    // [S1] -> section
    let sectionTree = new SectionTree(pageTree.siteTree, section);
    // [P1] -> panel
    let panelTrees = (section.panels || []).map(panel => new PanelTree(pageTree.siteTree, panel));
    sectionTree.children = [
      // Pattern [Carousel] -> Carousel|Masonry|Swiper
      new SectionPatternTree(sectionTree),
      ...panelTrees,
    ];

    return sectionTree;
  });
  return [
    new NavitemTree(pageTree),
    new HeaderTree(pageTree, page.header),
    // [section] list
    ...sectionTrees,
  ];
}
