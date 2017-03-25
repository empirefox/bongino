import { extendObservable } from 'mobx';
import {
  ISite,
  IProfile,
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

import { md5, Level, Tree, SectionPatternTree } from './structs';

export function parsePageChildren(site: ISite, profile: IProfile, page: IPage, nav: INavItem): Tree[] {

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
      profile,
      name: 'Nav',
      data: nav,
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
}
