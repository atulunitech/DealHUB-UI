import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateOBFComponent } from './dashboard/create-obf/create-obf.component';
import { CreatobfComponent } from './creatobf/creatobf.component';

const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'createobf', component: CreateOBFComponent},
  { path: 'Obf', component: CreatobfComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
