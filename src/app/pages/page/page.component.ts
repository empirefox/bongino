import { Component, OnInit } from '@angular/core';
import { isObject } from 'lodash';
import { TreeNode } from 'angular-tree-component';
import { computeProfile, computePage, md5, SiteService, Tree, Level, SiteTree, PageTree } from '../../core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  node: TreeNode;
  tree: Tree;
  schema: any;
  layout: any;
  options: any;
  formIsValid: boolean;

  private formValidationErrors: any;
  private sub: any;

  constructor(private siteService: SiteService) { }

  get prettyValidationErrors() {
    if (!this.formValidationErrors) { return null; }
    let prettyValidationErrors = '';
    for (let error of this.formValidationErrors) {
      prettyValidationErrors += (error.dataPath.length ?
        error.dataPath.slice(1) + ' ' + error.message : error.message) + '\n';
    }
    return prettyValidationErrors;
  }

  ngOnInit() {
    this.sub = this.siteService.jsf.subscribe((node: TreeNode) => {
      this.node = node;
      let tree: Tree = node.data;
      if (tree && tree.schema) {
        this.tree = tree;
        this.schema = tree.schema.schema;
        this.layout = tree.schema.form;
        this.options = {
          qiniuData: { siteid: tree.site.ID },
        };
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit(data: any) {
    // if (this.tree.level === Level.site) {
    //   for (let key in this.tree.data) {
    //     if (this.tree.data.hasOwnProperty(key)) {
    //       delete this.tree.data[key];
    //     }
    //   }
    //   Object.assign(this.tree.data, data);
    // } else {
    //   this.tree.data = data;
    // }
    this.tree.data = data;
    let level = this.tree.level;
    if (level === Level.profile || level === Level.nav || level === Level.navitem) {
      // find profile to hash
      let node = this.node;
      while (!node.isRoot) {
        node = node.parent;
      }
      let tree: SiteTree = node.data;
      tree.current = computeProfile(tree);
      tree.rehash = md5(tree.current);
      console.log('current profile', tree.current);
    } else if (level !== Level.x && level !== Level.site && !this.node.isRoot) {
      // find page to hash
      let node = this.node;
      while (node.data.level !== Level.page) {
        node = node.parent;
      }
      let tree: PageTree = node.data;
      tree.current = computePage(tree);
      tree.rehash = md5(tree.current);
      console.log('current page', tree.current);
    }
    console.log(this.tree.data)
  }

  isValid(isValid: boolean) {
    this.formIsValid = isValid;
  }

  validationErrors(errs: any) {
    this.formValidationErrors = errs;
  }

}
