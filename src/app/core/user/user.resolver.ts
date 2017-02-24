import { Injectable }   from '@angular/core';
import { Resolve }  from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IUserInfo } from './user';
import { UserService } from './user.service';

@Injectable()
export class UserResolver implements Resolve<IUserInfo> {

  constructor(private userService: UserService) { }

  resolve(): Observable<IUserInfo> {
    return this.userService.getUserinfo();
  }

}
