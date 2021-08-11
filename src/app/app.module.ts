
import { FlexLayoutModule } from '@angular/flex-layout';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { BackendLayoutComponent } from './layouts/backend-layout/backend-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './auth/auth.guard';
 import { AuthInterceptor } from './auth/auth.interceptor';
import { MatDialogModule } from '@angular/material/dialog';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BnNgIdleService } from 'bn-ng-idle';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    BackendLayoutComponent
    
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,MatDialogModule,
    MatSnackBarModule,MatMenuModule
  //  BrowserAnimationsModule,
    
    ],
    providers: [BnNgIdleService,AuthGuard,{
      provide : HTTP_INTERCEPTORS,
      useClass : AuthInterceptor,
      multi : true
    }]
    
    ,
  bootstrap: [AppComponent]
})
export class AppModule { }
