import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { TreeModel, TreeNode, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ModalService, SiteService, Tree, Level, newPanel, newSection, newPage } from '../../core';

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
          dblClick: (tree, node, $event) => {
            if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          },
          drop: (tree: TreeModel, node: TreeNode, $event: any, { from, to }) => {
            // use from to get the dragged node.
            // use to.parent and to.index to get the drop location
            // use TREE_ACTIONS.MOVE_NODE to invoke the original action
            let children: Tree[] = to.parent.data.children || [];
            let firstIndex = children.findIndex(item => item.level !== Level.x);
            if (~firstIndex && to.index < firstIndex) {
              to.index = firstIndex;
            } else if (!~firstIndex && to.index < children.length) {
              to.index = children.length;
            }
            TREE_ACTIONS.MOVE_NODE(tree, node, $event, { from, to });
          },
        },
        keys: {
          36: (tree, node, $event) => {
            console.log(tree, node, $event)
          },
          // delete
          46: (tree, node, $event) => {
            let nodes: any[] = node.parent ? node.parent.data.children : tree.nodes;
            nodes.splice(node.index, 1);
            tree.update();
          },
          // insert after
          45: (tree, node, $event) => {
            if (!node.isRoot) {
              // add page/section/panel
              let data: Tree = node.data;
              let nodes: Tree[] = node.parent.data.children;
              switch (data.level) {
                case Level.panel:
                  nodes.push(newPanel(data.site));
                  break;
                case Level.section:
                  nodes.push(newSection(data.site));
                  break;
                case Level.page:
                  nodes.push(newPage(data.site, data.profile));
                  break;
                default:
                  console.log('Cannot insert node with level:', data.level);
              }
              console.log(data)
            } else {
              // add site
              let nodes: Tree[] = tree.nodes;
              this.modalService.confirm('Save all modifies to server?', 'Danger!').then(resultPromise => {
                return resultPromise.result.then(result => {
                  this.siteService.saveSites().mergeMap(_ => {
                    return this.siteService.save({
                      ID: 0,
                      MainCdn: '',
                      ProfileHash: '',
                      // user info
                      Domain: result,
                      Phone: '13312345678',
                      Email: 'a@a.com',
                    });
                  }).subscribe(site => console.log(site));
                }, _ => console.log('Lost all modifies!'));
              });
            }
            tree.update();
          },
        }
      },
      nodeHeight: 23,
      useVirtualScroll: true,
      allowDrag: true,
      allowDrop: (element, to) => {
        let parent: Tree = to.parent.data;
        let node: Tree = element.data;
        return parent.drop === node.level && parent.site === node.site;
      },
    };
    // TODO
    this.siteService.getRoots().subscribe(sites => this.sites = sites);
  }

  onActivate(e: any) {
    let node: Tree = <any>e.node.data;
    this.siteService.jsf.next(node);
    // TODO navigate to page
    if (!this.location.isCurrentPathEqualTo('/p')) {
      this.router.navigateByUrl('/p');
    }
  }

}
