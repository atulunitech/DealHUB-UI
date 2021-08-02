import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBoxComponent } from 'src/app/shared/MessageBox/MessageBox.Component';
import { MasterService } from '../services/master.service';

class Mstcommonparameters
{
  _domain_id:number
  _domain_code:string
  _domain_name:string
  _active:number
  _user_id:string;
}
@Component({
  selector: 'app-master-listing',
  templateUrl: './master-listing.component.html',
  styleUrls: ['./master-listing.component.scss']
})
export class MasterListingComponent implements OnInit {
@Input() masterType : any;
displayedColumns:Array<any>;
  constructor(private router: Router,private route:ActivatedRoute,private _masterservice:MasterService,private _mesgBox: MessageBoxComponent) { }
  userdetails :Mstcommonparameters;
  UsersColumn: string[] = ['user_code', 'first_name', 'last_name', 'mobile_no','email_id','useractive'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
     this.paginator = mp;
    
     }
     DraftColumn: string[] = ['domain_code','domain_name'];
  ngOnInit(): void {
    this.userdetails = new Mstcommonparameters();
    this.route.queryParams.subscribe
    (params => {
      if(params['type'] != undefined)
      {
        let type = params['type'].toString().trim();
        this.switchtotypeapi(type);
      }
    }
    );
    
  }
  
  casshChange()
  {
    alert("changes");
  }

  switchtotypeapi(type)
  {
     switch (type) {
       case "Users":
         this.getdataforusers();
         break;
      case "ProjectType":
        this.GetMasterData();
        this.masterType="Project Type";
        break;
       default:
         break;
     }
  }

  getdataforusers()
  {
    this.userdetails._user_id = localStorage.getItem('UserCode');
    this._masterservice.getusermaster(this.userdetails).subscribe(res =>{
      console.log(res);
      res =JSON.parse(res);
      this.dashboardData = res.mst_users;
      this.BindGridDetails();
      this.displayedColumns=this.UsersColumn;
    },
   error =>
   {
    this._mesgBox.showError(error.message);
   });
  }

  pageTitle()
  {
   return this.masterType;
  }
  
  dashboardData:any[]=[];
  columns:Array<any>;
  listData: MatTableDataSource<any>;
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
 
  this.listData = new MatTableDataSource(this.dashboardData);
  this.listData.sort = this.sort;
  this.listData.paginator = this.paginator;
  //this.displayedColumns.push('ActionDraft');
   
 // this.theRemovedElement  = this.columns.shift();
}

GetMasterData()
{
 
  this._masterservice.GetMstDomains().subscribe((Result)=>
  {
    console.log(Result);
    var res=JSON.parse(Result);
    this.displayedColumns=this.DraftColumn;
    this.dashboardData=res.domains;
  
    this.BindGridDetails();
   
  })
  
}
}
