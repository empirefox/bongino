import { Component, OnInit } from '@angular/core';
import { isObject } from 'lodash';
import { SiteService, Tree, HashData } from '../../core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  hashData: HashData;
  schema: any;
  layout: any;
  data: any;
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
        this.hashData = tree.hash;
        this.data = tree.data;
        this.schema = tree.schema.schema;
        this.layout = tree.schema.layout;
        this.options = {
          qiniuData: { siteid: tree.site.ID },
        };
      }
    });
  }

  onSubmit(data: any) {
    for (let key in this.data) {
      if (this.data.hasOwnProperty(key) && !isObject(this.data[key])) {
        delete this.data[key];
      }
    }
    Object.assign(this.data, data);
    let old = this.hashData.hash;
    this.hashData.hash = this.siteService.hash(this.hashData.root);
    console.log(old, '=>', this.data)
  }

  isValid(isValid: boolean) {
    this.formIsValid = isValid;
  }

  validationErrors(errs: any) {
    this.formValidationErrors = errs;
  }

}
