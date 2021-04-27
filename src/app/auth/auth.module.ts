import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';

import {ResetPassword} from './login/ResetPassword.component';

@NgModule({
  declarations: [SignupComponent, LoginComponent,ResetPassword],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    CommonModule,
    AuthRoutingModule,FormsModule
    ,ReactiveFormsModule
  ]
})
export class AuthModule { }
