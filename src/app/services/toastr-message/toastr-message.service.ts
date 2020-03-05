import {Injectable} from '@angular/core';

declare var toastr: any;

@Injectable({
  providedIn: 'root'
})
export class ToastrMessageService {

  constructor() {
    this.setting();
  }

  success(message?: string, timeout?: number) {
    if (timeout) {
      toastr.success(message, null, {timeOut: timeout});
    } else {
      toastr.success(message);
    }
  }

  error(message?: string, timeout?: number) {
    if (timeout) {
      toastr.error(message, null, {timeOut: timeout});
    } else {
      toastr.error(message);
    }
  }

  setting() {
    toastr.options = {
      closeButton: false,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: 'toast-top-center',
      preventDuplicates: false,
      onclick: null,
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '2000',
      extendedTimeOut: '2000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut'
    };
  }


}
