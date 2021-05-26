import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreatobfComponent } from './creatobf/creatobf.component';
import {OBFSummaryComponent} from './OBFSummary/OBFSummary.component';
const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'Obf', component: CreatobfComponent},
  {path: 'OBFSummary/:dh_id/:dh_header_id', component: OBFSummaryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
