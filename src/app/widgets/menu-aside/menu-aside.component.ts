import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { TreeNode, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SiteService, Tree } from '../../core';

const actionMapping: IActionMapping = {
  mouse: {
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
    },
  },
  keys: {
    // delete
    46: (tree, node, $event) => {
      let nodes: any[] = node.parent ? node.parent.data.children : tree.nodes;
      nodes.splice(node.index, 1);
      tree.update();
    },
  }
};

@Component({
  selector: 'app-menu-aside',
  styleUrls: ['./menu-aside.component.css'],
  templateUrl: './menu-aside.component.html'
})
export class MenuAsideComponent implements OnInit {
  private currentUrl: string;
  private currentUser: User = new User();
  sites: Tree[];
  treeOptions: ITreeOptions;

  @Input() private links: Array<any> = [];

  constructor(
    private location: Location,
    private userServ: UserService,
    public router: Router,
    private siteService: SiteService) {
    // getting the current url
    this.router.events.subscribe((evt) => this.currentUrl = evt.url);
    this.userServ.currentUser.subscribe((user) => this.currentUser = user);
  }

  public ngOnInit() {
    this.treeOptions = {
      displayField: 'value',
      // isExpandedField: 'expanded',
      idField: 'uuid',
      getChildren: this.siteService.getChildren.bind(this.siteService),
      actionMapping,
      nodeHeight: 23,
      allowDrag: true,
      useVirtualScroll: true
    };
    // TODO
    this.siteService.getRoots().subscribe(sites => this.sites = sites);
  }

  onActivate(e: any) {
    console.log(e.node)
    let node: Tree = <any>e.node.data;
    this.siteService.jsf.next(node);
    // TODO navigate to page
    if (!this.location.isCurrentPathEqualTo('/p')) {
      this.router.navigateByUrl('/p');
    }
  }

}
