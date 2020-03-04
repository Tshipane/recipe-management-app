import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SharedService} from './shared/shared.service';
import {PostResult} from '../model/common/post-result';
import {LastOperation} from '../model/common/enum/last-operation';
import * as moment from 'moment';

export abstract class BaseService {
  protected constructor(protected http: HttpClient, protected sharedService: SharedService) {
  }

  protected get<T>(url: string): Observable<T> {
    url = BaseService.updateQueryStringParameter(url, 'queryTime', Date.now());
    return new Observable(observer => {
      this.http.get(url, {headers: new HttpHeaders({Authorization: `Bearer ${this.getToken()}`})}).subscribe(
        (data: any) => {
          observer.next(data);
          observer.complete();
        },
        (error: HttpErrorResponse) => {
          BaseService.handleError(observer, error, true);
        });
    });
  }

  protected post<T>(url: string, body: {}): Observable<T> {
    return new Observable(observer => {
      this.http.post(url, body == null ? null : JSON.stringify(body),
        {
          headers: new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken()}`}),
          observe: 'response'
        }).subscribe((response: HttpResponse<any>) => {
          const data = BaseService.extractData(response);
          observer.next(data);
          observer.complete();
        },
        (error: HttpErrorResponse) => {
          BaseService.handleError(observer, error);
        });
    });
  }

  protected put<T>(url: string, body: {}): Observable<T> {
    return new Observable(observer => {
      this.http.put(url, JSON.stringify(body),
        {
          headers: new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken()}`}),
          observe: 'response'
        }).subscribe((response: HttpResponse<any>) => {
          const data = BaseService.extractData(response);
          observer.next(data);
          observer.complete();
        },
        (error: HttpErrorResponse) => {
          BaseService.handleError(observer, error);
        });
    });
  }

  protected delete<T>(url: string): Observable<T> {
    return new Observable(observer => {
      this.http.delete(url,
        {
          headers: new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken()}`}),
          observe: 'response'
        }).subscribe((response: HttpResponse<any>) => {
          const data = BaseService.extractData(response);
          observer.next(data);
          observer.complete();
        },
        (error: HttpErrorResponse) => {
          BaseService.handleError(observer, error);
        });
    });
  }

  private getToken(): string {
    this.sharedService.lastDateAccessedServer = new Date();
    return this.sharedService.authToken != null ? this.sharedService.authToken.token : null;
  }

  static updateQueryStringParameter(uri: any, key: any, value: any): string {
    uri = uri.replace('&amp;', '&');
    const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) {
      return uri.replace(re, `$1${key}=${value}$2`);
    } else {
      return uri + separator + key + '=' + value;
    }
  }

  private static extractData(response: HttpResponse<any>): any {
    if (response.status == 201 || response.status == 202 || response.status == 204) {
      const postResult = new PostResult();
      postResult.success = true;
      postResult.errors = [];
      switch (response.status) {
        case 201: // Created
          postResult.lastOperation = LastOperation.Add;
          break;
        case 202: // Deleted
          postResult.lastOperation = LastOperation.Delete;
          break;
        case 204: // Updated
          postResult.lastOperation = LastOperation.Update;
          break;
      }
      return postResult;
    } else {
      return BaseService.parseData(response.body);
    }
  }

  private static parseData(jsonText: any): any {
    return JSON.parse(JSON.stringify(jsonText), (key, value) => {
      if (value && typeof value === 'string' && value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/)) {
        return moment(value).toDate();
      }
      return value;
    });
  }

  private static handleError(observer, errorResponse: HttpErrorResponse | any, getMethod: boolean = false) {
    let errMsg: string;
    if (errorResponse.error instanceof Error) {
      errMsg = errorResponse.error.message;
      console.error(errMsg);
      throw errMsg;
    } else if (observer) {
      if (errorResponse.status === 400) { // Bad request
        const postResult = new PostResult();
        postResult.success = false;
        postResult.errors = [];
        postResult.errors.push(errorResponse.error.error);
        postResult.lastOperation = LastOperation.None;
        observer.next(postResult);
        observer.complete();
      } else if (errorResponse.status === 403) { // UnAuthorized
        if (getMethod) {
          observer.error('You are not authorized for requested resource.');
        } else {
          const postResult = new PostResult();
          postResult.success = false;
          postResult.errors = [];
          postResult.errors.push('You are not authorized for requested resource');
          postResult.lastOperation = LastOperation.None;
          observer.next(postResult);
          observer.complete();
        }
      } else if (errorResponse.status == 404) {
        observer.next(null);
        observer.complete();
      } else if (errorResponse.status === 500 || errorResponse.status === 0) {
        if (getMethod) {
          observer.error('You are not authorized for requested resource.');
        } else {
          const postResult = new PostResult();
          postResult.success = false;
          postResult.errors = [];
          postResult.errors.push('Error occurred while processing your request. Please try again.');
          postResult.lastOperation = LastOperation.None;
          observer.next(postResult);
          observer.complete();
        }
      } else {
        observer.error('error occurred');
        errMsg = `${errorResponse.status} - ${errorResponse.statusText || ''}`;
        console.error(errMsg);
        throw errMsg;
      }
    }
  }
}
