import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/confirm-dialog/confirm-dialog.component';
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


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && control.touched);
  }
}

@Component({
  selector: 'app-master-listing',
  templateUrl: './master-listing.component.html',
  styleUrls: ['./master-listing.component.scss']
})

export class MasterListingComponent implements OnInit {
@Input() masterType : any;

  constructor(private router: Router,private route:ActivatedRoute,public _masterservice:MasterService,private _mesgBox: MessageBoxComponent,public dialog: MatDialog) { }
  userdetails :Mstcommonparameters;
  mst_roles_array = [];
  mst_branches_array = [];
  branchSearchControl = new FormControl();
  matcher = new MyErrorStateMatcher();
  UsersColumn: string[] = ['user_code', 'first_name', 'last_name', 'mobile_no','email_id','usercash','userlocked','userstatus','useraction'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
     this.paginator = mp;
    
     }
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

  lockunlockuser(evt)
  {
    console.log(evt);
    var target = evt.target || evt.srcElement || evt.currentTarget;
    var srcAttr = target.attributes.src;
    srcAttr.nodeValue = 'assets/images/copay_icon.png';
    alert(srcAttr.nodeValue);
    console.log(srcAttr.nodeValue);
  }
  
  casshChange(evt)
  {
    //alert(evt.checked);
    //let res =  this.confirmDialog("Are you sure to change to cash users?");
    
   // console.log(res);
    const message = "Are you sure to change to cash users?";
   let result = false;
  const dialogData = new ConfirmDialogModel("Confirm Action", message);

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    maxWidth: "400px",
    data: dialogData
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
   // this.result = dialogResult;
     if(dialogResult)
     {
       alert("entered");
     }
  });
  }

  switchtotypeapi(type)
  {
     switch (type) {
       case "Users":
         this.getdataforusers();
         break;
     
       default:
         break;
     }
  }

  getdataforusers()
  {
    this._masterservice.createusermasterform();
    this.userdetails._user_id = localStorage.getItem('UserCode');
    this._masterservice.getusermaster(this.userdetails).subscribe(res =>{
      console.log(res);
      res =JSON.parse(res);
      this.dashboardData = res.mst_users;
      this.mst_roles_array = res.mst_roles;
      this.mst_branches_array = res.mst_branch;
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
  displayedColumns:Array<any>;
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

onToggleGroupChange(evt)
{
  console.log(evt.value);
}

getusereditdetails(data)
{
  console.log(data);
}

// confirmDialog(msg): boolean {
//   const message = msg;
//    let result = false;
//   const dialogData = new ConfirmDialogModel("Confirm Action", message);

//   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
//     maxWidth: "400px",
//     data: dialogData
//   });

//   dialogRef.afterClosed().subscribe(dialogResult => {
//    // this.result = dialogResult;
//    result =  dialogResult;
//   });
//   return result;
 
// }

}
