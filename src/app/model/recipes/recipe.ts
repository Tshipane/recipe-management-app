import {RecipeStep} from './recipe-step';

export class Recipe {
  recipeId: string;
  title: string;
  description: string;
  steps: RecipeStep[];
  notes: string;
}
