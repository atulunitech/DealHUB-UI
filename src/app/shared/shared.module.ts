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
import { NotificationComponent } from './notification/notification.component';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BackendHeaderComponent, 
    BackendFooterComponent, SideNaveComponent, MessageBoxComponent, NotificationComponent],
  exports: [
    HeaderComponent,
    FooterComponent,
    BackendHeaderComponent,
    BackendFooterComponent,SideNaveComponent,MessageBoxComponent,NotificationComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    SharedRoutingModule
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
