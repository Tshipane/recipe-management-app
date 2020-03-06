import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {InputType} from '../models/input-type';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  @Input()
  modalId: string;
  @Input()
  message: string;
  @Input()
  includeComment: boolean;
  @Input()
  commentLabel: string;

  formGroup: FormGroup;

  inputType = InputType;

  @Output()
  confirmed = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder) {
    this.includeComment = false;
    this.commentLabel = 'Comment';
  }

  ngOnInit() {
    if (this.includeComment) {
      this.formGroup = this.formBuilder.group({
        comment: ['', Validators.required]
      });
    }
  }

  confirm(): void {
    if (this.includeComment) {
      const formControl = this.formGroup.controls['comment'] as FormControl;
      this.confirmed.emit(formControl.value);
    } else {
      this.confirmed.emit();
    }
  }

  active(): boolean {
    return this.includeComment
      ? this.formGroup.valid
      : true;
  }
}
