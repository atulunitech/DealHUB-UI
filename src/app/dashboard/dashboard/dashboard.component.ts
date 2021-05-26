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
import { OBFServices, SAPIO } from '../services/obfservices.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { MyErrorStateMatcher, SaveServiceParameter, sectors, Solutiongroup, Solutionservices, subsectors } from '../creatobf/creatobf.component';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MessageBoxComponent } from 'src/app/shared/MessageBox/MessageBox.Component';

//region Model
export class DashBoardModel
{
  _user_code:string;
}

class Serviceslist{
  value:string;
  viewValue:string;
  constructor(val:string,viewval:string)
   {
    this.value = val;
    this.viewValue = viewval;
   }
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

  matcher = new MyErrorStateMatcher();
  Solutiongroup: Solutiongroup[] =[];
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
  @ViewChild('chipList') SAPIOchiplist: MatChipList;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  _dashboardmodel:DashBoardModel=new DashBoardModel();
  privilege_name:string;
  Rejected:boolean=false;
  selectable = true;
  removable = true;
  addOnBlur = true;
  public Dashboardvalid: FormGroup;
  servicesControl = new FormControl('', Validators.required);
  
  // selected: {startDate: Moment, endDate: Moment};
  // alwaysShowCalendars: boolean;
  // locale: LocaleConfig = {
  //   format: 'YYY-MM-DD',
  //   displayFormat: 'YYYY MMMM DD',
  //   separator: ' To ',
  //   cancelLabel: 'Mégse',
  //   applyLabel: 'Ok',
  // };
  constructor(private _dashboardservice:DashboardService,private router: Router,public _obfservices:OBFServices,public dialog: MatDialog,private _mesgBox: MessageBoxComponent) { }
 

  

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
    this.getcreateobfmasters();
    this.getsolutionmaster();
  }

  getcreateobfmasters()
  {
    this._obfservices.GetCreateOBFMasters(localStorage.getItem('UserName')).subscribe(data =>{
      let res = JSON.parse(data);
       console.log(Object.keys(res) );
       console.log(res.sectors);
       console.log(res.subsector);
       console.log("Vertical Master");
       console.log(res.vertical);
       console.log("Vertical head Master");
       console.log(res.verticalhead);
       this.sectorlist = res.verticalsectorwise;
       this.subsectorlist = res.subsector;
      //  this.verticallist =res.vertical;
      //  this.Verticalheadlist = res.verticalhead;
 },
 (error:HttpErrorResponse)=>{
   this._mesgBox.showError(error.message);
   //alert(error.message);
 });
  }

  editobf(row)
  {
    alert("dsjhdjkshdjks");
    console.log(row);
  }

  getsolutionmaster()
{
this._obfservices.getsolutionmaster(localStorage.getItem('UserName')).subscribe(data =>{
  let res = JSON.parse(data);
  console.log("get solution masters");
  console.log(res);
  this.Solutiongroup= res;
},
(error:HttpErrorResponse)=>{
  this._mesgBox.showError(error.message);
  //alert(error.message);
}
);
}

  ngAfterViewInit() {
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator
}

Solutionservicesarray:Solutionservices[] =[];
servicecate:string="";
serviceslist:SaveServiceParameter[] = [];
sectorlist:sectors[] = [];
onchange(evt,solutioncategory)
{
  if(evt.isUserInput){
  this.Solutionservicesarray = [];
  this._obfservices.obfmodel._solution_category_id = evt.source.value
  //alert("hello world");
  console.log(evt);
  var result = this.Solutiongroup.filter(obj => {
    return obj.Solutioncategory === solutioncategory;
  });
  this.servicecate=solutioncategory;
  this.Solutionservicesarray = result[0].Solutionservices;
  this._obfservices.ObfCreateForm.patchValue({Solutioncategory: evt.source.value});
  // this.servicesControl.setValue(["1","2"]);
}

}

