import {Component, OnInit} from '@angular/core';
import {Recipe} from '../../../model/recipes/recipe';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RecipeService} from '../../../services/recipe/recipe.service';
import {SharedService} from '../../../services/shared/shared.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PostResult} from '../../../model/common/post-result';
import {ToastrMessageService} from '../../../services/toastr-message/toastr-message.service';
import {LastOperation} from '../../../model/common/enum/last-operation';
import {RecipeStep} from '../../../model/recipes/recipe-step';
import {InputType} from '../../common/models/input-type';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent implements OnInit {
  inputType = InputType;
  recipe: Recipe;
  formGroup: FormGroup;
  edit: boolean;

  constructor(private recipeService: RecipeService,
              public sharedService: SharedService,
              private toastrMessageService: ToastrMessageService,
              private  fBuilder: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.sharedService.setPageTitle('Recipe');
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.edit = !!params['id'];
      if (this.edit) {
        this.sharedService.setPageTitle('Edit Recipe');
        const recipeId = params['id'];
        this.recipeService.getRecipe(recipeId).subscribe((recipe: Recipe) => {
          this.recipe = recipe;
          this.setFormFields();
        });
      } else {
        this.sharedService.setPageTitle('Add Recipe');
        this.recipe = new Recipe();
        this.recipe.steps = [];
        this.setFormFields();
      }
    });
  }

  setFormFields(): void {
    this.formGroup = this.fBuilder.group({
      recipeId: [this.recipe.recipeId],
      title: [this.recipe.title, Validators.required],
      description: [this.recipe.description, Validators.required],
      notes: [this.recipe.notes]
    });
  }

  submit(): void {
    const recipeItems = this.recipe.steps;
    const recipe = this.formGroup.value as Recipe;
    if (this.recipe.steps.length == 0) {
      this.toastrMessageService.error('Please add recipe steps', 5000);
      return;
    }
    recipe.steps = recipeItems;
    this.sharedService.setFormSubmitting();
    this.recipeService.addOrUpdateRecipe(recipe).subscribe((postResult: PostResult) => {
      if (postResult.success) {
        if (postResult.lastOperation == LastOperation.Add) {
          this.router.navigate(['/recipes']);
          this.toastrMessageService.success('Recipe added successfully', 5000);
        } else {
          this.router.navigate(['/recipes', this.recipe.recipeId]);
          this.toastrMessageService.success('Recipe updated successfully', 5000);
        }
        this.sharedService.clearFormSubmitting();
      } else {
        this.toastrMessageService.error(postResult.errors[0], 5000);
        this.sharedService.clearFormSubmitting();
      }
    });
  }

  removeRecipeStep(index: number): void {
    this.recipe.steps.splice(index, 1);
  }

  recipeStepAdded(recipeStep: RecipeStep): void {
    this.recipe.steps.push(recipeStep);
  }
}
