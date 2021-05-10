import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/materialmodule/materialmodule.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CreatobfComponent } from './creatobf/creatobf.component';



@NgModule({
  declarations: [DashboardComponent, CreatobfComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    MatExpansionModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    FlexLayoutModule,
    MaterialModule,
    NgxDropzoneModule
    
  ],
  providers:[DatePipe]
})
export class DashboardModule { }
