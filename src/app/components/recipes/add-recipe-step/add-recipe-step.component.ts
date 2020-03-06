import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {InputType} from '../../common/models/input-type';
import {RecipeStep} from '../../../model/recipes/recipe-step';

@Component({
  selector: 'app-add-recipe-step',
  templateUrl: './add-recipe-step.component.html',
  styleUrls: ['./add-recipe-step.component.css']
})
export class AddRecipeStepComponent implements OnInit {
  @Input()
  modalId: string;
  formGroup: FormGroup;
  inputType = InputType;

  @Output()
  added = new EventEmitter<RecipeStep>();

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  add(): void {
    const formControl = this.formGroup.controls['description'] as FormControl;
    const recipeStep = new RecipeStep();
    recipeStep.description = formControl.value.toString();
    this.added.emit(recipeStep);
    setTimeout(() => {
      formControl.setValue(null);
    }, 250);
  }
}
