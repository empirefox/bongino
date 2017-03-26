import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { TreeModel, TreeNode, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import {
  ModalService,
  SiteService,
  PageTree, SectionTree, PanelTree, SiteTree,
  Tree, Level,
  newPanel, newSection, newPage,
} from '../../core';

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
          // home for test
          36: (tree: TreeModel, node, $event) => {
            console.log(tree, node, $event)
            console.log(tree.nodes[0].children[2])
          },
          // delete
          46: (tree, node, $event) => {
            let nodes: any[] = node.parent ? node.parent.data.children : tree.nodes;
            switch (node.data.level) {
              case Level.page:
              case Level.section:
                if (nodes.length === 3) {
                  return;
                }
                break;
              case Level.panel:
                if (nodes.length === 2) {
                  return;
                }
                break;
              case Level.site:
                if (nodes.length === 1) {
                  return;
                }
                break;
              default:
                return;
            }
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
                  let panelTree = <PanelTree>data;
                  nodes.push(newPanel(panelTree.siteTree));
                  break;
                case Level.section:
                  let sectionTree = <SectionTree>data;
                  nodes.push(newSection(sectionTree.siteTree));
                  break;
                case Level.page:
                  let pageTree = <PageTree>data;
                  nodes.push(newPage(pageTree.siteTree));
                  break;
                default:
                  console.log('Cannot insert node with level:', data.level);
              }
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
        return parent.drop === node.level && node.site && parent.site === node.site;
      },
    };
    // TODO
    this.siteService.getRoots().subscribe(sites => this.sites = sites);
  }

  onActivate(e: any) {
    this.siteService.jsf.next(e.node);
    // TODO navigate to page
    if (!this.location.isCurrentPathEqualTo('/p')) {
      this.router.navigateByUrl('/p');
    }
  }

}
