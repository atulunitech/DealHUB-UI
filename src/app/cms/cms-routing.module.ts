import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { LoginComponent } from '../auth/login/login.component';

import {ResetPassword} from '../auth/ResetPassword/ResetPassword.component'
const routes: Routes = [
  { path: '', redirectTo:'login', component: HomeComponent },
  { path: 'singin', component:SignupComponent},
  { path: 'login', component:LoginComponent},
  { path: '404', component: PageNotFoundComponent },
  {path: 'ResetPassword', component: ResetPassword }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
