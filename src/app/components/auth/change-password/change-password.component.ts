import {Component, OnInit} from '@angular/core';
import {InputType} from '../../common/models/input-type';
import {User} from '../../../model/users/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {KeyValuePair} from '../../../model/common/key-value-pair';
import {ValidatorType} from '../../common/models/validator-type';
import {UserService} from '../../../services/user/user.service';
import {AuthService} from '../../../services/auth/auth.service';
import {SharedService} from '../../../services/shared/shared.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrMessageService} from '../../../services/toastr-message/toastr-message.service';
import {PostResult} from '../../../model/common/post-result';
import {LoginModel} from '../../../model/auth/login-model';
import {AuthToken} from '../../../model/auth/auth-token';
import {CookieUtility} from '../../../services/utilities/cookie-utility';
import {RecipeManagementConstants} from '../../../model/common/recipe-management-constants';
import {ChangePasswordModel} from '../../../model/auth/change-password-model';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  inputType = InputType;

  user: User;
  formGroup: FormGroup;
  passwordErrors: KeyValuePair<ValidatorType, string>[];
  confirmPasswordErrors: KeyValuePair<ValidatorType, string>[];

  constructor(private userService: UserService,
              private authService: AuthService,
              public sharedService: SharedService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private toastrMessageService: ToastrMessageService) {
    this.sharedService.setPageTitle(null);

    this.passwordErrors = [new KeyValuePair<ValidatorType, string>(ValidatorType.Pattern, 'Password must have 8 characters, numbers, special characters, lower and upper case')];
    this.confirmPasswordErrors = [new KeyValuePair<ValidatorType, string>(ValidatorType.Custom, 'Password does not match')];
  }

  ngOnInit(): void {
    this.user = new User();
    this.setFormFields();
  }

  setFormFields(): void {
    this.formGroup = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&/.,+=``#-_/<>~^|\:;""])[A-Za-z\d$@$!%].{7,}')]],
      confirmPassword: ['', Validators.required],
    }, {validator: ChangePasswordComponent.confirmPassword});
  }

  submit(): void {
    const changePasswordModel = this.formGroup.value as ChangePasswordModel;
    this.sharedService.setFormSubmitting();
    this.authService.changePassword(changePasswordModel).subscribe((postResult: PostResult) => {
      if (postResult.success) {
        this.router.navigate(['/profile']);
        this.toastrMessageService.success('Password changed successfully', 5000);
        this.sharedService.clearFormSubmitting();
      } else {
        this.toastrMessageService.error(postResult.errors[0], 5000);
        this.sharedService.clearFormSubmitting();
      }
    });
  }

  static confirmPassword(group: FormGroup) {
    const pass = group.controls.newPassword.value;
    const confirmPass = group.controls.confirmPassword.value;
    return pass === confirmPass ? null : {custom: true};
  }
}
