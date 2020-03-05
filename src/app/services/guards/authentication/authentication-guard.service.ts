import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {SharedService} from '../../shared/shared.service';
import {AuthService} from '../../auth/auth.service';
import {Observable} from 'rxjs';
import {AuthToken} from '../../../model/auth/auth-token';
import {CookieUtility} from '../../utilities/cookie-utility';
import {RecipeManagementConstants} from '../../../model/common/recipe-management-constants';
import {User} from '../../../model/users/user';
import {UserService} from '../../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuardService implements CanActivate {

  constructor(private router: Router,
              private sharedService: SharedService,
              private userService: UserService,
              private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new Observable((observer) => {
      if (this.sharedService.isAuthenticated()) {
        observer.next(true);
        observer.complete();
      } else {
        // Load token from Cookies
        const authToken = AuthenticationGuardService.loadTokenFromCookies();
        if (authToken != null) {
          this.sharedService.authToken = authToken;
          this.authService.isAuthenticated().subscribe((authenticated: boolean) => {
            if (authenticated) {
              this.userService.getLoggedInUser().subscribe((user: User) => {
                this.sharedService.user = user;
                observer.next(true);
                observer.complete();
              });
            } else {
              this.redirectToLogin(state);
              observer.next(false);
              observer.complete();
            }
          });
        } else {
          this.redirectToLogin(state);
          observer.next(false);
          observer.complete();
        }
      }
    });
  }

  private redirectToLogin(state: RouterStateSnapshot): void {
    this.router.navigate(['login', {redirectUrl: state.url}]);
  }

  private static loadTokenFromCookies(): AuthToken {
    const authTokenJson = CookieUtility.getCookie(RecipeManagementConstants.recipeManagementAuthToken);
    if (authTokenJson != null) {
      return JSON.parse(authTokenJson) as AuthToken;
    }
    return null;
  }
}
