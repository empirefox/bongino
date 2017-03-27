import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { TreeModel, TreeNode, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import {
  ModalService,
  SiteService,
  SiteTree,
  PageTree,
  Level,
  newSite,
  md5,
  computePage,
  computeProfile,
} from '../../core';

@Component({
  selector: 'app-menu-aside',
  styleUrls: ['./menu-aside.component.css'],
  templateUrl: './menu-aside.component.html'
})
export class MenuAsideComponent implements OnInit {
  private currentUrl: string;
  private currentUser: User = new User();
  sites: SiteTree[];
  treeOptions: ITreeOptions;

  @Input() links: Array<any> = [];

  private sub: any;

  constructor(
    private location: Location,
    private userServ: UserService,
    public router: Router,
    private modalService: ModalService,
    private siteService: SiteService) {
    // getting the current url
    this.router.events.subscribe((evt) => this.currentUrl = evt.url);
    this.userServ.currentUser.subscribe((user) => this.currentUser = user);
  }

  public ngOnInit() {
    this.treeOptions = {
      // displayField: 'value',
      // isExpandedField: 'expanded',
      idField: 'uuid',
      getChildren: this.siteService.getChildren.bind(this.siteService),
      actionMapping: {
        mouse: {
          dblClick: this.siteService.expandAction,
          drop: this.siteService.dropAction,
        },
        keys: {
          // [end] to save
          35: this.onSaveAll.bind(this),
          // [delete]
          46: this.siteService.deleteAction.bind(this.siteService),
          // [insert] after
          45: this.siteService.inserAfterAction,
        }
      },
      nodeHeight: 23,
      useVirtualScroll: true,
      allowDrag: true,
      allowDrop: this.siteService.allowDropAction,
      nodeClass: (node: TreeNode) => { return node.data.deleted ? 'deleted' : ''; },
    };
    // TODO
    this.sub = this.siteService.getRoots().subscribe(sites => this.sites = sites);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onActivate(e: any) {
    this.siteService.jsf.next(e.node);
    // TODO navigate to page
    if (!this.location.isCurrentPathEqualTo('/p')) {
      this.router.navigateByUrl('/p');
    }
  }

  onSaveAll(tree: TreeModel, node, $event) {
    this.modalService.confirm('Save all modifies?', 'Warning!').then(resultPromise => {
      return resultPromise.result.then(result => this.siteService.saveSitesModifies(this.sites).toPromise());
    });
  }

  onCancelAll() {
    this.sub.unsubscribe();
    this.sub = this.siteService.getRoots().subscribe(sites => this.sites = sites);
  }

  onAddSite() {
    let site = newSite();
    site.rehash = md5(computeProfile(site));
    let page = <PageTree>site.children[2];
    page.rehash = md5(computePage(page));
    this.sites = [...this.sites, site];
  }

}
