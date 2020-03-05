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

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
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
    this.sharedService.setPageTitle('Sign Up');

    this.passwordErrors = [new KeyValuePair<ValidatorType, string>(ValidatorType.Pattern, 'Password must have 8 characters, numbers, special characters, lower and upper case')];
    this.confirmPasswordErrors = [new KeyValuePair<ValidatorType, string>(ValidatorType.Custom, 'Password does not match')];
  }

  ngOnInit(): void {
    this.user = new User();
    this.setFormFields();
  }

  setFormFields(): void {
    this.formGroup = this.formBuilder.group({
      name: [this.user.name, Validators.required],
      surname: [this.user.surname, Validators.required],
      emailAddress: [this.user.emailAddress, Validators.required],
      cellphoneNumber: [this.user.cellphoneNumber, Validators.required],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&/.,+=``#-_/<>~^|\:;""])[A-Za-z\d$@$!%].{7,}')]],
      confirmPassword: ['', Validators.required],
    }, {validator: SignUpComponent.confirmPassword});
  }

  submit(): void {
    this.user = this.formGroup.value;
    this.sharedService.setFormSubmitting();
    this.userService.addOrUpdateUser(this.user).subscribe((postResult: PostResult) => {
      if (postResult.success) {
        this.login(this.user, () => {
          this.router.navigate(['/']);
          this.toastrMessageService.success('You have successfully signed up.', 5000);
          this.sharedService.clearFormSubmitting();
        });
      } else {
        this.toastrMessageService.error(postResult.errors[0], 5000);
        this.sharedService.clearFormSubmitting();
      }
    });
  }

  login(user: User, callback: () => void): void {
    const loginModel = new LoginModel();
    loginModel.emailAddress = user.emailAddress;
    loginModel.password = user.password;
    this.authService.login(loginModel).subscribe((authToken: AuthToken) => {
      this.sharedService.authToken = authToken;
      // Store authToken in cookie
      CookieUtility.setCookie(RecipeManagementConstants.recipeManagementAuthToken, JSON.stringify(authToken), 7);
      this.userService.getLoggedInUser().subscribe((loggedInUser: User) => {
        this.sharedService.user = loggedInUser;
        callback();
      });
    });
  }

  static confirmPassword(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;
    return pass === confirmPass ? null : {custom: true};
  }
}
