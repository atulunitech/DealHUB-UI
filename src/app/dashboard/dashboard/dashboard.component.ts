import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';

import { DashboardService } from '../dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from "@angular/router";
import * as moment from 'moment';


  export interface PeriodicElement {
    PROJECTNAME: string;
    APPROVALSTATUS: number;
    CODE: number;
    OPPID: string;
  }
  
  const ELEMENT_DATA: PeriodicElement[] = [
    {APPROVALSTATUS: 1, PROJECTNAME: 'Hydrogen', CODE: 1.0079, OPPID: 'H'},
    {APPROVALSTATUS: 2, PROJECTNAME: 'Helium', CODE: 4.0026, OPPID: 'He'},
    {APPROVALSTATUS: 3, PROJECTNAME: 'Lithium', CODE: 6.941, OPPID: 'Li'},
    {APPROVALSTATUS: 4, PROJECTNAME: 'Beryllium', CODE: 9.0122, OPPID: 'Be'},
    {APPROVALSTATUS: 5, PROJECTNAME: 'Boron', CODE: 10.811, OPPID: 'B'},
    {APPROVALSTATUS: 6, PROJECTNAME: 'Carbon', CODE: 12.0107, OPPID: 'C'},
    {APPROVALSTATUS: 7, PROJECTNAME: 'Nitrogen', CODE: 14.0067, OPPID: 'N'},
    {APPROVALSTATUS: 8, PROJECTNAME: 'Oxygen', CODE: 15.9994, OPPID: 'O'},
    {APPROVALSTATUS: 9, PROJECTNAME: 'Fluorine', CODE: 18.9984, OPPID: 'F'},
    {APPROVALSTATUS: 10, PROJECTNAME: 'Neon', CODE: 20.1797, OPPID: 'Ne'},
  ];
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(DaterangepickerDirective, {static: true}) picker: DaterangepickerDirective;
  selected: {startDate: moment.Moment, endDate: moment.Moment};

  displayedColumns: string[] = ['APPROVALSTATUS', 'PROJECTNAME', 'CODE', 'OPPID'];
  dataSource = ELEMENT_DATA;
 
  
  constructor(private _dashboardservice:DashboardService,private router: Router) { }
 

  

  ngOnInit() {
    // Get list of columns by gathering unique keys of objects found in DATA.
  
   
  }

  open() {
    this.picker.open();
    
  }

 


}
