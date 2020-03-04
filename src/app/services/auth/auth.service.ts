import { Injectable } from '@angular/core';
import {BaseService} from '../base.service';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../shared/shared.service';
import {LoginModel} from '../../model/auth/login-model';
import {Observable} from 'rxjs';
import {AuthToken} from '../../model/auth/auth-token';
import {PostResult} from '../../model/common/post-result';
import {ChangePasswordModel} from '../../model/auth/change-password-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  constructor(http: HttpClient, sharedService: SharedService) {
    super(http, sharedService);
  }

  login(loginModel: LoginModel): Observable<AuthToken> {
    return new Observable(observer => {
      const url = this.sharedService.createApiUrl('auth/login');
      this.post<boolean>(url, loginModel).subscribe((authTokenObj: any) => {
        if (authTokenObj instanceof PostResult && !(authTokenObj as PostResult).success) {
          observer.next(null);
          observer.complete();
        } else {
          const authToken = new AuthToken();
          authToken.token = authTokenObj['auth_token'];
          authToken.expire = authTokenObj['expires_in'];
          observer.next(authToken);
          observer.complete();
        }
      }, () => {
        observer.next(null);
        observer.complete();
      });
    });
  }

  changePassword(changePassword: ChangePasswordModel) {
    const url = this.sharedService.createApiUrl('auth/changePassword');
    return this.post<PostResult>(url, changePassword);
  }

  isAuthenticated() {
    const url = this.sharedService.createApiUrl('auth/isAuthenticated');
    return this.get<boolean>(url);
  }
}
