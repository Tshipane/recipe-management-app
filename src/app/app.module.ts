import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormGroupComponent} from './components/common/form-group/form-group.component';
import {RecipesComponent} from './components/recipes/recipes/recipes.component';
import {RecipeDetailsComponent} from './components/recipes/recipe-details/recipe-details.component';
import {EditRecipeComponent} from './components/recipes/edit-recipe/edit-recipe.component';
import {LoginComponent} from './components/auth/login/login.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EditUserComponent } from './components/users/edit-user/edit-user.component';
import { SubmitButtonComponent } from './components/common/submit-button/submit-button.component';
import { UiOverlayComponent } from './components/common/ui-overlay/ui-overlay.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { UserDetailsComponent } from './components/users/user-details/user-details.component';
import { ChangePasswordComponent } from './components/auth/change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    FormGroupComponent,
    RecipesComponent,
    RecipeDetailsComponent,
    EditRecipeComponent,
    LoginComponent,
    EditUserComponent,
    SubmitButtonComponent,
    UiOverlayComponent,
    SignUpComponent,
    UserDetailsComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
