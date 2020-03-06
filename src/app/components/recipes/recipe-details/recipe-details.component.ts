import {Component, OnInit} from '@angular/core';
import {Recipe} from '../../../model/recipes/recipe';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RecipeService} from '../../../services/recipe/recipe.service';
import {SharedService} from '../../../services/shared/shared.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PostResult} from '../../../model/common/post-result';
import {ToastrMessageService} from '../../../services/toastr-message/toastr-message.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  recipe: Recipe;
  formGroup: FormGroup;

  constructor(private recipeService: RecipeService,
              public sharedService: SharedService,
              private toastrMessageService: ToastrMessageService,
              private  fBuilder: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.sharedService.setPageTitle('Recipe Details');
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      const recipeId = params['id'];
      this.recipeService.getRecipe(recipeId).subscribe((recipe: Recipe) => {
        this.recipe = recipe;
        this.setFormFields();
      });
    });
  }

  setFormFields(): void {
    this.formGroup = this.fBuilder.group({
      title: [this.recipe.title],
      description: [this.recipe.description],
      notes: [this.recipe.notes]
    });
  }

  deleteConfirmed(): void {
    this.sharedService.setFormSubmitting();
    this.recipeService.deleteRecipe(this.recipe.recipeId).subscribe((postResult: PostResult) => {
      if (postResult.success) {
        this.router.navigate(['/recipes']);
        this.toastrMessageService.success('Recipe deleted successfully', 5000);

        this.sharedService.clearFormSubmitting();
      } else {
        this.toastrMessageService.error(postResult.errors[0], 5000);
        this.sharedService.clearFormSubmitting();
      }
    });
  }
}

