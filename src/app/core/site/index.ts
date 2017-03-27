import { SiteService } from './site.service';

export { SiteService } from './site.service';
export { newSite, newPage, newSection, newPanel } from './template';
export {
  md5,
  Level,
  Tree,
  SiteTree, ProfileTree, PageTree, NavitemTree, HeaderTree, SectionTree, SectionPatternTree, PanelTree,
} from './models';
export { computeFromNodeMove, computeProfileFromNode, computeProfile, computePageFromNode, computePage } from './compute';

export const SITE_PROVIDERS = [
  SiteService,
];
