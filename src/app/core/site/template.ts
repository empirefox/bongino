import { extendObservable } from 'mobx';
import {
  ISite,
  IProfile, defaultProfile,
  INav, INavItem,
  IPage,
  ISection,
  IPanel,
} from 'bongin-base';
import {
  ProfileSchema,
  NavSchema, NavItemSchema,
  HeaderSchema,
  PageSchema, SectionSchema, PanelSchema,
  sectionPatternSchemas,
} from 'bongin-base/schema';
import { Level, Tree, SectionPatternTree } from './structs';

export function newPanel(site: ISite): Tree {
  let panel = <IPanel>{
    head: 'New Panel',
    body: 'Write body here',
    pattern: 'Mpanel',
  };
  return extendObservable(
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
  );
}

export function newSection(site: ISite): Tree {
  let panel = newPanel(site);
  let section = <ISection>{ cols: 0, pattern: 'Masonry' };

  return extendObservable(
    {
      site,
      schema: SectionSchema,
      level: Level.section,
      drop: Level.panel,
      children: [
        new SectionPatternTree(site, section),
        panel,
      ],
    }, {
      data: section,
      get name() {
        this.children[0].section = this.data;
        return this.data.title || `Section`;
      },
    },
  );
}

export function newPage(site: ISite, profile: IProfile): Tree {
  let page = <IPage>{ showside: true };
  let nav = <INavItem>{ id: 0, name: 'New Page' }; // TODO set id
  let section = newSection(site);

  let children = [
    {
      site,
      profile,
      value: 'Nav',
      data: nav,
      schema: NavItemSchema,
      level: Level.x,
      drop: Level.x,
      hasChildren: false,
    },
    {
      site,
      value: 'Header',
      data: {},
      schema: HeaderSchema,
      level: Level.x,
      drop: Level.x,
      hasChildren: false,
    },
    // [section] list
    section,
  ];

  return extendObservable(
    {
      site,
      profile,
      data: null, // TODO
      schema: PageSchema,
      level: Level.page,
      drop: Level.section,
      hasChildren: true,
    }, {
      nav,
      get name() { return this.nav.name; },
    },
  );
}
