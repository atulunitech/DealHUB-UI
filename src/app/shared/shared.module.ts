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
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NotificationComponent } from './notification/notification.component';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
  import { MatMenuModule } from '@angular/material/menu';
  import {MatButtonModule} from '@angular/material/button';
  import {MatDialogModule } from '@angular/material/dialog';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BackendHeaderComponent, 
    BackendFooterComponent, SideNaveComponent, MessageBoxComponent,ConfirmDialogComponent, NotificationComponent],
  exports: [
    HeaderComponent,
    FooterComponent,
    ConfirmDialogComponent,
    BackendHeaderComponent,
    BackendFooterComponent,SideNaveComponent,MessageBoxComponent,NotificationComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    SharedRoutingModule,MatMenuModule,MatButtonModule,MatDialogModule
  ],
  providers:[
    MessageBoxComponent,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SharedModule { }
