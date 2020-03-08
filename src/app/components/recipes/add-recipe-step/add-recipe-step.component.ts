import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {InputType} from '../../common/models/input-type';
import {RecipeStep} from '../../../model/recipes/recipe-step';

declare let $: any;

@Component({
  selector: 'app-add-recipe-step',
  templateUrl: './add-recipe-step.component.html',
  styleUrls: ['./add-recipe-step.component.css']
})
export class AddRecipeStepComponent implements OnInit, OnChanges {
  inputType = InputType;

  @Input()
  modalId: string;
  @Input()
  editedDescription: string;

  @Output()
  added = new EventEmitter<RecipeStep>();
  @Output()
  cancelled = new EventEmitter();

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.editedDescription = null;
    this.formGroup = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const formControl = this.formGroup.controls['description'] as FormControl;
    const editedDescriptionSimpleChange = changes['editedDescription'] as SimpleChange;
    if (editedDescriptionSimpleChange && editedDescriptionSimpleChange.currentValue) {

      formControl.setValue(editedDescriptionSimpleChange.currentValue.toString());
    } else {
      formControl.setValue(null);
    }
  }

  add(): void {
    const formControl = this.formGroup.controls['description'] as FormControl;
    const recipeStep = new RecipeStep();
    recipeStep.description = formControl.value.toString();
    this.added.emit(recipeStep);
    $(`#${this.modalId}`).modal('hide');
    setTimeout(() => {
      formControl.setValue(null);
    }, 250);
  }

  cancel(): void {
    this.editedDescription = null;
    this.cancelled.emit();
  }
}