onotherservicesoptionchange(evt,viewValue,solutioncategory,solvalue)
  {
    if(evt.isUserInput) {
      this.disablenableothetinput(evt.source.value,solutioncategory,evt.source.selected);
      if(evt.source.selected)
      {
        if(this.serviceslist.length > 0){
          const index = this.serviceslist.findIndex(res=> res.Solutioncategory == solutioncategory);
          if (index >-1) {
            const indexnew = this.serviceslist[index].Serviceslist.findIndex(newval=> newval.value == evt.source.value);
            if (indexnew >-1) {
               
                }
                else
                {
                  let elements:Serviceslist = new Serviceslist(evt.source.value,viewValue);
                  this.serviceslist[index].Serviceslist.push(elements);
                }
              }
              else
              {

               // this.serviceslist.push({solutioncategory:obj.Solutioncategory,Servicelist:element});
               let elements:Serviceslist = new Serviceslist(evt.source.value,viewValue);
               let servicesobj:SaveServiceParameter = new SaveServiceParameter(solutioncategory,solvalue,elements); 
               
                  this.serviceslist.push(servicesobj);
              }
        
        }
        else
        {
          
          let elements:Serviceslist = new Serviceslist(evt.source.value,viewValue);
          let servicesobj:SaveServiceParameter = new SaveServiceParameter(solutioncategory,solvalue,elements); 
               
                  this.serviceslist.push(servicesobj);
        }
      }
      else
      {
        if(this.serviceslist.length > 0){
          const index = this.serviceslist.findIndex(res=> res.Solutioncategory == solutioncategory);
          if (index >-1) {
            if(this.serviceslist[index].Serviceslist.length > 0)
            {
              const indexnew = this.serviceslist[index].Serviceslist.findIndex(newval=> newval.value == evt.source.value);
              if (indexnew >-1) {
                this.serviceslist[index].Serviceslist.splice(indexnew, 1);
                 if(evt.source.value == "10" || evt.source.value == "21" || evt.source.value == "29")
                {
                  let val:any = "0";
                  this.serviceslist[index].Serviceslist.splice(this.serviceslist[index].Serviceslist.indexOf(val), 1);
                  if(solutioncategory == "Services")
                  {
                    this._obfservices.ObfCreateForm.patchValue({otherservices: ""});
                  }
                  else if(solutioncategory == "Solutions"){
                    this._obfservices.ObfCreateForm.patchValue({othersolutions: ""});
                  }
                  else if(solutioncategory == "Integrated Solutions"){
                    this._obfservices.ObfCreateForm.patchValue({otherintegratedsolutions: ""});
                  }
                }
                if(this.serviceslist[index].Serviceslist.length > 0)
                {
                }
                else{
                  this.serviceslist.splice(index,1);
                }
                  }
                  else{
                    if(this.serviceslist[index].Serviceslist.length > 0)
                {
                }
                else{
                  this.serviceslist.splice(index,1);
                }
                  }
            }
            else{
              this.serviceslist.splice(index,1);
            }
           
              }
              else
              {
               
              }
        
        }
      }
      console.log("service list called");
      console.log(this.serviceslist);
      this._obfservices.ObfCreateForm.patchValue({Otherservicesandcategories: this.serviceslist});
      this._obfservices.obfmodel.Services = this.serviceslist;
      
    }
  }

  disablenableothetinput(value,category,bol)
  {
     if(bol)
     {
       if(value == "10" || value == "21"  || value == "29")
       {
        switch(category)
        {
          case "Services":
           this._obfservices.ObfCreateForm.controls['otherservices'].enable();
           break;
           case "Solutions":
            this._obfservices.ObfCreateForm.controls['othersolutions'].enable();
            break;
            case "Integrated Solutions":
              this._obfservices.ObfCreateForm.controls['otherintegratedsolutions'].enable();
              break;
        }
       }    
     }
     else{
      if(value == "10" || value == "21"  || value == "29")
      {
       switch(category)
       {
        case "Services":
          this._obfservices.ObfCreateForm.controls['otherservices'].disable();
          break;
          case "Solutions":
           this._obfservices.ObfCreateForm.controls['othersolutions'].disable();
           break;
           case "Integrated Solutions":
             this._obfservices.ObfCreateForm.controls['otherintegratedsolutions'].disable();
             break;

       }
      } 
     }
  }  
  subsectorlist:subsectors[] = [];
  subsectorlisdisplay:subsectors[]=[];
  onsectorchange(evt)
  {
    // alert("hello world");
    // console.log(evt);
    // var result = this.Sectorgrouparray.filter(obj => {
    //   return obj.value === evt.value;
    // });
    // this.Subsecotarray = result[0].subsecorlist;

    console.log(evt);
    var result = this.subsectorlist.filter(obj => {
      return obj.Sector_Id === evt.value;
    });
    this.subsectorlisdisplay = result;
    // this._obfservices.obfmodel._Sector_Id= parseInt(this._obfservices.ObfCreateForm.get('Sector').value);
    this._obfservices.obfmodel._Sector_Id = evt.value;


  }

  onsubsectorchange(evt)
  {
    this._obfservices.obfmodel._SubSector_Id = evt.value;
  }

  fetchcustomercode()
  {
    this._obfservices.obfmodel._sap_customer_code = this._obfservices.ObfCreateForm.get("Sapcustomercode").value;
   // alert("customer code :"+this._obfservices.obfmodel._sap_customer_code );
  }

  remove(io: SAPIO): void {
    const index = this._obfservices.obfmodel.sapio.indexOf(io);
    this._obfservices.ObfCreateForm.get("Sapio").setValue('');
    if (index >= 0) {
      this._obfservices.obfmodel.sapio.splice(index, 1);
      // this._obfservices.ObfCreateForm.get("Sapio").setValue(io);
      // this._obfservices.ObfCreateForm.get("Sapionumber").setValue("");
      
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this._obfservices.ObfCreateForm.get("Sapio").setValue(value);
      
         if(this._obfservices.ObfCreateForm.get('Sapio').status.toLowerCase() === "valid")
         {
         this._obfservices.obfmodel.sapio.push({_Cust_SAP_IO_Number: parseInt(value.trim())});
         }
         else{
           const index = this._obfservices.obfmodel.sapio.indexOf(this._obfservices.ObfCreateForm.get("Sapio").value);
            this._obfservices.ObfCreateForm.get("Sapio").setValue("");
           if (index >= 0) {
             this._obfservices.obfmodel.sapio.splice(index, 1);
            
           }
         }
    //this._obfservices.obfmodel.sapio.push({_Cust_SAP_IO_Number: parseInt(value.trim())});
    //this._obfservices.ObfCreateForm.get("Sapionumber").setValue("");
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    console.log("checking in chip");
    console.log(this._obfservices.obfmodel);
  }

openModal(templateRef) {
  let dialogRef = this.dialog.open(templateRef, {
       width: '680px',
       // data: { name: this.name, animal: this.animal }
  });

  dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
  });
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
   
  this.theRemovedElement  = this.columns.shift();
     
     console.log("columns"+this.columns);
     console.log("theRemovedElement"+this.theRemovedElement);
    // console.log(this.displayedColumns);
  // Set the dataSource for <mat-table>.
  // this.dataSource = DATA
    
  this.listData = new MatTableDataSource(this.dashboardData);
  this.listData.sort = this.sort;
  this.listData.paginator = this.paginator;
  this.addColumn(0)
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
  filterValue:string;
  addColumn(selection) {
  if(this.privilege_name=="OBF Initiator")
    {
      if(selection==0)
      {
        //Draft Section.
        
        this.listData = new MatTableDataSource(this.dashboardData);
        this.listData.filter= "Pending";
        if (this.listData.paginator) {
          this.listData.paginator.firstPage();
        }
        this.displayedColumns=this.DraftColumn;
      }
      else if (selection==1)
      {
          //Submitted section
          this.listData.filter="";
          this.listData.filter="Second Project";
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

  obfsummary:obfsummarymodel= new obfsummarymodel();
  getOBFSummaryPage(Row)
  {
    console.log("check obf summary data");
    // this.obfsummary.dh_id = Row.dh_id;
    // this.obfsummary._user_id =parseInt(localStorage.getItem('UserName'));
    this._obfservices.getobfsummarydata(Row.dh_id).subscribe(res =>{
      console.log(res);
      this._obfservices.initializeobf(JSON.parse(res));
    },
    (error)=>{
      alert(error.message);
    }
    );
    console.log(Row);
   
  }
}

export class obfsummarymodel{
  _user_id:number;
  dh_id:number;
}
