import { TemplateRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTableModule ,MatTableDataSource} from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DashboardService } from '../dashboard.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import {Router} from "@angular/router"
import {FormBuilder,FormGroup, FormControl, Validators} from '@angular/forms';
import * as moment from 'moment';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { editobfarguement, OBFServices, SAPIO } from '../services/obfservices.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { MyErrorStateMatcher, SaveServiceParameter, sectors, Solutiongroup, Solutionservices, subsectors } from '../creatobf/creatobf.component';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MessageBoxComponent } from 'src/app/shared/MessageBox/MessageBox.Component';
import { environment } from 'src/environments/environment.prod';
import { CommonService } from 'src/app/services/common.service';
import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map';

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
  _totalapprovedppl:number;
  _totalapprovedobf:number;
}
class SaveAttachmentParameter{
  _dh_id:number;
  _dh_header_id:number;
  _fname:string;
  _fpath:string;
  _created_by:string;
  _description:string;
}
class versiondetail
{
  dh_id:number;
  dh_header_id:number;
  version_name:string;
  dh_code:string;
  datecreated: Date;
  dh_project_name: string;
  opportunity_id: string;
  vertical_name:string;
  tablename:string;

}
class TimeLine
{
  
  dh_id: number;
  dh_header_id: number;
  process_detail_id: number;
  seq:number;
  currentstatus: string;
  comments: string;
  username: string;
  TimeLine:Date;
  actualtimeline: Date;
  actiontakenbyid: number;
  tablename: string;

}
 
class approvalstatusdetail
{
  versiondetail:versiondetail[];
  TimeLine:TimeLine[];
}
export class searchfilter{
  value:string;
  viewValue:string;
}
// class searchvalues
// {

