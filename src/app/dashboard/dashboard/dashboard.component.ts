import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTableModule ,MatTableDataSource} from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DashboardService } from '../dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from "@angular/router"
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
import * as moment from 'moment';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';

//region Model
export class DashBoardModel
{
  _user_code:string;
}
export class DashboardcountModel
{
  _draft_obf:number;
  _draft_ppl:number;
  _draft:number;
  _submitted_obf:number;
  _submitted_ppl:number;
  _submitted:number;
  _approved_obf:number;
  _approved_ppl:number;
  _rejected_obf:number;
  _rejected_ppl:number;
  _rejected:number;
  _pendingobf:number;
  _pendingppl:number;
  _TotalPending:number;
  _approved:number;
}
//end region
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(DaterangepickerDirective, {static: true,}) picker: DaterangepickerDirective;direction: 'rtl';
  selected: {startDate: moment.Moment, endDate: moment.Moment};
  open() {
    this.picker.open();
  }

   DraftColumn: string[] = ['ProjectName', 'Code', 'Opp_Id', 'Total_Cost','Total_Revenue','Gross_Margin','DetailedOBF','ActionDraft'];
   SubmittedScreenColumn: string[] = ['ApprovalStatus', 'CurrentStatus','ProjectName', 'Code', 'Opp_Id', 'Total_Cost','Total_Revenue','Gross_Margin','DetailedOBF','FinalAgg','ActionSubmitted'];
   PendingReviewercolumn: string[] = ['ApprovalStatus', 'CurrentStatus','ProjectName', 'Code', 'Opp_Id', 'Total_Cost','Total_Revenue','Gross_Margin','DetailedOBF','FinalAgg','ActionPendingforapproval'];
   RejectedScreenColumn: string[] = ['ApprovalStatus', 'CurrentStatus','ProjectName', 'Code', 'Opp_Id', 'Total_Cost','Total_Revenue','Gross_Margin','DetailedOBF','FinalAgg','ActionReinitialize'];
   
   
   // dataSource = ELEMENT_DATA;
  Draft:boolean=true;
  SubmittedScreen:boolean=false;
  _dashboardcountModel:DashboardcountModel=new DashboardcountModel();
  listData: MatTableDataSource<any>;
  columns:Array<any>;
  displayedColumns:Array<any>;
  theRemovedElement:any="";
  dataSource:any;
  searchKey: string;
  dashboardData:any[]=[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  _dashboardmodel:DashBoardModel=new DashBoardModel();
  privilege_name:string;
  Rejected:boolean=false;
  public Dashboardvalid: FormGroup;
  
  // selected: {startDate: Moment, endDate: Moment};
  // alwaysShowCalendars: boolean;
  // locale: LocaleConfig = {
  //   format: 'YYY-MM-DD',
  //   displayFormat: 'YYYY MMMM DD',
  //   separator: ' To ',
  //   cancelLabel: 'Mégse',
  //   applyLabel: 'Ok',
  // };
  constructor(private _dashboardservice:DashboardService,private router: Router) { }
 

  

  ngOnInit() {
    // Get list of columns by gathering unique keys of objects found in DATA.
    this.Dashboardvalid = new FormGroup({
     
    });
    if(sessionStorage.getItem("privilege_name")!= null)
    {
      this.privilege_name=sessionStorage.getItem("privilege_name");

    }
    this.CallDashBoardService();
    this.GetDatabaseCount();
  }
  ngAfterViewInit() {
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator
}
downloaddetailobf(element)
{
  alert("download documnet");
}
  getToolTipData(issueId: any): any {
    
    //  alert(JSON.stringify(issueId));
    return JSON.stringify(issueId);
   
}
  CallDashBoardService()
  {
    this._dashboardmodel._user_code=localStorage.getItem("UserName");
    this._dashboardservice.GetDashBoardData(this._dashboardmodel).subscribe(Result=>{
      debugger;
      console.log("DashBoardData");
      console.log(Result);
      var loginresult =Result;
      this.dashboardData=JSON.parse(Result);
       this.BindGridDetails();
    },
    (error:HttpErrorResponse)=>{
      debugger;
      if (error.status==401)
      {
        this.router.navigateByUrl('/login');
        
      }
      
    }
    );
    // this.dashboardData=DATA;
    // this.BindGridDetails();
  }
 
  BindGridDetails()// code given by kirti kumar shifted to new function
  {
    
    const columns = this.dashboardData
    .reduce((columns, row) => {
      return [...columns, ...Object.keys(row)]
    }, [])
    .reduce((columns, column) => {
      return columns.includes(column)
        ? columns
        : [...columns, column]
    }, [])
  // Describe the columns for <mat-table>.
  this.columns = columns.map(column => {
    return { 
      columnDef: column,
      header: column.replace("_"," "),
      cell: (element: any) => `${element[column] ? element[column] : ``}`     
    }
  })
  this.displayedColumns = this.columns.map(c => c.columnDef);
  //this.displayedColumns.push('ActionDraft');
  this.addColumn(0) 
  this.theRemovedElement  = this.columns.shift();
     
     console.log("columns"+this.columns);
     console.log("theRemovedElement"+this.theRemovedElement);
    // console.log(this.displayedColumns);
  // Set the dataSource for <mat-table>.
  // this.dataSource = DATA
    
  this.listData = new MatTableDataSource(this.dashboardData);
  this.listData.sort = this.sort;
  this.listData.paginator = this.paginator;
  
  // this.listData.filterPredicate = (data, filter) => {
  //   return this.displayedColumns.some(ele => {
  //     return ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
  //   });
  // };
  }
  CreateOBF()
  {
    this.router.navigate(['/DealHUB/dashboard/createobf']);
    
  }
  // change(event) {
  //   console.log(event);
  // }
  addColumn(selection) {
  if(this.privilege_name=="OBF Initiator")
    {
      if(selection==0)
      {
        //Draft Section.
        this.displayedColumns=this.DraftColumn;
      }
      else if (selection==1)
      {
          //Submitted section
          this.displayedColumns=this.SubmittedScreenColumn;
      }
      else if(selection==2)
      {
        this.displayedColumns=this.RejectedScreenColumn;
      }
    }
    else if(this.privilege_name=="OBF Reviewer")
    {
      if(selection==0)
      {
        //Pending for approval Section.
      this.displayedColumns=this.PendingReviewercolumn;
      }
      else if (selection==1)
      {
         //Approved section

      }
      else if(selection==2)
      {
        this.displayedColumns=this.RejectedScreenColumn;
      }
    }
   
  }

  GetDatabaseCount()
  {
    

    this._dashboardmodel._user_code=localStorage.getItem("UserName");
    this._dashboardservice.GetDashboardCount(this._dashboardmodel).subscribe(Result=>{
      debugger;
      console.log("DashBoardData");
      console.log(Result);
      var loginresult =Result;
      this._dashboardcountModel=JSON.parse(Result);
      
    },
    (error:HttpErrorResponse)=>{
      debugger;
      if (error.status==401)
      {
        this.router.navigateByUrl('/login');
        
      }
      
    }
    );
  }
}
