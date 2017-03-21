import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { NodeEvent, Ng2TreeSettings } from 'ng2-tree';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SiteService, Tree } from '../../core';

const ng2TreeSettings: Ng2TreeSettings = {
  rootIsVisible: false
};

@Component({
  selector: 'app-menu-aside',
  styleUrls: ['./menu-aside.component.css'],
  templateUrl: './menu-aside.component.html'
})
export class MenuAsideComponent implements OnInit {
  private currentUrl: string;
  private currentUser: User = new User();
  pages: Tree;
  ng2TreeSettings = ng2TreeSettings;

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
    // TODO
    this.siteService.getRoots().subscribe(pages => this.pages = pages);
  }

  onNodeSelected(e: NodeEvent) {
    console.log(e.node)
    let node: Tree = <any>e.node.node;
    this.siteService.jsf.next(node);
    // TODO navigate to page
    if (!this.location.isCurrentPathEqualTo('/p')) {
      this.router.navigateByUrl('/p');
    }
  }

}
