import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { MasterDataComponent } from './master-data/master-data.component';
import { MasterListingComponent } from './master-listing/master-listing.component';
import { ProjectTypeComponent } from './project-type/project-type.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: MasterDataComponent
      },
      {
        path: 'masterlist',
        component: MasterListingComponent
      },
      {
        path: 'ProjectType',
        component: ProjectTypeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
