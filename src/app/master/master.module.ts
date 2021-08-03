import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MasterDataComponent } from './master-data/master-data.component';
import { MasterListingComponent } from './master-listing/master-listing.component';
import { ProjectTypeComponent } from './project-type/project-type.component';
import { MaterialModule } from '../shared/materialmodule/materialmodule.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [MasterDataComponent, MasterListingComponent, ProjectTypeComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MasterRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class MasterModule { }