// }
//end region
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  matcher = new MyErrorStateMatcher();
  Solutiongroup: Solutiongroup[] =[];
  dscdsbld:boolean = false;
  approvalstatusdetail:approvalstatusdetail=new approvalstatusdetail();
  @ViewChild(DaterangepickerDirective, {static: true,}) picker: DaterangepickerDirective;direction: 'rtl';
  selected: {startDate: moment.Moment, endDate: moment.Moment};
  open() {
    this.picker.open();
  }
  searchwords: string="";
  searchfiltercontrol = new FormControl();
  statusfiltercontrol = new FormControl();
  searchfilterarr: searchfilter[] = [{viewValue:'Opportunity ID',value:'Opp_Id'},{viewValue:'Project Name',value:'ProjectName'},{viewValue:'Customer Name',value:'customer_name'},{viewValue:'Location',value:'dh_location'},{viewValue:'Vertical',value:'Vertical_name'},{viewValue:'SAP Customer Code',value:'sap_customer_code'},{viewValue:'Sector',value:'sector_name'},{viewValue:'Sub Sector',value:'subsector_name'},{viewValue:'Solution Category',value:'solutioncategory_name'}];

   DraftColumn: string[] = ['ProjectName', 'Code', 'Opp_Id', 'Total_Cost','Total_Revenue','Gross_Margin','DetailedOBF','ActionDraft'];
   SubmittedScreenColumn: string[] = ['ApprovalStatus', 'CurrentStatus','ProjectName', 'Code', 'Opp_Id', 'Total_Cost','Total_Revenue','Gross_Margin','DetailedOBF','FinalAgg','ActionSubmitted'];
   PendingReviewercolumn: string[] = ['ApprovalStatus', 'CurrentStatus','ProjectName', 'Code', 'Opp_Id', 'Total_Cost','Total_Revenue','Gross_Margin','DetailedOBF','FinalAgg','ActionPendingforapproval'];
   RejectedScreenColumn: string[] = ['ApprovalStatus', 'CurrentStatus','ProjectName', 'Code', 'Opp_Id', 'Total_Cost','Total_Revenue','Gross_Margin','DetailedOBF','FinalAgg','ActionReinitialize'];
   ApprovedOBf: string[] = ['ApprovalStatus','ProjectName', 'Code', 'Opp_Id', 'Total_Cost','Total_Revenue','Gross_Margin','DetailedOBF','FinalAgg','ActionApprovedOBF'];
   ApprovedPPL: string[] = ['ApprovalStatus','ProjectName', 'Code', 'Opp_Id', 'Total_Cost','Total_Revenue','Gross_Margin','DetailedOBF','FinalAgg','ActionApprovedPPL'];
   ReviewerApproved:string[]=['ApprovalStatus','ProjectName', 'Code', 'Opp_Id', 'Total_Cost','Total_Revenue','Gross_Margin','DetailedOBF','FinalAgg'];

   
   
   // dataSource = ELEMENT_DATA;
  Draft:boolean=true;
  SubmittedScreen:boolean=false;
  _dashboardcountModel:DashboardcountModel=new DashboardcountModel();
  listData: MatTableDataSource<any>;
  columns:Array<any>;
  displayedColumns:Array<any>;
  theRemovedElement:any="";
  dataSource:any;
  selectedcolumn:number;
  searchKey: string;
  dashboardData:any[]=[];
  statusfilter:any[]=[];
  filterdata:any[]=[];
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
  highlight : any;
  public Dashboardvalid: FormGroup;
  servicesControl = new FormControl('', Validators.required);
   @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  uploadDocfiles:File[]=[];
  uploaddocprocess:any[]=[];
  // selected: {startDate: Moment, endDate: Moment};
  // alwaysShowCalendars: boolean;
  // locale: LocaleConfig = {
  //   format: 'YYY-MM-DD',
  //   displayFormat: 'YYYY MMMM DD',
  //   separator: ' To ',
  //   cancelLabel: 'Mégse',
  //   applyLabel: 'Ok',
  // };
  loading$ = this.commonService.loading$;
  constructor(private _dashboardservice:DashboardService,private router: Router,public _obfservices:OBFServices,public dialog: MatDialog,private _mesgBox: MessageBoxComponent,public commonService:CommonService) { 
    this._obfservices.createform();
    this._obfservices.createnewobfmodelandeditobfmodel();
  }
   keys:any[] = [];
   autocompletearr:any[] = [];
   searchControl = new FormControl();
   filteredOptions: Observable<string[]>;

   statusfiltermethod(evt)
   {
    if(evt.isUserInput){
    // alert(evt.target.value);
    let datefilter:any = [];
    
  datefilter = this.filterdata.filter(o => o.currentstatus_search == evt.source.value);
  this.listData=new MatTableDataSource(datefilter);
    }
   }
  selectfilter(evt)
  {
    //this.keys = [];
    let finalrray:any[] = [];
    if(evt.isUserInput)
    {
      if(evt.source.selected)
      {
        this.keys.push(evt.source.value);
        this.keys[evt.source.value] = new Array;
        
        let res = this.returncolumnvalue(evt.source.value.toString());
        this.keys[evt.source.value].push(res);
         //console.log(res);
        // console.log( keys[evt.source.value]);
        
         for(let i = 0;i< this.keys.length;i++)
         {
          let newarr =  this.keys[i];
          console.log(this.keys[newarr]);
          let newres = this.keys[newarr];
          if(i == 0)
          {
          finalrray = newres[0].slice();
          //break;
         }
         else
         {
           let viewres = newres[0].slice();
          for(let j = 0;j < viewres.length;j++)
          {
            finalrray[j] = finalrray[j]+","+viewres[j];
          }
        }
         //  console.log();
        //  if(this.keys.length > 2 && i == (this.keys.length -1))
        //  {
        //   let newarr =  this.keys[0];
        //   console.log(this.keys[newarr]);
        //   let newres = this.keys[newarr];
        //   finalrray = newres;
        //  }
         }
         finalrray = finalrray.filter((item, i, ar) => ar.indexOf(item) === i);
         console.log("The below Final Array");
         this.autocompletearr = finalrray;
         console.log(finalrray);
      }
      else
      {
        let index = this.keys.findIndex(res=> res == evt.source.value);
        if (index >-1) {
          this.keys.splice(index, 1);
          
        }
        for(let i = 0;i< this.keys.length;i++)
         {
          let newarr =  this.keys[i];
          console.log(this.keys[newarr]);
          let newres = this.keys[newarr];
          if(i == 0)
          {
          finalrray = newres[0];
          //break;
         }
         else
         {
           let viewres = newres[0];
          for(let j = 0;j < viewres.length;j++)
          {
            finalrray[j] = finalrray[j]+","+viewres[j];
          }
        }
         //  console.log();
         }
         finalrray = finalrray.filter((item, i, ar) => ar.indexOf(item) === i);
         console.log("The below Final Array");
         this.autocompletearr = finalrray;
         console.log(finalrray);
      }
    }
    
  }

  applyFilter() {
    this.listData.filter = this.searchwords.trim().toLowerCase();
  }
  returncolumnvalue(val)
  {let arr = [];
    this.dashboardData.forEach(value =>{
      arr.push(value[val]);
    }); 
   // let unique = arr.filter((item, i, ar) => ar.indexOf(item) === i);
    return arr;
  }

  returnsortedvalue(val)
  {let arr = [];
    let res = this.dashboardData.filter(obj =>{ 
      let phasecode = (this.privilege_name == "OBF Initiator" || this.privilege_name == "OBF Reviewer")?"OBF":"PPL";
      if(obj.is_submitted == 1 && obj.phase_code == phasecode)
      {
        return obj;
      }
  });
    if(res != undefined || res != null)
    {
    res.forEach(value =>{
      arr.push(value[val]);
    }); 
  }
    let unique = arr.filter((item, i, ar) => ar.indexOf(item) === i);
    return unique;
  }

  cardsearcharray:any[] = [];
  searchtextchange(value)
  {
    this.cardsearcharray = [];
    let res = value.split(',');
    this.cardsearcharray = res;
    this.listData=new MatTableDataSource(this.dashboardData); 
    this.listData=new MatTableDataSource(this.filterdata); 
    for(let i=0;i< res.length;i++)
    {
      this.listData.filter = res[i].trim().toLowerCase();
      this.listData = new MatTableDataSource(this.listData.filteredData);
     // this.cardsearcharray = this.listData.filteredData;
    }
  }  

  getdatafromsearchandfiltereddata()
  {
    this.listData=new MatTableDataSource(this.filterdata); 
    for(let i=0;i< this.cardsearcharray.length;i++)
    {
      this.listData.filter = this.cardsearcharray[i].trim().toLowerCase();
      this.listData = new MatTableDataSource(this.listData.filteredData);
     this.filterdata = this.listData.filteredData;
    }

  }

  ngOnInit() {
    this.cardsearcharray = [];
    this.autocompletearr = [];
    this.dscdsbld = false;
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
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.autocompletearr.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  onSearchClear(){
    this.cardsearcharray = [];
    this.addColumn(this.selectedcolumn);
    this.searchControl.setValue("");
  }

  getcreateobfmasters()
  {
    this._obfservices.GetCreateOBFMasters(localStorage.getItem('UserCode')).subscribe(data =>{
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

  checkdisable(row)
  {
    if(row.ppl_init == 1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  editobf(row)
  {
    //alert("dsjhdjkshdjks");
    // this.router.navigate(['/DealHUB/dashboard/OBFSummary',Row.dh_id,Row.dh_header_id]);
    if(this.privilege_name=='OBF Initiator')
    {
      this.router.navigate(['/DealHUB/dashboard/Obf'],{ queryParams: { dh_id: row.dh_id,dh_header_id:row.dh_header_id,editobf:"Edit OBF" } });
    }
    else if(this.privilege_name=='PPL Initiator')
    {
      this.router.navigate(['/DealHUB/dashboard/Obf'],{ queryParams: { dh_id: row.dh_id,dh_header_id:row.dh_header_id,editobf:"Edit PPL",isppl:"Y" } });
    }
   
    console.log(row);
  }

  initiateppl(row)
  {
    console.log(row);
    this.router.navigate(['/DealHUB/dashboard/Obf'],{ queryParams: { dh_id: row.dh_id,dh_header_id:row.dh_header_id,editobf:"Initiate PPL",reinitiate:"Y",isppl:"Y",initiateppl:"Y" } });
  }

  reinitiateobf(row)
  {
    //alert("dsjhdjkshdjks");
    // this.router.navigate(['/DealHUB/dashboard/OBFSummary',Row.dh_id,Row.dh_header_id]);
    if(this.privilege_name == "OBF Initiator")
    {
    this.router.navigate(['/DealHUB/dashboard/Obf'],{ queryParams: { dh_id: row.dh_id,dh_header_id:row.dh_header_id,editobf:"Re-initiate OBF",reinitiate:"Y" } });
    }
    else if(this.privilege_name == "PPL Initiator")
    {
      this.router.navigate(['/DealHUB/dashboard/Obf'],{ queryParams: { dh_id: row.dh_id,dh_header_id:row.dh_header_id,editobf:"Re-initiate PPL",reinitiate:"Y",isppl:"Y" } });
    }
    console.log(row);
  }

  getsolutionmaster()
{
this._obfservices.getsolutionmaster(localStorage.getItem('UserCode')).subscribe(data =>{
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

datesUpdated(event)
{
  let datefilter:any = [];
  console.log(event);
  console.log(new Date(event.startDate._d));
console.log(new Date(event.endDate._d));
datefilter = this.filterdata.filter(o => new Date(o.Created_On) >= new Date(event.startDate._d) && new Date(o.Created_On) <= new Date(event.endDate._d));
this.listData=new MatTableDataSource(datefilter);

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
   // this.detailstickdisabled = this._obfservices.ObfCreateForm.invalid;
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
    //  this.detailstickdisabled = this._obfservices.ObfCreateForm.invalid;
      
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
    //this.detailstickdisabled = this._obfservices.ObfCreateForm.invalid;

  }

  onsubsectorchange(evt)
  {
    this._obfservices.obfmodel._SubSector_Id = evt.value;
   // this.detailstickdisabled = this._obfservices.ObfCreateForm.invalid;
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
    
    let index  = this._obfservices.obfmodel.sapio.findIndex(obj =>obj._Cust_SAP_IO_Number == parseInt(value.trim()));
    if(index > -1)
    {
      this._mesgBox.showError("SAP IO number already exists");
        return;
    }
    
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

openModal(templateRef,row) {
  console.log(row);
  this._obfservices.createform();
  this._obfservices.createnewobfmodelandeditobfmodel();
  let editobf:editobfarguement = new editobfarguement();
   editobf.dh_id = row.dh_id;
   editobf.dh_header_id = row.dh_header_id;
   editobf.user_code = localStorage.getItem("UserCode");
   this._obfservices.geteditobfdata(editobf).subscribe(res =>{
    let result =  JSON.parse(res);
    this._obfservices.editObfObject = JSON.parse(res);
    this._obfservices.initializeobfmodelandform();
    
    this.servicesControl.setValue(this._obfservices.servicesarray);
      this._obfservices.ObfCreateForm.patchValue({Otherservicesandcategories:this._obfservices.servicesarray});
      var resultnew = this.subsectorlist.filter(obj => {
        return obj.Sector_Id === this._obfservices.editObfObject._Sector_Id;
      });
      this.subsectorlisdisplay = resultnew;
      if(this._obfservices.obfmodel.Services != null)
      {
        this.serviceslist = this._obfservices.obfmodel.Services;
      }
      this.dscdsbld = true;
      if(this._obfservices.editObfObject._is_loi_po_uploaded == "N")
      {
       // this.loiopdisabled = true;
        this._obfservices.ObfCreateForm.get('Loiposheet').clearValidators();
      this._obfservices.ObfCreateForm.get('Loiposheet').updateValueAndValidity();
      }
      this._obfservices.ObfCreateForm.controls['otherservices'].disable();
      this._obfservices.ObfCreateForm.controls['othersolutions'].disable();
      this._obfservices.ObfCreateForm.controls['otherintegratedsolutions'].disable();
      this._obfservices.ObfCreateForm.controls["Sapcustomercode"].disable();
      console.log("checkmodel after model click");
      console.log(this._obfservices.ObfCreateForm);
   },
   error =>
   {
    this._mesgBox.showError(error.message);
   });
  let dialogRef = this.dialog.open(templateRef, {
      //  width: '880px',
       // data: { name: this.name, animal: this.animal }
       panelClass: 'custom-modalbox',
      backdropClass: 'popupBackdropClass',
  });

  dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
  });
}
dh_id:number=0;
dh_header_id:number=0;
getapprovalstatus(element)
{
  this.dh_id=element.dh_id;
  this.dh_header_id=element.dh_header_id;

  const dialogRef = this.dialog.open(this.callAPIDialog, {
    // width: '500px',
    // height:'600px',
    // disableClose: true,
   // data: { campaignId: this.params.id }
   panelClass: 'custom-modalbox',
      backdropClass: 'popupBackdropClass',
})
this._dashboardservice.GetDashboardProgress(this.dh_id.toString()).subscribe((Result)=>{
  var jsondata=JSON.parse(Result);
   this.approvalstatusdetail.versiondetail=jsondata.versiondetail;
   this.approvalstatusdetail.TimeLine=jsondata.versiondetail;
});
}

otherssave(event,type:string){
  //alert(event.target.value);
  let solid = "";
  let otherid ="";
  let value = "";
  if(type == "services"){
    solid = "1";
    otherid ="10";
   value =  this._obfservices.ObfCreateForm.get('otherservices').value;
  }
  else if(type == "solution")
  {
    solid = "2";
    otherid ="21";
    value =  this._obfservices.ObfCreateForm.get('othersolutions').value;
  }
  else if(type == "integratedsolution")
  {
    solid = "3";
    otherid ="29";
    value =  this._obfservices.ObfCreateForm.get('otherintegratedsolutions').value;
  }
    let res = this.serviceslist.filter(obj => {
      // return obj.viewValue === ws.E8.h;
      return obj.value === solid;
    });
   // if(this.isEditObf)
   if(true)
  {
    let index = this._obfservices.obfmodel.Services.findIndex(val => val.value == solid);
    if(index > -1)
    {
      let newindex = this._obfservices.obfmodel.Services[index].Serviceslist.findIndex(valnew => valnew.value == "0");
      if(newindex > -1)
      {
        this._obfservices.obfmodel.Services[index].Serviceslist[newindex].viewValue = event.target.value;
      }
      else{
        let elements:Serviceslist = new Serviceslist("0",value);
        res[0].Serviceslist.push(elements);    
      }
      
    }
  }
  else{
    let elements:Serviceslist = new Serviceslist("0",value);
    res[0].Serviceslist.push(elements);
  }
 // this.detailstickdisabled = this._obfservices.ObfCreateForm.invalid;
}

downloaddetailobf(element)
{
  // alert("download documnet");
  if(element.OBFFilepath== "")
  {
    this._mesgBox.showError("No OBF Sheet Documents to Download");
  }
  else
  {
    var url=environment.apiUrl + element.mainobf;
    window.open(url);
  }
}
downloaddetailFinalAgg(row)
{
  var dh_id=row.dh_id;
  var dh_header_id=row.dh_header_id;
  this.getattachment(dh_id,dh_header_id);
}
  getToolTipData(issueId: any): any {
    
    //  alert(JSON.stringify(issueId));
    return JSON.stringify(issueId);
   
}
  CallDashBoardService()
  {
    this._dashboardmodel._user_code=localStorage.getItem("UserCode");
    this._dashboardservice.GetDashBoardData(this._dashboardmodel).subscribe(Result=>{
    
      console.log("DashBoardData");
      console.log(Result);
      var loginresult =Result;
      this.dashboardData=JSON.parse(Result);
       this.BindGridDetails();
       this.statusfilter =  this.returnsortedvalue("currentstatus_search");
    },
    (error:HttpErrorResponse)=>{
    
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
    this.selectedcolumn = parseInt(selection);
    // alert(this.autocompletearr.length);
    this.picker.clear();
  if(this.privilege_name=="OBF Initiator" || this.privilege_name=="PPL Initiator")
    {
      if(selection==0)
      {
        //Draft Section.
        
        this.listData=new MatTableDataSource(this.dashboardData); 
        this.filterdata=this.dashboardData.filter(obj=>{
          if(obj.shortcurrentstatus=='draft' )
          {
            return obj;
          }
         // obj.shortcurrentstatus=='draft'
         } );
           if(this.cardsearcharray.length > 0)
           {
            this.getdatafromsearchandfiltereddata();
           }
          this.listData=new MatTableDataSource(this.filterdata);

        this.displayedColumns=this.DraftColumn;
        this.on_Highlight(1);
      }
      else if (selection==1)
      {
          //Submitted section
         
        this.listData=new MatTableDataSource(this.dashboardData); 
        this.filterdata=this.dashboardData.filter(obj=>{
          if(obj.shortcurrentstatus=='submitted' )
          {
            return obj;
          }}
        );
        if(this.cardsearcharray.length > 0)
           {
            this.getdatafromsearchandfiltereddata();
           }
          this.listData=new MatTableDataSource(this.filterdata);
        
          this.displayedColumns=this.SubmittedScreenColumn;
          this.on_Highlight(2);
      }
      else if(selection==2)
      {
        //Rejected
        this.listData=new MatTableDataSource(this.dashboardData); 
        this.filterdata=this.dashboardData.filter(obj=>{
          if(obj.shortcurrentstatus=='rejected' )
          {
            return obj;
          }}
        );
        if(this.cardsearcharray.length > 0)
           {
            this.getdatafromsearchandfiltereddata();
           }
        this.listData=new MatTableDataSource(this.filterdata);
        this.displayedColumns=this.RejectedScreenColumn;
        this.on_Highlight(3);
      }
      else if(selection==3 )
      {
        //Approved OBF
        this.listData=new MatTableDataSource(this.dashboardData); 
        this.filterdata=this.dashboardData.filter(
          obj=>{ //alert(obj.shortcurrentstatus);
             if(obj.phase_code=='OBF' && (obj.shortcurrentstatus=='approved' || obj.shortcurrentstatus=='cApproved'))
          {
            return obj;
          }
            });
            if(this.cardsearcharray.length > 0)
            {
             this.getdatafromsearchandfiltereddata();
            }
        this.listData=new MatTableDataSource(this.filterdata);
         this.displayedColumns=this.ApprovedOBf;
       
        this.on_Highlight(4);
      }
      else if(selection==4)
      {
       //approved PPl
        this.listData=new MatTableDataSource(this.dashboardData); 
        if(this.privilege_name=="PPL Initiator")
        {
          this.filterdata=this.dashboardData.filter(obj=>(obj.phase_code=='PPL' && obj.shortcurrentstatus=='approved'));
        }
        else
        {
          this.filterdata=this.dashboardData.filter(obj=>(obj.phase_code=='OBF' && obj.shortcurrentstatus=='approved'));
        }
        
        if(this.cardsearcharray.length > 0)
           {
            this.getdatafromsearchandfiltereddata();
           }
        this.listData=new MatTableDataSource(this.filterdata);

        
        this.displayedColumns=this.ApprovedPPL;
        this.on_Highlight(5);
      }
    }
    else if(this.privilege_name=="OBF Reviewer" || this.privilege_name=="PPL Reviewer")
    {
      if(selection==0)
      {
        this.filterdata=this.dashboardData.filter(obj=>
          {
            if(obj.shortcurrentstatus=='Submitted' )
            {
              return obj;
            }
          }
        );
        if(this.cardsearcharray.length > 0)
        {
         this.getdatafromsearchandfiltereddata();
        }
      this.listData=new MatTableDataSource(this.filterdata); 
      this.displayedColumns=this.PendingReviewercolumn;
      this.on_Highlight(1);
      }
      else if (selection==1)
      {
         //Approved section
         this.listData=new MatTableDataSource(this.dashboardData); 
         this.filterdata=this.dashboardData.filter(obj=>
          {
            if( obj.shortcurrentstatus=='approved' || obj.shortcurrentstatus=='cApproved' )
            {
              return obj;
            }
          }
         );
         
         if(this.cardsearcharray.length > 0)
           {
            this.getdatafromsearchandfiltereddata();
           }
         this.listData=new MatTableDataSource(this.filterdata);
         this.displayedColumns=this.ReviewerApproved;
         this.on_Highlight(2);
      }
      else if(selection==2)
      {
      
        this.listData=new MatTableDataSource(this.dashboardData); 
        this.filterdata=this.dashboardData.filter(obj=>
          {
            if( obj.shortcurrentstatus=='Rejected')
            {
              return obj;
            }
          }
        );
        if(this.cardsearcharray.length > 0)
        {
         this.getdatafromsearchandfiltereddata();
        }
        this.listData=new MatTableDataSource(this.filterdata);

        this.displayedColumns=this.ReviewerApproved;
        this.on_Highlight(3);
      }
      else if(selection==3)
      {
        this.listData=new MatTableDataSource(this.dashboardData); 
        this.filterdata=this.dashboardData.filter(obj=>
          {
            if(obj.shortcurrentstatus=='approved' || obj.shortcurrentstatus=='cApproved')
            {
              return obj;
            }
          }
         );
         if(this.cardsearcharray.length > 0)
         {
          this.getdatafromsearchandfiltereddata();
         }
        this.listData=new MatTableDataSource(this.filterdata);

        this.displayedColumns=this.ReviewerApproved;
        this.on_Highlight(4);
        
      }
      else if(selection==4)
      {
        this.listData=new MatTableDataSource(this.dashboardData); 
        this.filterdata=this.dashboardData.filter(obj=>
          {
            if(obj.shortcurrentstatus=='rejected')
            {
              return obj;
            }
          }
        );
        if(this.cardsearcharray.length > 0)
           {
            this.getdatafromsearchandfiltereddata();
           }
        this.listData=new MatTableDataSource(this.filterdata);
        this.displayedColumns=this.ReviewerApproved;
        this.on_Highlight(5);
      }
    }
   
  }
 

  GetDatabaseCount()
  {
    

    this._dashboardmodel._user_code=localStorage.getItem("UserCode");
    this._dashboardservice.GetDashboardCount(this._dashboardmodel).subscribe(Result=>{
    
      
      console.log(Result);
      var loginresult =Result;
      this._dashboardcountModel=JSON.parse(Result);
      
    },
    (error:HttpErrorResponse)=>{
    
      if (error.status==401)
      {
        this.router.navigateByUrl('/login');
        
      }
      
    }
    );
  }

 
  getOBFSummaryPage(Row)
  {
    console.log("check obf summary data");
    // this.obfsummary.dh_id = Row.dh_id;
    // this.obfsummary._user_id =parseInt(localStorage.getItem('UserName'));

    this.router.navigate(['/DealHUB/dashboard/OBFSummary',Row.dh_id,Row.dh_header_id,Row.shortcurrentstatus]);
   //  this.router.navigate(['/DealHUB/dashboard/OBFSummary'], { queryParams: { dh_id: Row.dh_id }, queryParamsHandling: 'preserve' });
  }
  on_Highlight(check){
    //    console.log(check);
        if(check==1){
          this.highlight = 'tab1';
        }else if(check==2){
          this.highlight = 'tab2';
        }else if(check==3){
          this.highlight = 'tab3';
        }else if(check==4){
          this.highlight = 'tab4';
        }else{
          this.highlight = 'tab5';
        }    
      
    }
    bytesToSize(bytes):number {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return 0;
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      if (i === 0) return bytes;
      return parseFloat((bytes / (1024 ** i)).toFixed(1));
    }
    onSelect(event) {
      try{
        var format = /[`!@#$%^&*+\=\[\]{};':"\\|,<>\/?~]/;   //removed () from validation 
        event.addedFiles.forEach(element => {
          // console.log("file size of "+element.name+" is "+ this.bytesToSize(element.size));
           if( Math.floor(this.bytesToSize(element.size)) == 0)
           {
             throw new Error("The file size of "+element.name+" is invalid" );
           }
     
           if(format.test(element.name))
           {
             throw new Error(element.name+" :name contains special characters,Kindly rename and upload again");
            }
           // if( this.bytesToSize(element.size) > 4)
           if( element.size > 4194304)
           {
             throw new Error("The file size of "+element.name+" is greater than 4 Mb, Kindly re-upload files with size less than 4 Mb" );
           }
     
         });
         this.uploadDocfiles.push(...event.addedFiles);
      }
      catch(e)
      {
        this._mesgBox.showError(e.message);
      }
    
    }

  
    progress: number = 0;
    path:string="";
    consolidatedpath:string="";
    SaveAttachmentParameter:SaveAttachmentParameter;
    Attachments:SaveAttachmentParameter[] = [];
    SaveAttachment()
    {
      //this.isloipo = !this.isloipo;
      this._obfservices.SaveAttachment(this.Attachments).subscribe(result=>
        {
            console.log(result);
            var REsult=JSON.parse(result);
            if(REsult[0].status ="Success")
            {
              this._mesgBox.showSucess("Attachment Uploaded Successfully.");
              this.uploadDocfiles=[];
              this.Attachments=[];

              this.dialog.closeAll();
  
            }
          
      });
    }
    uploadfiles(files:File[])
    {
    
      for (let i = 0; i < files.length; i++) {
       
        this.uploaddocprocess[i] = { value: 0, fileName: files[i].name };
        this.path="";
        this._dashboardservice.uploadImage(files[i]).subscribe(
          event => {
            if(event.type === HttpEventType.UploadProgress)
            {
              console.log('Upload Progress: '+Math.round(event.loaded/event.total * 100) +"%");
              this.progress = Math.round(event.loaded/event.total * 100);
              this.uploaddocprocess[i].value = Math.round(event.loaded/event.total * 100);
            }
            else if(event.type === HttpEventType.Response)
            {
              this.path = JSON.stringify(event.body);
              this.path=this.path.split('"').join('');
              this.path = this.path.substring(0,this.path.length -1);
              this.consolidatedpath += this.path +",";
              this.consolidatedpath = this.consolidatedpath.substring(0,this.consolidatedpath.length -1);
              this.SaveAttachmentParameter = new SaveAttachmentParameter();
              if(this.path!="")
              {
                this.SaveAttachmentParameter._dh_id=this.dh_id;
                this.SaveAttachmentParameter._dh_header_id=this.dh_header_id;
                 this.SaveAttachmentParameter._fname= files[i].name; 
                 this.SaveAttachmentParameter._fpath = this.path;
                 this.SaveAttachmentParameter._description = "FinalAgg";
                 this.Attachments.push(this.SaveAttachmentParameter);
              }
            }
            this.SaveAttachment();
          },
          
          (err:any)=>{
           
             this.uploaddocprocess[i].value = 0;
         
           
      }
        )
    }
}
  closedialog()
  {
   this.uploadDocfiles=[];
   this.dialog.closeAll();
  }

  
  OBfcilck(selection)
  {
    if(selection==0)
    {
      //Draft Section.
      this.listData=new MatTableDataSource();
      //this.listData=new MatTableDataSource(this.dashboardData); 
       this.filterdata=this.dashboardData.filter(obj=>obj.shortcurrentstatus=='draft' && obj.phase_code=='PPL');
      this.listData=new MatTableDataSource(this.filterdata);


      this.displayedColumns=this.DraftColumn;
      this.on_Highlight(1);
    }
  }
PPLclick(selection)
{

}

editSubmit()
{
  //return false;
  this._obfservices.obfmodel._active = "A";
  this._obfservices.obfmodel._status ="A";
  this._obfservices.obfmodel._is_saved =1;
  this._obfservices.obfmodel._is_submitted = 0;
  this._obfservices.obfmodel._created_by =  localStorage.getItem('UserCode');
  this._obfservices.obfmodel._mode = "edit";
  this._obfservices.obfmodel._service_category = "";
  this._obfservices.obfmodel.save_with_solution_sector = "Y";
        this._obfservices.obfsumbitmodel._dh_id = this._obfservices.obfmodel._dh_id;
      this._obfservices.obfsumbitmodel._dh_header_id = this._obfservices.obfmodel._dh_header_id;
      this._obfservices.obfsumbitmodel._fname = this._obfservices.obfmodel._fname;
      this._obfservices.obfsumbitmodel._fpath = this._obfservices.obfmodel._fpath;
      this._obfservices.obfsumbitmodel._created_by = this._obfservices.obfmodel._created_by;
      this._obfservices.obfsumbitmodel._active = this._obfservices.obfmodel._active;
      this._obfservices.obfsumbitmodel._is_submitted = this._obfservices.obfmodel._is_submitted;

      this._obfservices.obfmodel._SubmitOBFParameters.push(this._obfservices.obfsumbitmodel);

      let val =  this.validateform();
      if(val)
    {
      this._obfservices.editsapcustcode_and_io(this._obfservices.obfmodel).subscribe(data =>{
        console.log("data arrived after insert");
        let res = JSON.parse(data);
        console.log(res);
        if(res[0].Result.toString().toLowerCase() == "success"){
        this._obfservices.obfmodel._dh_header_id = res[0].dh_header_id;
        this._obfservices.obfmodel._dh_id = res[0].dh_id;
        // alert("Documents uploaded Successfully");
        this._mesgBox.showSucess("Documents uploaded Successfully");
        this.router.navigate(['/DealHUB/dashboard']);
      }
      else{
        //alert("Technical error while uploading documents");
        this._mesgBox.showError("Technical error while uploading documents");
      }
      },
      (error:HttpErrorResponse)=>{
        this._mesgBox.showError(error.message);
        //alert(error.message);
      })
    }

  
}
validateform()
{
  let count:number = 0;
  let message = "";
  if(this._obfservices.ObfCreateForm.get('Projectname').errors)
  {
    //alert("Project name is required");
    // this._mesgBox.showError("Project name is required");
    message += "Project name"+",";
    count +=1;
  }
  if(this._obfservices.ObfCreateForm.get('Customername').errors)
  {
   // alert("Customer name is required");
    // this._mesgBox.showError("Customer name is required");
    // return false;
    message += "Customer name"+",";
    count +=1;
  }
  // else if(this._obfservices.ObfCreateForm.get('Solutioncategory').errors)
  // {
  //   alert("Solution category is required");
  //   return false;
  // }
  // else if(this._obfservices.ObfCreateForm.get('Otherservicesandcategories').errors)
  // {
  //   alert("Other Services and Solutions field is required");
  //   return false;
  // }
  if(this._obfservices.ObfCreateForm.get('Opportunityid').errors)
  {
   // alert("Opportunityid is required");
    // this._mesgBox.showError("Opportunity Id is required");
    // return false;
    message += "Opportunity Id"+",";
    count +=1;
  }
  if(this._obfservices.ObfCreateForm.get('State').errors)
  {
    //alert("Project primay location is required");
    // this._mesgBox.showError("Project primay location is required");
    // return false;
    message += "Project primay location"+",";
    count +=1;
  }
  if(this._obfservices.ObfCreateForm.get('Vertical').errors)
  {
   // alert("Vertical field is required");
  //  this._mesgBox.showError("Vertical field is required");
  //   return false;
  message += "Vertical field"+",";
    count +=1;
  }
  // else if(this._obfservices.ObfCreateForm.get('Sector').errors)
  // {
  //   alert("Sector field is required");
  //   return false;
  // }
  if(this._obfservices.ObfCreateForm.get('Verticalhead').errors)
  {
   // alert("Vertical head field is required");
    // this._mesgBox.showError("Vertical head field is required");
    // return false;
    message += "Vertical head field"+",";
    count +=1;
  }
  if(this._obfservices.ObfCreateForm.get('Projectbrief').errors)
  {
   // alert("Project brief is required");
  //  this._mesgBox.showError("Project brief is required");
  //   return false;
    message += "Project brief"+",";
    count +=1;
  }
  if(this._obfservices.ObfCreateForm.get('Totalrevenue').errors)
  {
    //alert("Total revenue field is required");
    // this._mesgBox.showError("Total revenue field is required");
    // return false;
    message += "Total revenue"+",";
    count +=1;
  }
  if(this._obfservices.ObfCreateForm.get('Totalcost').errors)
  {
   // alert("Total cost field is required");
    //  this._mesgBox.showError("Total cost field is required");
    // return false;
    message += "Total cost field"+",";
    count +=1;
  }
  if(this._obfservices.ObfCreateForm.get('Totalmargin').errors)
  {
    // alert("Total margin field is required");
    // this._mesgBox.showError("Total margin field is required");
    // return false;
    message += "Total margin"+",";
    count +=1;
  }
  if(this._obfservices.ObfCreateForm.get('Totalprojectlife').errors)
  {
   // alert("Total project life field is required");
  //  this._mesgBox.showError("Total project life field is required");
  //   return false;
  message += "Total project life"+",";
    count +=1;
  }
  if(this._obfservices.ObfCreateForm.get('Capex').errors)
  {
    //alert("Capex field is required");
    // this._mesgBox.showError("Capex field is required");
    // return false;
    message += "Capex"+",";
    count +=1;
  }
  if(this._obfservices.ObfCreateForm.get('Paymentterms').errors)
  {
   // alert("Payment terms field is required");
  //  this._mesgBox.showError("Payment terms field is required");
  //   return false;
  message += "Payment terms"+",";
    count +=1;
  }
  if(this._obfservices.ObfCreateForm.get('Payment_Terms_description').errors)
  {
   // alert("Payment terms field is required");
  //  this._mesgBox.showError("Payment terms description field is required");
  //   return false;
  message += "Payment terms description"+",";
    count +=1;
  }
  if(this._obfservices.ObfCreateForm.get('Assumptionrisks').errors)
  {
   // alert("Assumption and risks  field is required");
  //  this._mesgBox.showError("Assumption and risks  field is required");
  //   return false;
  message += "Assumption and risks"+",";
    count +=1;
  }
  if(this._obfservices.ObfCreateForm.get('Loipo').errors)
  {
   // alert("Loi / po  field is required");
    // this._mesgBox.showError("LOI/PO  field is required");
    // return false;
    message += "LOI/PO"+",";
    count +=1;
  }

  if( count > 0)
  {
    message = message.substring(0,message.length -1);
    this._mesgBox.showError(message + " are required");
    return false;
  }
  return true;
}
getattachment(dh_id,dh_header_id)
{
 
  this._dashboardservice.GetAttachmentDocument(dh_id,dh_header_id).subscribe(data=>{
    console.log(data);
    var jsonresult=JSON.parse(data);
    if(jsonresult.Table == undefined)
    {
      if(jsonresult.AttachmentDetails.length !=0)
      {
        let index=jsonresult.AttachmentDetails.findIndex(obj=> obj.description=="FinalAgg");
        if(index > -1)
        {
          for(let i=0;i< jsonresult.AttachmentDetails.length;i++)
          {
            if(jsonresult.AttachmentDetails[i].description=="FinalAgg")
            {
                let url="";
                url = environment.apiUrl+jsonresult.AttachmentDetails[i].filepath;
  
                window.open(url);
            }
          }
        }
        else{
          this._mesgBox.showError("No Final Aggrement Documents to Download");
        }
       
      }
      else
      {
        this._mesgBox.showError("No Final Aggrement Documents to Download");
      }
    }
    else if (jsonresult.AttachmentDetails == undefined)
    {
      this._mesgBox.showError("No Final Aggrement Documents to Download");
    }
    
    
  })
}
}
