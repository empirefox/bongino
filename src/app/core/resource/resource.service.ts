import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IResource } from 'bongin-base';

import { api } from '../config';
import { Crud, CrudService } from '../crud';

@Injectable()
export class ResourceService extends Crud<IResource> {

  constructor(crudService: CrudService) {
    super(crudService, {
      cache: 'resources',
      find: api.GetUserResources,
      save: null,
      get: api.GetUserResource,
      delete: null,
    });
  }

  save(t: IResource): Observable<IResource> {
    throw new Error('save is disabled');
  }

  delete(id: number): Observable<any> {
    throw new Error('delete is disabled');
  }

}
