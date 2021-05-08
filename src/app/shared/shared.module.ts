import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BackendHeaderComponent } from './backend-header/backend-header.component';
import { BackendFooterComponent } from './backend-footer/backend-footer.component';
import { SideNaveComponent } from './side-nave/side-nave.component';
import { MessageBoxComponent } from '../shared/MessageBox/MessageBox.Component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BackendHeaderComponent, 
    BackendFooterComponent, SideNaveComponent, MessageBoxComponent],
  exports: [
    HeaderComponent,
    FooterComponent,
    BackendHeaderComponent,
    BackendFooterComponent,SideNaveComponent,MessageBoxComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedRoutingModule
  ],
  providers:[
    MessageBoxComponent
  ]
})
export class SharedModule { }
