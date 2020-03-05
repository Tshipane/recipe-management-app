import {Component, OnInit} from '@angular/core';
import {User} from '../../../model/users/user';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../../../services/user/user.service';
import {SharedService} from '../../../services/shared/shared.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: User;
  formGroup: FormGroup;

  constructor(private userService: UserService,
              private sharedService: SharedService,
              private  fBuilder: FormBuilder
  ) {
    this.sharedService.setPageTitle('Profile');
  }

  ngOnInit() {
    this.user = this.sharedService.user;
    this.formGroup = this.fBuilder.group({
      name: [this.user.name],
      surname: [this.user.surname],
      emailAddress: [this.user.emailAddress],
      cellphoneNumber: [this.user.cellphoneNumber]
    });
  }
}
