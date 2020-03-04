import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
import {AuthToken} from '../../model/auth/auth-token';
import {User} from '../../model/users/user';
import {RecipeManagementConstants} from '../../model/common/recipe-management-constants';
import {CookieUtility} from '../utilities/cookie-utility';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  formSubmitTimeout: any;
  private _formSubmitting: boolean;
  authToken: AuthToken;
  lastDateAccessedServer: Date;
  private authenticated: boolean;
  private authorized: boolean;
  private _user: User;
  private autoLogoutActive: boolean;
  private _loadingText: string;
  private _pageTitle: string;
  private loadingStartTime: Date;

  constructor(private titleService: Title,
              private location: Location) {
    this._formSubmitting = false;
    this.lastDateAccessedServer = new Date();
  }

  createApiUrl(relativeUrl: string) {
    const apiBaseUrl = (/\/$/.test(environment.apiBaseUrl))
      ? environment.apiBaseUrl.substr(0, environment.apiBaseUrl.length - 1)
      : environment.apiBaseUrl;
    relativeUrl = (/^\//.test(relativeUrl)) ? relativeUrl.substr(1) : relativeUrl;

    return `${apiBaseUrl}/api/${relativeUrl}`;
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this.authenticated = true;
    this._user = value;
  }

  setFormSubmitting(loadingText?: string, immediate?: boolean): void {
    if (immediate) {
      this.loadingStartTime = new Date();
      this._loadingText = loadingText ? loadingText : 'Please wait while submitting';
      this._formSubmitting = true;
    } else {
      this.formSubmitTimeout = setTimeout(() => {
        this.loadingStartTime = new Date();
        this._loadingText = loadingText ? loadingText : 'Please wait while submitting';
        this._formSubmitting = true;
      }, 250);
    }
  }

  get formSubmitting(): boolean {
    return this._formSubmitting;
  }

  clearFormSubmitting(): void {
    clearTimeout(this.formSubmitTimeout);
    if (this._formSubmitting) {
      // Delay clearing loading at least one second
      const loadingStartTimeInMilliseconds = this.loadingStartTime.getTime();
      const nowInMilliseconds = new Date().getTime();
      if (nowInMilliseconds - loadingStartTimeInMilliseconds < 1000) {
        setTimeout(() => {
          this._formSubmitting = false;
        }, 1000);
      } else {
        this._formSubmitting = false;
      }
    } else {
      this._formSubmitting = false;
    }
  }

  get loadingText(): string {
    return this._loadingText;
  }

  logout(hardReload: boolean = true): void {
    this.authenticated = false;
    this.authorized = false;
    this._user = null;
    this.setAutoLogoutActive(false);
    CookieUtility.deleteCookie(RecipeManagementConstants.recipeManagementAuthToken);
    if (hardReload) {
      window.document.location.href = '/';
    }
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  setAutoLogoutActive(autoLogoutActive: boolean): void {
    this.autoLogoutActive = autoLogoutActive;
  }

  navigateBack(): void {
    this.location.back();
  }

  setPageTitle(title: string): void {
    this._pageTitle = title;
    const browserTitle = title == null ? 'Recipe Management' : `${title} - Recipe Management`;
    this.titleService.setTitle(browserTitle);
  }

  get pageTitle(): string {
    return this._pageTitle;
  }
}
