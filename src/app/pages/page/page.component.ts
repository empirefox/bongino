import { Component, OnInit } from '@angular/core';
import { isObject } from 'lodash';
import { SiteService, Tree, md5 } from '../../core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  tree: Tree;
  schema: any;
  layout: any;
  options: any;
  formIsValid: boolean;

  private formValidationErrors: any;

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
    this.siteService.jsf.forEach(tree => {
      if (tree && tree.schema) {
        console.log(tree.schema)
        this.tree = tree;
        this.schema = tree.schema.schema;
        this.layout = tree.schema.form;
        this.options = {
          qiniuData: { siteid: tree.site.ID },
        };
      }
    });
  }

  onSubmit(data: any) {
    this.tree.data = data;
    console.log(this.tree.data)
  }

  isValid(isValid: boolean) {
    this.formIsValid = isValid;
  }

  validationErrors(errs: any) {
    this.formValidationErrors = errs;
  }

}
