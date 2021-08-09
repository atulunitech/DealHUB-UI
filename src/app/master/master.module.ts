import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MasterDataComponent } from './master-data/master-data.component';
import { MasterListingComponent } from './master-listing/master-listing.component';
import { ProjectTypeComponent } from './project-type/project-type.component';
import { MaterialModule } from '../shared/materialmodule/materialmodule.module';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserMasterComponent } from './user-master/user-master.component';
import { ClickOutsideDirective } from './clickoutside.directive';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
  import { MatMenuModule } from '@angular/material/menu';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};



@NgModule({
  declarations: [MasterDataComponent, MasterListingComponent, ProjectTypeComponent,ClickOutsideDirective, UserMasterComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MasterRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MaterialModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule
  ],
  providers:[DatePipe,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }]
})
export class MasterModule { }
