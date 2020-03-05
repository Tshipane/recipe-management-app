import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RecipesComponent} from './components/recipes/recipes/recipes.component';
import {AuthenticationGuardService} from './services/guards/authentication/authentication-guard.service';
import {LoginComponent} from './components/auth/login/login.component';
import {EditUserComponent} from './components/users/edit-user/edit-user.component';
import {SignUpComponent} from './components/auth/sign-up/sign-up.component';
import {UserDetailsComponent} from './components/users/user-details/user-details.component';
import {ChangePasswordComponent} from './components/auth/change-password/change-password.component';

const routes: Routes = [
  {path: '', redirectTo: 'recipes', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'profile', component: UserDetailsComponent, canActivate: [AuthenticationGuardService]},
  {path: 'edit-profile', component: EditUserComponent, canActivate: [AuthenticationGuardService]},
  {path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthenticationGuardService]},
  {path: 'recipes', component: RecipesComponent, canActivate: [AuthenticationGuardService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
