import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../../services/shared/shared.service';
import {RecipeStep} from '../../../model/recipes/recipe-step';
import {Recipe} from '../../../model/recipes/recipe';
import {RecipeService} from '../../../services/recipe/recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  recipes: Recipe[];

  constructor(private sharedService: SharedService,
              private recipeService: RecipeService) {
    this.sharedService.setPageTitle('Recipes');
  }

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });
  }
}
