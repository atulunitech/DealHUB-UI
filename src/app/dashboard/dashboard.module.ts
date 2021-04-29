import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/materialmodule/materialmodule.module';
import { CreateOBFComponent } from './create-obf/create-obf.component';
import { NgxDropzoneModule } from 'ngx-dropzone';



@NgModule({
  declarations: [DashboardComponent, CreateOBFComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    MatButtonModule,
    MatTableModule,
    FlexLayoutModule,
    MaterialModule,
    NgxDropzoneModule
    
  ]
})
export class DashboardModule { }
