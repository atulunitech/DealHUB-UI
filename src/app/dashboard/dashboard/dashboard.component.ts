import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule ,MatTableDataSource} from '@angular/material/table';
import { DashboardService } from '../dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from "@angular/router"

export class DashBoardModel
{
  _user_code:string;
}


const DATA: any[] = [
  {projectname: 'Flipkart', Code: 'abcd', OppId: '00212', CreatedOn: '23/10/21', CreatedBy: 'Ankur',Vertical:'E-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice',download:'https://unsplash.com/photos/rIDlMH07nRY/download?force=true'},
  {projectname: 'Amazon', Code: 'xyz', OppId: '21502', CreatedOn: '23/09/21', CreatedBy: 'Sarvesh',Vertical:'D-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice',download:'https://unsplash.com/photos/rIDlMH07nRY/download?force=true'},
  {projectname: 'Alpha', Code: 'xyz', OppId: '21502', CreatedOn: '23/09/21', CreatedBy: 'Dhanraj',Vertical:'F-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice',download:'https://unsplash.com/photos/rIDlMH07nRY/download?force=true'},
  {projectname: 'Alpha', Code: 'cde', OppId: '52364', CreatedOn: '23/09/21', CreatedBy: 'Vikas',Vertical:'F-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice',download:'https://unsplash.com/photos/rIDlMH07nRY/download?force=true'},
  {projectname: 'Alpha', Code: 'cde', OppId: '52364', CreatedOn: '23/09/21', CreatedBy: 'Vikas',Vertical:'F-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice',download:'https://unsplash.com/photos/rIDlMH07nRY/download?force=true'},
  ];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
 
  columns:Array<any>;
  displayedColumns:Array<any>;
  theRemovedElement:any;
  dataSource:any;
  listData: MatTableDataSource<any>;
  searchKey: string;
  dashboardData:any[]=[];
  constructor(private _dashboardservice:DashboardService,private router: Router) { }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  _dashboardmodel:DashBoardModel=new DashBoardModel();

  

  ngOnInit() {
    // Get list of columns by gathering unique keys of objects found in DATA.
   this.CallDashBoardService();
   
  }

  CallDashBoardService()
  {
    // this._dashboardmodel._user_code=localStorage.getItem("UserName");
    //  this._dashboardservice.GetDashBoardData(this._dashboardmodel).subscribe(Result=>{
     
       
    //    console.log(Result);
    //    var loginresult =Result;
    //    this.dashboardData=JSON.parse(Result);
    //    this.BindGridDetails();
    //  },
    //  (error:HttpErrorResponse)=>{
    
    //   if (error.status==401)
    //   {
    //      this.router.navigateByUrl('/login');
        
    //  }
      
    //  }
    //  );
     this.dashboardData=DATA;
     this.BindGridDetails();
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

  ngAfterViewInit() {
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
  }
 
  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  getToolTipData(issueId: any): any {
    
    //  alert(JSON.stringify(issueId));
    return JSON.stringify(issueId);
    //console.log(issueId);
    // const issue = this.data.find(i => i.number === issueId);
    // return `Title: ${issue.title} ||
    //     State: ${issue.state} ||
    //     Date: ${issue.created_at}`;
}

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }
   
  onEdit(row){
    console.log(row);
  }
  CreateOBF()
  {
    this.router.navigate(['/DealHUB/dashboard/createobf']);
    
  }


}
