import {
  ISite,
  IProfile, defaultProfile,
  INav, INavItem,
  IPage,
  ISection,
  IPanel,
} from 'bongin-base';
import {
  md5, Tree,
  SiteTree, NavTree, ProfileTree,
  PageTree, NavitemTree, HeaderTree,
  SectionTree, SectionPatternTree,
  PanelTree,
} from './models';
import { computePage } from './compute';

export function newPanel(siteTree: SiteTree): Tree {
  let panel = <IPanel>{
    head: 'New Panel',
    body: 'Write body here',
    pattern: 'Mpanel',
  };
  return new PanelTree(siteTree, panel);
}

export function newSection(siteTree: SiteTree): Tree {
  let panel = newPanel(siteTree);
  let section = <ISection>{ cols: 0, pattern: 'Masonry' };

  let sectionTree = new SectionTree(siteTree, section);
  sectionTree.children = [
    new SectionPatternTree(sectionTree),
    panel,
  ];

  return sectionTree;
}

export function newPage(siteTree: SiteTree): Tree {
  let page = <IPage>{ showside: true };
  let nav = <INavItem>{ id: 0, name: 'New Page' }; // TODO set id

  let pageTree = new PageTree(siteTree, nav);
  pageTree.data = page;
  pageTree.children = [
    new NavitemTree(pageTree),
    new HeaderTree(pageTree, null),
    newSection(siteTree),
  ];
  computePage(pageTree);

  return pageTree;
}

export function newSite(): SiteTree {
  let root = new SiteTree({
    ID: 0,
    MainCdn: '',
    ProfileHash: '',
    // from user jwt
    Phone: '',
    Email: '',
    // user info
    Domain: '',
  });

  root.dirty = true;
  root.profile = defaultProfile(root.data);
  root.nav = <INav>{};

  // [Home]
  let pageTree = <PageTree>newPage(root);
  pageTree.nav.name = 'Home';

  root.children = [
    new NavTree(root),
    new ProfileTree(root),
    pageTree,
  ];

  return root;
}
