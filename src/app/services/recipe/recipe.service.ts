import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../shared/shared.service';
import {Recipe} from '../../model/recipes/recipe';
import {Observable} from 'rxjs';
import {PostResult} from '../../model/common/post-result';

@Injectable({
  providedIn: 'root'
})
export class RecipeService extends BaseService {

  constructor(http: HttpClient, sharedService: SharedService) {
    super(http, sharedService);
  }

  getRecipes(): Observable<Recipe[]> {
    const getUrl = this.sharedService.createApiUrl(`recipes`);
    return this.get<Recipe[]>(getUrl);
  }

  getRecipe(recipeId: string): Observable<Recipe> {
    const getUrl = this.sharedService.createApiUrl(`recipes/${recipeId}`);
    return this.get<Recipe>(getUrl);
  }

  addOrUpdateRecipe(recipe: Recipe): Observable<PostResult> {
    if (recipe.recipeId) {
      const postUrl = this.sharedService.createApiUrl(`recipes/${recipe.recipeId}`);
      return this.put<PostResult>(postUrl, recipe);
    } else {
      const postUrl = this.sharedService.createApiUrl('recipes');
      return this.post<PostResult>(postUrl, recipe);
    }
  }

  deleteRecipe(recipeId: string): Observable<PostResult> {
    const deleteUrl = this.sharedService.createApiUrl(`recipes/${recipeId}`);
    return this.delete<PostResult>(deleteUrl);
  }
}
