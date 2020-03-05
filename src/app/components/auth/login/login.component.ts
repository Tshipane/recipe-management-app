import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../../services/shared/shared.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {InputType} from '../../common/models/input-type';
import {PostResult} from '../../../model/common/post-result';
import {ToastrMessageService} from '../../../services/toastr-message/toastr-message.service';
import {LoginModel} from '../../../model/auth/login-model';
import {AuthService} from '../../../services/auth/auth.service';
import {Router} from '@angular/router';
import {AuthToken} from '../../../model/auth/auth-token';
import {CookieUtility} from '../../../services/utilities/cookie-utility';
import {RecipeManagementConstants} from '../../../model/common/recipe-management-constants';
import {User} from '../../../model/users/user';
import {UserService} from '../../../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  inputType = InputType;

  constructor(private sharedService: SharedService,
              private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private toastrMessageService: ToastrMessageService) {
    this.sharedService.setPageTitle(null);
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      emailAddress: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required)
    });
  }

  login(): void {
    const loginModel = this.formGroup.value as LoginModel;
    this.sharedService.setFormSubmitting();
    this.authService.login(loginModel).subscribe((authToken: AuthToken) => {
      if (authToken != null) {
        this.sharedService.authToken = authToken;
        // Store authToken in cookie
        CookieUtility.setCookie(RecipeManagementConstants.recipeManagementAuthToken, JSON.stringify(authToken), 7);
        this.userService.getLoggedInUser().subscribe((loggedInUser: User) => {
          this.sharedService.user = loggedInUser;
          this.router.navigate(['/']);
          this.toastrMessageService.success('You have successfully logged in.', 5000);
          this.sharedService.clearFormSubmitting();
        });
      } else {
        this.toastrMessageService.error('Login failed. Invalid username or password.', 5000);
        this.sharedService.clearFormSubmitting();
      }
    });
  }
}
