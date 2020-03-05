import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {SharedService} from '../../../services/shared/shared.service';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.css']
})
export class SubmitButtonComponent implements OnInit {

  @Input()
  formGroup: FormGroup;
  @Input()
  includeCancel: boolean;
  @Input()
  inputCols: number;

  constructor(public sharedService: SharedService) {
    this.includeCancel = true;
    this.inputCols = 10;
  }

  ngOnInit(): void {
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  submitClicked(mouseEvent: MouseEvent) {
    this.validateAllFormFields(this.formGroup);
    if (this.formGroup.invalid) {
      mouseEvent.preventDefault();
    }
  }
}
