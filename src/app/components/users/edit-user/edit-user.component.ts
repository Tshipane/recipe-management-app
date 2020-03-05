import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../../services/shared/shared.service';
import {UserService} from '../../../services/user/user.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrMessageService} from '../../../services/toastr-message/toastr-message.service';
import {User} from '../../../model/users/user';
import {InputType} from '../../common/models/input-type';
import {PostResult} from '../../../model/common/post-result';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  inputType = InputType;
  user: User;
  formGroup: FormGroup;

  constructor(private userService: UserService,
              private sharedService: SharedService,
              public router: Router,
              private  fBuilder: FormBuilder,
              private toastrMessageService: ToastrMessageService) {
    this.sharedService.setPageTitle('Edit Profile');
  }

  ngOnInit() {
    this.user = this.sharedService.user;
    this.formGroup = this.fBuilder.group({
      name: [this.user.name, Validators.required],
      surname: [this.user.surname, Validators.required],
      emailAddress: [this.user.emailAddress, Validators.required],
      cellphoneNumber: [this.user.cellphoneNumber, Validators.required]
    });
  }

  submit(): void {
    const user = this.formGroup.value;
    user.userId = this.sharedService.user.userId;
    this.sharedService.setFormSubmitting();
    this.userService.addOrUpdateUser(user).subscribe((postResult: PostResult) => {
      if (postResult.success) {
        this.router.navigate(['/profile']);
        this.toastrMessageService.success('Profile updated successfully', 5000);
        this.sharedService.clearFormSubmitting();
      } else {
        this.toastrMessageService.error(postResult.errors[0], 5000);
        this.sharedService.clearFormSubmitting();
      }
    });
  }
}
