import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {TypeUtility} from '../../../services/utilities/type-utility';
import {InputType} from '../models/input-type';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.css']
})
export class FormGroupComponent implements OnInit, OnChanges {

  touched: boolean;
  dirty: boolean;
  inputTypeEnum = InputType;

  @Input()
  verticalForm: boolean;
  @Input()
  formGroup: FormGroup;
  @Input()
  controlName: string;

  @Input()
  label: string;
  @Input()
  inputCols: number;

  @Input()
  inputType: InputType;

  required: boolean;
  @Input()
  readonly: boolean;
  readonlyValue: string;

  @Output()
  valueChanged = new EventEmitter<any>();

  inputId: string;

  fireOnChange: boolean;

  @ViewChild('inputElement') inputElement: ElementRef;
  @ViewChild('textAreaElement') textAreaElement: ElementRef;

  constructor() {
    this.formGroup = new FormGroup({
      formControl: new FormControl()
    });
    this.readonlyValue = null;
    this.inputCols = 10;
    this.inputId = TypeUtility.createGuid();
    this.fireOnChange = true;
    this.verticalForm = false;
  }

  ngOnInit() {
    if (this.label.endsWith(':')) {
      this.label = this.label.trim().substring(0, this.label.length - 1).trim();
    }
    const formControl = this.formGroup.controls[this.controlName];

    this.formGroup.valueChanges.subscribe(() => {
      if (formControl != null && this.inputElement != null) {
        if (this.inputType == InputType.Text || this.inputType == InputType.Email) {
          this.inputElement.nativeElement.value = formControl.value;
        }
      }

      if (this.inputType == InputType.TextArea) {
        this.textAreaElement.nativeElement.value = formControl.value;
      }
    });

    if (this.inputType == InputType.Email) {

      const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (formControl.validator != null) {
        const validator = formControl.validator({} as AbstractControl);
        if (validator.required) {
          formControl.setValidators([Validators.required, Validators.pattern(emailPattern)]);
        } else {
          formControl.setValidators([Validators.pattern(emailPattern)]);
        }
      } else {
        formControl.setValidators([Validators.pattern(emailPattern)]);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formGroup']) {
      const formGroup = changes['formGroup'].currentValue as FormGroup;
      setTimeout(() => {
        if (this.controlName != null) {
          const formControl = formGroup.controls[this.controlName];

          if (formControl != null) {
            this.touched = formControl.touched;
            this.dirty = formControl.dirty;

            if (formControl.validator != null) {
              const validator = formControl.validator({} as AbstractControl);
              this.required = validator.required;
            }

            if (this.readonly) {
              this.readonlyValue = formControl.value;
            } else {
              switch (this.inputType) {
                case InputType.Text:
                case InputType.Email:
                  this.inputElement.nativeElement.value = formControl.value;
                  break;
                case InputType.TextArea:
                  this.textAreaElement.nativeElement.value = formControl.value;
                  break;
              }
            }
          }
        }
      }, 100);
    }
  }

  createPlaceHolder(): string {
    return this.label ? this.label.replace(/:$/, '') : '';
  }

  getType(): string {
    return 'text';
  }

  changed(value: any): void {
    this.valueChanged.emit(value.toString().trim());
    if (this.formGroup != null && this.controlName != null) {
      this.formGroup.controls[this.controlName].setValue(value);
    }
  }

  setTouched(): void {
    this.touched = true;
  }

  getErrorMessage(): string {
    return this.required && this.label != null ? `${this.label} is required` : null;
  }

  invalid(): boolean {
    const formControl = this.formGroup.controls[this.controlName];
    if (formControl != null) {
      return formControl.invalid && (this.touched || formControl.touched) || (this.inputType == InputType.PasswordConfirm && this.formGroup.hasError('custom'));
    }
    return false;
  }

  preventKeyPress(event): void {
    event.preventDefault();
  }
}
