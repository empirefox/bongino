import { Component, OnInit } from '@angular/core';
import { IResource, ISite } from 'bongin-base';
import { SiteSchema } from 'bongin-base/schema';
import { keyBy } from 'lodash-es';
import { ResourceService, SiteService } from '../../core';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent implements OnInit {
  items: IResource[];
  siteMap: Dict<ISite> = {};
  formIsValid: boolean;
  active: ISite;

  schema: any = SiteSchema.schema;
  layout: any = SiteSchema.form;

  private formValidationErrors: any;
  private subr: any;
  private subs: any;

  constructor(
    private resourceService: ResourceService,
    private siteService: SiteService) { }

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
    this.subr = this.resourceService.find().subscribe(items => this.items = items);
    this.subs = this.siteService.find().subscribe(sites => this.siteMap = keyBy(sites, item => item.ID));
  }

  ngOnDestroy() {
    this.subr.unsubscribe();
    this.subs.unsubscribe();
  }

  onSubmit(resource: IResource) {
    this.resourceService.mount(resource).take(1).subscribe();
  }

  isValid(isValid: boolean) {
    this.formIsValid = isValid;
  }

  validationErrors(errs: any) {
    this.formValidationErrors = errs;
  }

}
