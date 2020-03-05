import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../shared/shared.service';
import {Observable} from 'rxjs';
import {User} from '../../model/users/user';
import {PostResult} from '../../model/common/post-result';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor(http: HttpClient, sharedService: SharedService) {
    super(http, sharedService);
  }

  addOrUpdateUser(user: User): Observable<PostResult> {
    if (user.userId) {
      const postUrl = this.sharedService.createApiUrl(`users/${user.userId}`);
      return this.put<PostResult>(postUrl, user);
    } else {
      const postUrl = this.sharedService.createApiUrl('users');
      return this.post<PostResult>(postUrl, user);
    }
  }

  getLoggedInUser(): Observable<User> {
    const getUrl = this.sharedService.createApiUrl(`users/me`);
    return this.get<User>(getUrl);
  }

}
