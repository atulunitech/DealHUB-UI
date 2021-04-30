import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTableModule ,MatTableDataSource} from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DashboardService } from '../dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from "@angular/router"


  export interface PeriodicElement {
    PROJECTNAME: string;
    APPROVALSTATUS: number;
    CODE: number;
    OPPID: string;
  }
  
  export class DashBoardModel
{
  _user_code:string;
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

  // displayedColumns: string[] = ['APPROVALSTATUS', 'PROJECTNAME', 'CODE', 'OPPID'];
  // dataSource = ELEMENT_DATA;
  listData: MatTableDataSource<any>;
  columns:Array<any>;
  displayedColumns:Array<any>;
  theRemovedElement:any;
  dataSource:any;
  searchKey: string;
  dashboardData:any[]=[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  _dashboardmodel:DashBoardModel=new DashBoardModel();

  
  constructor(private _dashboardservice:DashboardService,private router: Router) { }
 

  

  ngOnInit() {
    // Get list of columns by gathering unique keys of objects found in DATA.
    this.CallDashBoardService();
   
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
  this.displayedColumns.push('Action');
     
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
 


}
