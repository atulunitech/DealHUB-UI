import { TemplateRef, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatTableModule ,MatTableDataSource} from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DashboardService } from '../dashboard.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import {Router} from "@angular/router"
import {FormBuilder,FormGroup, FormControl, Validators, FormGroupDirective, NgForm,FormArray} from '@angular/forms';
import * as moment from 'moment';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { editobfarguement, OBFServices, SAPIO } from '../services/obfservices.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { MyErrorStateMatcher, SaveServiceParameter, sectors, Solutiongroup, Solutionservices, subsectors } from '../creatobf/creatobf.component';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';

import { MessageBoxComponent } from 'src/app/shared/MessageBox/MessageBox.Component';
import { environment } from 'src/environments/environment.prod';
import { CommonService } from 'src/app/services/common.service';
import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map';
import { element } from 'protractor';
import { TypeScriptEmitter } from '@angular/compiler';
import { LoginModel } from 'src/app/auth/ResetPassword/ResetPassword.component';
import { loginservices } from 'src/app/auth/login/LoginServices';
import { DatePipe } from '@angular/common';
import {MatMenuTrigger} from '@angular/material/menu';
//region Model
export class DashBoardModel
{
  _user_code:string;
}

class count
{
  draftscount:number;
  draftsobfcount:number;
  draftpplcount:number;
  submittedcount:number;
  submittedobfcount:number;
  submittedpplcount:number;
  rejectedcount:number;
  rejectedobfcount:number;
  rejectedpplcount:number;
  approvedobfcount:number;
  approvedpplcount:number;

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
  is_latest_version:number;
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
class Approvaldetail
{
  role_name:string;
  is_stage_completed:number;
  tablename:string;
}
 
class approvalstatusdetail
{
  versiondetail:versiondetail[];
  TimeLine:TimeLine[];
  Approvaldetail:Approvaldetail[];
}
export class searchfilter{
  value:string;
  viewValue:string;
}
export class ResetErrorStateMatcher implements ErrorStateMatcher {
  // isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
  //   const invalidCtrl = !!(control?.invalid && control.touched && control?.parent?.dirty);
  //   const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);

  //   return invalidCtrl || invalidParent;
  // }
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return (control && control.parent.get('NewPassword').value !== control.parent.get('confirmpassword').value && control.dirty)
  }
}

export class SapIoErrorStateMatcher implements ErrorStateMatcher {
  // isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
  //   const invalidCtrl = !!(control?.invalid && control.touched && control?.parent?.dirty);
  //   const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);

  //   return invalidCtrl || invalidParent;
  // }
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    let alpha = (control && control.parent.get('Sapio').value != 8 && control.touched);
    return (control && control.parent.get('Sapio').value != 8 && control.touched);
  }
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
  hide = true;
  hide1 = true;
  hide2 = true;
  countparam:count = null;
  loginmodel:LoginModel=new LoginModel();
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  matcher = new MyErrorStateMatcher();
  matcherreset = new ResetErrorStateMatcher();
  matcherSapio = new SapIoErrorStateMatcher();
  Solutiongroup: Solutiongroup[] =[];
  dscdsbld:boolean = false;
  startdate:any;
  enddate:any;
  dateselected:boolean=false;
  approvalstatusdetail:approvalstatusdetail=new approvalstatusdetail();
  @ViewChild(DaterangepickerDirective, {static: true,}) picker: DaterangepickerDirective;direction: 'ltr';
  selected: {startDate: moment.Moment, endDate: moment.Moment};
  openDatepicker() {
    this.picker.open();
  }
  searchwords: string="";
  searchfiltercontrol = new FormControl();
  statusfiltercontrol = new FormControl();
  searchfilterarr: searchfilter[] = [{viewValue:'Opportunity ID',value:'Opp_Id'},{viewValue:'Project Name',value:'Project_Name'},{viewValue:'Customer Name',value:'customer_name'},{viewValue:'Location',value:'dh_location'},{viewValue:'Vertical',value:'Vertical_name'},{viewValue:'SAP Customer Code',value:'sap_customer_code'},{viewValue:'Sector',value:'sector_name'},{viewValue:'Sub Sector',value:'subsector_name'},{viewValue:'Solution Category',value:'solutioncategory_name'}];
  
  // POC data start
  testData: any[] = []
  nonFilteredSearchData: any = []
  filteredSearchData: any = []
  filtersToSearch: any = []
  filtersTodisplay: any = []
  searchInput = ''
  public searchKeysonfilter = [];
  public searchKeys = [
    {key: 'Project_Name', displayName: 'Project Name'}, 
    {key: 'Opp_Id', displayName: 'Oppurtunity Id'}, 
    {key: 'customer_name', displayName: 'Customer Name'}, 
    {key: 'Project_Type', displayName: 'Project Type'}, 
    {key: 'Vertical_Name', displayName: 'Vertical Name'}, 
    {key: 'dh_location', displayName: 'Location'},
    {key: 'sap_customer_code', displayName: 'SAP Customer Code'},
    {key: 'sector_name', displayName: 'Sector Name'},
    {key: 'subsector_name', displayName: 'Sub Sector Name'},
  {key: 'solutioncategory_name', displayName: 'Solution Category Name'}]
  private customizedKeySet = ['key', 'value']
  tableFilteredData: any[] = []
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  // POC data ends

   DraftColumn: string[] = ['Project_Name', 'Code', 'Opp_Id', 'Project_Type','Vertical_Name','Total_Cost','Total_Revenue','Gross_Margin','ActionDraft'];
   SubmittedScreenColumn: string[] = ['ApprovalStatus', 'Current_Status','Project_Name', 'Code', 'Opp_Id','Project_Type','Vertical_Name', 'Total_Cost','Total_Revenue','Gross_Margin','ActionSubmitted'];
   PendingReviewercolumn: string[] = ['ApprovalStatus', 'Current_Status','Project_Name', 'Code', 'Opp_Id','Project_Type','Vertical_Name', 'Total_Cost','Total_Revenue','Gross_Margin','ActionPendingforapproval'];
   RejectedScreenColumn: string[] = ['ApprovalStatus', 'Current_Status','Project_Name', 'Code', 'Opp_Id','Project_Type','Vertical_Name', 'Total_Cost','Total_Revenue','Gross_Margin','ActionReinitialize'];
   ApprovedOBf: string[] = ['ApprovalStatus','Current_Status','Project_Name', 'Code', 'Opp_Id','Project_Type', 'Vertical_Name','Total_Cost','Total_Revenue','Gross_Margin','ActionApprovedOBF'];
   ApprovedPPL: string[] = ['ApprovalStatus','Current_Status','Project_Name', 'Code', 'Opp_Id', 'Project_Type','Vertical_Name','Total_Cost','Total_Revenue','Gross_Margin','ActionApprovedPPL'];
   ReviewerApproved:string[]=['ApprovalStatus','Current_Status','Project_Name', 'Code', 'Opp_Id','Project_Type','Vertical_Name','Total_Cost','Total_Revenue','Gross_Margin','ActionView'];
  //  'DetailedOBF','FinalAgg',

   
   
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
  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('chipList') SAPIOchiplist: MatChipList;
  @ViewChild('chipList1') chipList1: MatChipList;
  public myForm1: FormGroup;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  data = {
    names: ['11222212','22332233']
  };
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
  @ViewChild('resetDialog') resetDialog: TemplateRef<any>;
  uploadDocfiles:File[]=[];
  uploaddocprocess:any[]=[];
  key:string = "";
 // currentversion=false;
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
  public loginvalid: FormGroup;
  constructor(private _dashboardservice:DashboardService,private fb: FormBuilder,private router: Router,public _obfservices:OBFServices,public dialog: MatDialog,private _mesgBox: MessageBoxComponent,public commonService:CommonService,private _loginservice:loginservices,private datepipe: DatePipe) { 
    this._obfservices.createform();
    this._obfservices.createnewobfmodelandeditobfmodel();
    this.myForm1 = this.fb.group({
      names: this.fb.array(this.data.names, this.validateArrayNotEmpty)
    });
  }
   keys:any[] = [];
   autocompletearr:any[] = [];
   searchControl = new FormControl();
   filteredOptions: Observable<string[]>;

   @ViewChild(MatSort) sort: MatSort;
 
   @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
      this.paginator = mp;
     
      }
  
   statusfiltervalue:any = "";
   statusfilterselected:boolean=false;
   statusfiltermethod(evt)
   {
    if(evt.isUserInput){
    // alert(evt.target.value);
    this.statusfiltervalue = evt.source.value;
    this.statusfilterselected = true;
    let datefilter:any = [];
    this.getcountonstatusfilter(evt.source.value);
  datefilter = this.filterdata.filter(o => o.currentstatus_search == evt.source.value);
  this.listData=new MatTableDataSource(datefilter);
  this.listData.sort = this.sort;
 this.listData.paginator = this.paginator;
 this.addColumn(this.selectedcolumn);
    }
   }

   statusfilterfromcardselect()
   {
     this.getcountonstatusfilter(this.statusfiltervalue);
    this.filterdata = this.filterdata.filter(o => o.currentstatus_search == this.statusfiltervalue);
   }

   getcountonstatusfilter(val)
   {
    let alpha:any = [];
    if(this.dateselected)
    {
      alpha = this.dashboardData.filter(o => new Date(o.Created_On) >= new Date(this.startdate) && new Date(o.Created_On) <= new Date(this.enddate));
    }
    else
    {
      alpha =  this.dashboardData;
    }
    alpha = alpha.filter(o => o.currentstatus_search == val);
    this.getcounts(alpha);
   }
   
   bindfilterobject:any[]=[];
   bindfilterobjectoninit()
   {
     let keyarray = ["Opp_Id","Project_Name","customer_name","dh_location","Vertical_name","sap_customer_code","sector_name","subsector_name","solutioncategory_name"];
     keyarray.forEach(val =>{
      let res = this.returncolumnvalue(val.toString()); 
      res = res.filter((item, i, ar) => ar.indexOf(item) === i);
      res.forEach(valnew =>{
        let obj = {key:val,value:valnew};
        this.bindfilterobject.push(obj);
      });
     });
     //this.bindfilterobject = this.bindfilterobject.filter((item, i, ar) => ar.indexOf(item) === i);
     console.log("get filtered object");
     console.log(this.bindfilterobject);
   }
  // selectfilter(evt)
  // {
  //   //this.keys = [];
  //   let finalrray:any[] = [];
  //   if(evt.isUserInput)
  //   {
  //     if(evt.source.selected)
  //     {
  //       this.keys.push(evt.source.value);
  //       this.keys[evt.source.value] = new Array;
        
  //       let res = this.returncolumnvalue(evt.source.value.toString());
  //       this.keys[evt.source.value].push(res);
  //        //console.log(res);
  //       // console.log( keys[evt.source.value]);
        
  //        for(let i = 0;i< this.keys.length;i++)
  //        {
  //         let newarr =  this.keys[i];
  //         console.log(this.keys[newarr]);
  //         let newres = this.keys[newarr];
  //         if(i == 0)
  //         {
  //         finalrray = newres[0].slice();
  //         //break;
  //        }
  //        else
  //        {
  //          let viewres = newres[0].slice();
  //         for(let j = 0;j < viewres.length;j++)
  //         {
  //           finalrray[j] = finalrray[j]+","+viewres[j];
  //         }
  //       }
  //        //  console.log();
  //       //  if(this.keys.length > 2 && i == (this.keys.length -1))
  //       //  {
  //       //   let newarr =  this.keys[0];
  //       //   console.log(this.keys[newarr]);
  //       //   let newres = this.keys[newarr];
  //       //   finalrray = newres;
  //       //  }
  //        }
  //        finalrray = finalrray.filter((item, i, ar) => ar.indexOf(item) === i);
  //        console.log("The below Final Array");
  //        console.log(this.keys);
  //        this.autocompletearr = finalrray;
  //        console.log(finalrray);
  //     }
  //     else
  //     {
  //       let index = this.keys.findIndex(res=> res == evt.source.value);
  //       if (index >-1) {
  //         this.keys.splice(index, 1);
          
  //       }
  //       for(let i = 0;i< this.keys.length;i++)
  //        {
  //         let newarr =  this.keys[i];
  //         console.log(this.keys[newarr]);
  //         let newres = this.keys[newarr];
  //         if(i == 0)
  //         {
  //         finalrray = newres[0];
  //         //break;
  //        }
  //        else
  //        {
  //          let viewres = newres[0];
  //         for(let j = 0;j < viewres.length;j++)
  //         {
  //           finalrray[j] = finalrray[j]+","+viewres[j];
  //         }
  //       }
  //        //  console.log();
  //        }
  //        finalrray = finalrray.filter((item, i, ar) => ar.indexOf(item) === i);
  //        console.log("The below Final Array");
  //        this.autocompletearr = finalrray;
  //        console.log(finalrray);
  //     }
  //   }
    
  // }

  selectfilter(evt)
  {
    //this.keys = [];
   // let finalrray:any[] = [];
    if(evt.isUserInput)
    {
     // this.filteredSearchData = [];
     this.searchControl.setValue("");
      if(evt.source.selected)
      {
        this.searchKeysonfilter.push(evt.source.value);
        this.getautocompletedataforsearchimp();
      }
      else
      {
        let index = this.searchKeysonfilter.findIndex(res=> res == evt.source.value);
        if (index >-1) {
          this.searchKeysonfilter.splice(index, 1);
        }
        this.getautocompletedataforsearchimp();
        if(this.searchKeysonfilter.length == 0)
        {
          this.getnonfilteredsearchdataimp(this.dashboardData);
        }
      }
    }
    
  }

  getautocompletedataforsearchimp()
  {
  let sampleData: any[] = []
        for(let data of this.testData){
          for(let searchKey of this.searchKeysonfilter){
           //this.nonFilteredData.push({[searchKey]: data[searchKey]})
           if(data[searchKey.key])
           sampleData.push({key: searchKey.key, value: data[searchKey.key], displayName: searchKey.displayName})
          }   
        }
      
        this.nonFilteredSearchData = sampleData.filter(
          (s => (o: any) => 
            (k => !s.has(k) && s.add(k))
            (this.customizedKeySet.map(k => o[k]).join('|')))
            (new Set)
        )
        //this.nonFilteredSearchData.filter((data: any) => data.value !== null || data.value !== "");
        this.nonFilteredSearchData.sort((a: any, b: any) => {
          return a.key > b.key ? 1 : -1
        });
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
      //let phasecode = (this.privilege_name == "OBF Initiator" || this.privilege_name == "OBF Reviewer")?"OBF":"PPL";
      // if(obj.is_submitted == 1 && obj.phase_code == phasecode)
      if(obj.is_submitted == 1)
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
  //filtercheckboxbool:boolean=false;
  cardsearcharray:any[] = [];
  searchtextchange(value)
  {
    this.cardsearcharray = [];
    let res = value.split(',');
    this.cardsearcharray = res;
    this.listData=new MatTableDataSource(this.dashboardData); 
    this.listData=new MatTableDataSource(this.filterdata); 
   // this.searchControl.setValue("Hello wolrd");
    for(let i=0;i< res.length;i++)
    {
      this.listData.filter = res[i].trim().toLowerCase();
      this.listData = new MatTableDataSource(this.listData.filteredData);
     // this.cardsearcharray = this.listData.filteredData;
    }
  }  

  
   multisearcharray:any[]=[];
  // texttoshow:any[]=[];
  toggleSelection(event,option)
  {
    if(event.checked)
    {
      this.multisearcharray.push(option)
    }
    else
    {
      let index = this.multisearcharray.findIndex(obj => obj == option);
      if(index > -1)
      {
        this.multisearcharray.splice(index,1);
      }
    }
   
    //   this.multisearcharray.forEach(element=>{
    //      let res = element.split(',');
    //      res.forEach(element => {
    //        this.texttoshow.push(element);
    //      });
    //   });
    //   let texttoshow="";
    //   this.texttoshow = this.texttoshow.filter((item, i, ar) => ar.indexOf(item) === i);
    //   this.texttoshow.forEach(x =>{
    //    texttoshow += x +",";
    //   });
    //   texttoshow =texttoshow.substring(0,texttoshow.length - 1);
    // this.searchControl.setValue(texttoshow);
    
  }

  
  filterdatafinal()
  {
    this.getcountonfilter();
    let showdatatotextbox:any[]=[];
  let  checkdataarray:any[] = [];
    this.multisearcharray.forEach(val=>{
      let res = val.split(',');
      this.cardsearcharray = res;
      this.listData=new MatTableDataSource(this.dashboardData); 
      this.listData=new MatTableDataSource(this.filterdata); 
      //this.searchControl.setValue("Hello wolrd");
      for(let i=0;i< res.length;i++)
      {
        showdatatotextbox.push(res[i].trim());
        this.listData.filter = res[i].trim().toLowerCase();
        this.listData = new MatTableDataSource(this.listData.filteredData);
       //this.cardsearcharray = this.listData.filteredData;
       if(i == res.length - 1 && this.listData.filteredData.length > 0)
       {
       checkdataarray.push(this.listData.filteredData);
      }
      } 
    });
    let texttoshow="";
    showdatatotextbox = showdatatotextbox.filter((item, i, ar) => ar.indexOf(item) === i);
    showdatatotextbox.forEach(x =>{
     texttoshow += x +",";
    });
    texttoshow =texttoshow.substring(0,texttoshow.length - 1);
    this.searchControl.setValue(texttoshow);
    console.log("check data of both");
    //console.log(this.checkdataarray);
    let finallistdataarray:any[] = [];
    if(checkdataarray.length > 0)
    {
      checkdataarray.forEach(newarr =>{
            newarr.forEach(element => {
                 let index = finallistdataarray.findIndex(obj => obj.dh_id == element.dh_id);
                 if(index > -1)
                 {}
                 else
                 {
                   finallistdataarray.push(element);
                 }
            });

      });
    }
    console.log(finallistdataarray);
    this.listData=new MatTableDataSource(finallistdataarray); 
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.filterdata = this.listData.filteredData;
   // this.getcounts(finallistdataarray);
  }

  //  getcountonfilter()
  //  {
  //   let showdatatotextbox:any[]=[];
  //   let  checkdataarray:any[] = [];
  //     this.multisearcharray.forEach(val=>{
  //       let res = val.split(',');
  //       this.cardsearcharray = res;
  //       this.listData=new MatTableDataSource(this.dashboardData); 
  //      // this.listData=new MatTableDataSource(this.filterdata); 
  //       //this.searchControl.setValue("Hello wolrd");
  //       for(let i=0;i< res.length;i++)
  //       {
  //         showdatatotextbox.push(res[i].trim());
  //         this.listData.filter = res[i].trim().toLowerCase();
  //         this.listData = new MatTableDataSource(this.listData.filteredData);
  //        //this.cardsearcharray = this.listData.filteredData;
  //        if(i == res.length - 1 && this.listData.filteredData.length > 0)
  //        {
  //        checkdataarray.push(this.listData.filteredData);
  //       }
  //       } 
  //     });
  //     // let texttoshow="";
  //     // showdatatotextbox = showdatatotextbox.filter((item, i, ar) => ar.indexOf(item) === i);
  //     // showdatatotextbox.forEach(x =>{
  //     //  texttoshow += x +",";
  //     // });
  //     // texttoshow =texttoshow.substring(0,texttoshow.length - 1);
  //     // this.searchControl.setValue(texttoshow);
  //     // console.log("check data of both");
  //     //console.log(this.checkdataarray);
  //     let finallistdataarray:any[] = [];
  //     if(checkdataarray.length > 0)
  //     {
  //       checkdataarray.forEach(newarr =>{
  //             newarr.forEach(element => {
  //                  let index = finallistdataarray.findIndex(obj => obj.dh_id == element.dh_id);
  //                  if(index > -1)
  //                  {}
  //                  else
  //                  {
  //                    finallistdataarray.push(element);
  //                  }
  //             });
  
  //       });
  //     }
  //     console.log(finallistdataarray);
  //     this.getcounts(finallistdataarray);
  //  }

  getcountonfilter()
   {
    this.tableFilteredData = []
    const counts: any = {};
    this.filtersToSearch.forEach((x: any) => {
       counts[x.key] = (counts[x.key] || 0) + 1; 
    });
    //console.log(counts)
    //Getting count of duplicates with keys o/p: {dh_location: 2, opp_id: 1}
     let countdatafilter:any[] = [];
if(this.dateselected)
{
  countdatafilter = this.dashboardData.filter(o => new Date(o.Created_On) >= new Date(this.startdate) && new Date(o.Created_On) <= new Date(this.enddate));
}
else
{
  countdatafilter = this.dashboardData; 
}

if(this.statusfilterselected)
{
  countdatafilter = this.dashboardData.filter(o => o.currentstatus_search == this.statusfiltervalue);
}
else
{
  countdatafilter = this.dashboardData; 
}
    for(let data of countdatafilter){
      
      //Creating same structure as counts but with 0 as default count value for keys
      let checkData: any = {}
      for(let datacount in counts){
        checkData = {...checkData, [datacount]: 0}
      }
    
      for(let searchFilter of this.filtersToSearch){
        if(data[searchFilter.key] === 'sap_customer_code' ? data[searchFilter.key].includes(searchFilter.value) : data[searchFilter.key] === searchFilter.value){
          //Incrementing checkdata value of specific key by 1
          checkData = {...checkData, [searchFilter.key]: checkData[searchFilter.key] + 1}
        }
      }

      //checking if atleast min 1 criteria is met
      let checkIfAllCriteriasMet = true
      for(let item in checkData){
        if(checkData[item] < 1){
          checkIfAllCriteriasMet = false
          break
        }
      }

      if(checkIfAllCriteriasMet){
        if(!this.tableFilteredData.some(item => item.dh_id === data.dh_id))
          this.tableFilteredData.push(data);
         
      }
    }
    this.getcounts(this.tableFilteredData);
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
    this.myForm1
    .get('names')
    .statusChanges.subscribe(
      status => (this.chipList1.errorState = status === 'INVALID')
    );
    this.dateselected = false;
    this.bindfilterobject = [];
    this.startdate= null;
    this.enddate=null;
    this.cardsearcharray = [];
    this.autocompletearr = [];
    this.dscdsbld = false;
    // Get list of columns by gathering unique keys of objects found in DATA.
    this.Dashboardvalid = new FormGroup({
     
    });
  
    if(localStorage.getItem("privilege_name")!= null)
    {
      this.privilege_name=localStorage.getItem("privilege_name");

    }
    this.CallDashBoardService();
    //this.GetDatabaseCount();
    this.getcreateobfmasters();
    this.getsolutionmaster();
    this.filteredSearchData = this.searchControl.valueChanges.pipe(
      startWith(""),
      map(value => value != null && value.length >= 1?this._filter(value):[])
      // map(value => value?this._filter(value): this.nonFilteredSearchData.slice())
    );
    this.commonService.getresetclickedevent().subscribe(res =>{
      //alert(res);
      if(res == true)
      this.ResetModel();

    });
    this.loginvalid = new FormGroup({
     
      CurrentPassword : new FormControl('', [Validators.required,this.commonService.NoInvalidCharacters]),
      NewPassword : new FormControl('', [Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}'),this.commonService.NoInvalidCharacters]),
      confirmpassword : new FormControl('')
    }, { validators: this.checkPasswords });

 
  }
  
  getClientKey()
      {
    this._loginservice.getClientKey().subscribe(result =>{
     // let res = JSON.parse(result);
     console.log(result);
      let Rkey = atob(result.Secretkey);
      Rkey = Rkey.substring(0,Rkey.length - 4);
      this.key = Rkey;
      this.loginmodel._ClientId = result.ClientID;
     // alert(this.key);
    },
      (error:HttpErrorResponse)=>{
        this._mesgBox.showError(error.message);
      });
     }
  public checkError = (controlName: string, errorName: string) => {
    return this.loginvalid.controls[controlName].hasError(errorName);
  }
  ResetPassword()
  {
    let encryptedpwd="";
    let encryptedcurrentpwd="";
         //alert(this.key);
          encryptedpwd = this.commonService.setEncryption(this.key,this.loginvalid.get('NewPassword').value);
          encryptedcurrentpwd = this.commonService.setEncryption(this.key,this.loginvalid.get('CurrentPassword').value);
          this.loginvalid.get('NewPassword').setValue(encryptedpwd);
          this.loginvalid.get('confirmpassword').setValue(encryptedpwd);
          //this.loginmodel._SecretKey = this.key;
    this.loginmodel._user_code=localStorage.getItem("UserCode");
    this.loginmodel._password=this.loginvalid.get('confirmpassword').value;
    this.loginmodel._CurrentPassword = encryptedcurrentpwd;
    
     
    this._loginservice.ResetPasswordDashboard(this.loginmodel).subscribe(Result=>{
     // alert("Password Changed Successfully.");
     this._mesgBox.showSucess("Password Changed Successfully.");
     this.router.navigateByUrl('/login');
     
    });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('NewPassword').value;
    const confirmPassword = group.get('confirmpassword').value;
  
    return password === confirmPassword ? null : { notSame: true }     
  }

  private _filter(value: string): string[] {
    let filterValue ="";
    if((value != null || value != "") && typeof value === "string")
    {
     filterValue = value.toLowerCase();
    return this.nonFilteredSearchData.filter((data: any) => data.value.toLowerCase().includes(filterValue));
   }
   else
   {
    return this.nonFilteredSearchData;
   }
  }

  onSearchClear(){
    this.cardsearcharray = [];
   // this.filtercheckboxbool=false;
    this.multisearcharray = [];
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
  getmsg(row)
  {
    if(row.ppl_init == 1)
    {
      var mes='PPL is already initiated'
      return mes;
    }
    else
    {
      
     
    }
  }
  //MsgOnButton:string="";
  checkdisable(row)
  {
    if(row.ppl_init == 1)
    {
     // this.MsgOnButton="PPL is already initiated";
      return true;
    }
    else
    {
      //this.MsgOnButton="";
      return false;
    }
  }

  editobf(row)
  {
    let prms = "";
    //alert("dsjhdjkshdjks");
    // this.router.navigate(['/DealHUB/dashboard/OBFSummary',Row.dh_id,Row.dh_header_id]);
    if(this.privilege_name=='OBF Initiator')
    {
      prms = JSON.stringify({ dh_id: row.dh_id,dh_header_id:row.dh_header_id,editobf:"Edit OBF" });
      prms = this.commonService.encrypt(prms);
      this.router.navigate(['/DealHUB/dashboard/Obf'],{ queryParams: { result:prms } });
    }
    else if(this.privilege_name=='PPL Initiator')
    {
      prms = JSON.stringify({ dh_id: row.dh_id,dh_header_id:row.dh_header_id,editobf:"Edit PPL",isppl:"Y" });
      prms = this.commonService.encrypt(prms);
      this.router.navigate(['/DealHUB/dashboard/Obf'],{ queryParams: { result:prms }});
    }
   
    console.log(row);
  }

  initiateppl(row)
  {
    console.log(row);
    let prms ="";
    prms = JSON.stringify({ dh_id: row.dh_id,dh_header_id:row.dh_header_id,editobf:"Initiate PPL",reinitiate:"Y",isppl:"Y",initiateppl:"Y" });
    prms = this.commonService.encrypt(prms);
    this.router.navigate(['/DealHUB/dashboard/Obf'],{ queryParams: { result:prms } });
  }

  reinitiateobf(row)
  {
    let prms ="";
    //alert("dsjhdjkshdjks");
    // this.router.navigate(['/DealHUB/dashboard/OBFSummary',Row.dh_id,Row.dh_header_id]);
    if(this.privilege_name == "OBF Initiator")
    {
     
    prms = JSON.stringify({ dh_id: row.dh_id,dh_header_id:row.dh_header_id,editobf:"Re-initiate OBF",reinitiate:"Y" });
    prms = this.commonService.encrypt(prms);
    this.router.navigate(['/DealHUB/dashboard/Obf'],{ queryParams:{ result:prms }});
    }
    else if(this.privilege_name == "PPL Initiator")
    {
      prms = JSON.stringify({ dh_id: row.dh_id,dh_header_id:row.dh_header_id,editobf:"Re-initiate PPL",reinitiate:"Y",isppl:"Y" });
      prms = this.commonService.encrypt(prms);
      this.router.navigate(['/DealHUB/dashboard/Obf'],{ queryParams: { result:prms } });
    }
    console.log(row);
  }

  reviseppl(row)
  {
    let prms ="";
    prms = JSON.stringify({ dh_id: row.dh_id,dh_header_id:row.dh_header_id,editobf:"Revise PPL",reinitiate:"Y",isppl:"Y" });
    prms = this.commonService.encrypt(prms);
    this.router.navigate(['/DealHUB/dashboard/Obf'],{ queryParams:{ result:prms }});
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
  this.dateselected = true;
  console.log(new Date(event.startDate._d));
console.log(new Date(event.endDate._d));
this.startdate = new Date(event.startDate._d);
this.enddate=new Date(event.endDate._d);
datefilter = this.dashboardData.filter(o => new Date(o.Created_On) >= new Date(event.startDate._d) && new Date(o.Created_On) <= new Date(event.endDate._d));
this.getcounts(datefilter);
//this.filterdata = this.filterdata.filter(o => new Date(o.Created_On) >= new Date(event.startDate._d) && new Date(o.Created_On) <= new Date(event.endDate._d));
//this.listData=new MatTableDataSource(this.filterdata);
this.addColumn(this.selectedcolumn);

}

datefilter()
{
  this.filterdata = this.filterdata.filter(o => new Date(o.Created_On) >= new Date(this.startdate) && new Date(o.Created_On) <= new Date(this.enddate));
this.listData=new MatTableDataSource(this.filterdata);
this.listData.sort = this.sort;
this.listData.paginator = this.paginator;
}

  ngAfterViewInit() {
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
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

  removesearch(value: any): void {
    const index = this.filtersToSearch.indexOf(value);
    this.searchControl.setValue('');
    if(this.dateselected)
         {
           this.datefilter();
         }
    if (index >= 0) {
      this.filtersToSearch.splice(index, 1);
      this.filtersTodisplay.splice(index, 1);
      // this._obfservices.ObfCreateForm.get("Sapio").setValue(io);
      // this._obfservices.ObfCreateForm.get("Sapionumber").setValue("");
      this.filterBasedOnSearch();
    }
    if(this.filtersToSearch.length >= 2)
    {
      if(this.filtersTodisplay.length < 2)
    {
      if(index == 0)
      {
        this.filtersTodisplay.push(this.filtersToSearch[index + 1]);
      }else
      {
      this.filtersTodisplay.push(this.filtersToSearch[index]);
    }
    }
    }
    if(this.filtersToSearch.length == 0){  
    this.addColumn(this.selectedcolumn);
    }
  }

  initName(name: string): FormControl {
    return this.fb.control(name);
  }
  validateArrayNotEmpty(c: FormControl) {
    if (c.value && c.value.length === 0) {
      return {
        validateArrayNotEmpty: { valid: false }
      };
    }
    return null;
  }

  add1(event: MatChipInputEvent, form: FormGroup): void {
    const input = event.input;
    const value = event.value;

    // Add name
    if ((value || '').trim()) {
      const control = <FormArray>form.get('names');
      control.push(this.initName(value.trim()));
      console.log(control);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  remove1(form, index) {
    console.log(form);
    form.get('names').removeAt(index);
  }
   
  addSearch(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    
    // Add our fruit
    if ((value || '').trim()) {
    // this.filtersToSearch.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    console.log("checking in chip");
    console.log(this._obfservices.obfmodel);
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

  ResetallFilter()
  {
    this.picker.clear();
    this.statusfiltercontrol.setValue("");
    this.searchfiltercontrol.patchValue([]);
    this.dateselected = false;
    this.statusfilterselected = false;
    this.searchKeysonfilter = [];
    this.filtersToSearch = [];
    this.filtersTodisplay = [];
    this.searchKeys = [
      {key: 'Project_Name', displayName: 'Project Name'}, 
      {key: 'Opp_Id', displayName: 'Oppurtunity Id'}, 
      {key: 'customer_name', displayName: 'Customer Name'}, 
      {key: 'Project_Type', displayName: 'Project Type'}, 
      {key: 'Vertical_Name', displayName: 'Vertical Name'}, 
      {key: 'dh_location', displayName: 'Location'},
      {key: 'sap_customer_code', displayName: 'SAP Customer Code'},
      {key: 'sector_name', displayName: 'Sector Name'},
      {key: 'subsector_name', displayName: 'Sub Sector Name'},
    {key: 'solutioncategory_name', displayName: 'Solution Category Name'}];
    this.getnonfilteredsearchdataimp(this.dashboardData);
    this.addColumn(this.selectedcolumn); 
    this.getcounts(this.dashboardData);
  }


  onValueSelect = (evt,data: any) => {
    if(evt.isUserInput){
    console.log(data)
    let index  = this.filtersToSearch.findIndex(obj =>obj == data);
    if(index > -1)
    {
      this._mesgBox.showError("This "+data.displayName +" already exists");
      this.searchControl.setValue(null);
        return;
    }
    this.filtersToSearch = [...this.filtersToSearch, data];
    if(this.filtersTodisplay.length < 2)
    {
      this.filtersTodisplay = [...this.filtersTodisplay, data];
    }
    this.searchControl.setValue(null);
   this.filterBasedOnSearch();
    }
  }

  filterBasedOnSearch = () => {
    this.getcountonfilter();
    this.tableFilteredData = []
    const counts: any = {};
    this.filtersToSearch.forEach((x: any) => {
       counts[x.key] = (counts[x.key] || 0) + 1; 
    });
    //console.log(counts)
    //Getting count of duplicates with keys o/p: {dh_location: 2, opp_id: 1}

    for(let data of this.filterdata){
      
      //Creating same structure as counts but with 0 as default count value for keys
      let checkData: any = {}
      for(let datacount in counts){
        checkData = {...checkData, [datacount]: 0}
      }
    
      for(let searchFilter of this.filtersToSearch){
        if(data[searchFilter.key] === 'sap_customer_code' ? data[searchFilter.key].includes(searchFilter.value) : data[searchFilter.key] === searchFilter.value){
          //Incrementing checkdata value of specific key by 1
          checkData = {...checkData, [searchFilter.key]: checkData[searchFilter.key] + 1}
        }
      }

      //checking if atleast min 1 criteria is met
      let checkIfAllCriteriasMet = true
      for(let item in checkData){
        if(checkData[item] < 1){
          checkIfAllCriteriasMet = false
          break
        }
      }

      if(checkIfAllCriteriasMet){
        if(!this.tableFilteredData.some(item => item.dh_id === data.dh_id))
          this.tableFilteredData.push(data);
         
      }
      this.listData=new MatTableDataSource(this.tableFilteredData);
      //if(filterCount == this.filtersToSearch.length)
      //  this.tableFilteredData.push(data)
    }
    // this.filterdata = this.tableFilteredData;
    /*this.tableFilteredData = this.tableFilteredData.filter(
      (s => (o: any) => 
        (k => !s.has(k) && s.add(k))
        (this.filtersToSearch.map((k: any) => o[k.key]).join('|')))
        (new Set)
    )*/

   // this.cd.detectChanges()
  }

  ResetModel() {
    this.hide = true;
    this.hide1 = true;
    this.hide2 = true;
    this.getClientKey();
    this.loginvalid.controls.CurrentPassword.setValue("");
    this.loginvalid.controls.NewPassword.setValue("");
    this.loginvalid.controls.confirmpassword.setValue("");
    this.loginvalid.controls["NewPassword"].markAsPristine();
    this.loginvalid.controls["CurrentPassword"].markAsPristine();
    this.loginvalid.controls["confirmpassword"].markAsPristine();
    this.loginvalid.controls["NewPassword"].markAsUntouched();
    this.loginvalid.controls["confirmpassword"].markAsUntouched();
    this.loginvalid.controls["CurrentPassword"].markAsUntouched();
    let dialogRef = this.dialog.open(this.resetDialog, {
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
 

openModal(templateRef,row) {
  console.log(row);
  let randomadd  =  Math.floor(Math.random() * (2000 - 1000 + 1) + 1000);
  this._obfservices.createform();
  this._obfservices.createnewobfmodelandeditobfmodel();
  let editobf:editobfarguement = new editobfarguement();
  //  editobf.dh_id = row.dh_id;
  //  editobf.dh_header_id = row.dh_header_id;
  editobf.dh_id = <number>(<unknown>((row.dh_id + randomadd).toString()+""+randomadd));
  editobf.dh_header_id = <number>(<unknown>((row.dh_header_id + randomadd).toString()+""+this.randomIntFromInterval(1000,2000)));
   //editobf.user_code = localStorage.getItem("UserCode");  commented for vapt
   editobf.user_code ="RANDOM";
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
      if(this._obfservices.obfmodel._sap_customer_code != null && this._obfservices.obfmodel._sap_customer_code != "")
      {
      this._obfservices.ObfCreateForm.controls["Sapcustomercode"].disable();
      }
      else
      {
        this._obfservices.ObfCreateForm.controls["Sapcustomercode"].enable();
      }
      this._obfservices.ObfCreateForm.get('Sapio').statusChanges.subscribe(
        status => this.SAPIOchiplist.errorState = status === 'INVALID'
      );
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
   panelClass: 'custom-modalbox-as',
      backdropClass: 'popupBackdropClass',
})
this._dashboardservice.GetDashboardProgress(this.dh_id.toString(),this.dh_header_id.toString()).subscribe((Result)=>{
  var jsondata=JSON.parse(Result);
   this.approvalstatusdetail.versiondetail=jsondata.versiondetail;
   this.approvalstatusdetail.TimeLine=jsondata.TimeLine;
   this.approvalstatusdetail.Approvaldetail=jsondata.latestprogress;

});
  var i=this.approvalstatusdetail.versiondetail.findIndex(x=>x.is_latest_version==1);
  if(i>-1)
  {
   this.GetComment(this.approvalstatusdetail.versiondetail[i].dh_id,this.approvalstatusdetail.versiondetail[i].dh_header_id) 
  }
 
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
      this.getnonfilteredsearchdataimp(this.dashboardData);
      this.getcounts(this.dashboardData);
      if(this.dashboardData.length > 0)
      {
       this.BindGridDetails();
      }
      else
      {
        this.listData = new MatTableDataSource(this.dashboardData);
      }
       this.statusfilter =  this.returnsortedvalue("currentstatus_search");
       this.bindfilterobjectoninit();
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
 
  getnonfilteredsearchdataimp(response)
  {
    this.testData = response
      let sampleData: any[] = []
      for(let data of response){
        for(let searchKey of this.searchKeys){
         //this.nonFilteredData.push({[searchKey]: data[searchKey]})
         if(data[searchKey.key])
         sampleData.push({key: searchKey.key, value: data[searchKey.key], displayName: searchKey.displayName})
        }   
      }
    
      this.nonFilteredSearchData = sampleData.filter(
        (s => (o: any) => 
          (k => !s.has(k) && s.add(k))
          (this.customizedKeySet.map(k => o[k]).join('|')))
          (new Set)
      )
      //this.nonFilteredSearchData.filter((data: any) => data.value !== null || data.value !== "");
      this.nonFilteredSearchData.sort((a: any, b: any) => {
        return a.key > b.key ? 1 : -1
      });
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
  if(sessionStorage.getItem("Action") != null)
  {
    var action=sessionStorage.getItem("Action");
    
    if(action =='Approve' && localStorage.getItem('role_name') !='CEO')
    {
      this.addColumn(1);
    }
    else if(action =='Approve' && localStorage.getItem('role_name') =='CEO')
    {
      this.addColumn(3);
    }
    else if(action =='Hold')
    {
      this.addColumn(0);
    }
    else if(action =='Reject')
    {
      this.addColumn(2);
    }
    else if(action =='Submitted')
    {
      this.addColumn(1);
    }
    else if(action =='Draft')
    {
      this.addColumn(0);
    }
    else if(action =='null')
    {
      this.addColumn(0);
    }
    sessionStorage.setItem("Action",null);
  
  }
  else
  {
    this.addColumn(0)
  }
  
  //this.setDataSourceAttributes();
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
  //  this.statusfiltercontrol.setValue("");
    this.selectedcolumn = parseInt(selection);
    this.searchwords = "";
    // if(this.dateselected)
    //      {
    //        this.datefilter();
    //        this.getcounts(this.filterdata);
    //      }
    // if(this.cardsearcharray.length > 0)
    //       {
    //        // this.getdatafromsearchandfiltereddata();
    //        this.filterdatafinal();
    //        this.getcounts(this.filterdata);
    //       }
    // alert(this.autocompletearr.length);
   // this.picker.clear();
  // alert(this.dateselected);
 // this.paginator.pageIndex=1;
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
         if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
         this.listData=new MatTableDataSource(this.filterdata);
          //  if(this.cardsearcharray.length > 0)
          //  {
          //  // this.getdatafromsearchandfiltereddata();
          //  this.filterdatafinal();
          //  }
          if(this.filtersToSearch.length > 0){
            this.filterBasedOnSearch();
          }
          
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
        if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
         this.listData=new MatTableDataSource(this.filterdata);
        // if(this.cardsearcharray.length > 0)
        //    {
        //     //this.getdatafromsearchandfiltereddata();
        //     this.filterdatafinal();
        //    }
        if(this.filtersToSearch.length > 0){
          this.filterBasedOnSearch();
        }
         // this.listData=new MatTableDataSource(this.filterdata);
         
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
        if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
         this.listData=new MatTableDataSource(this.filterdata);
        // if(this.cardsearcharray.length > 0)
        //    {
        //     //this.getdatafromsearchandfiltereddata();
        //     this.filterdatafinal();
        //    }
        if(this.filtersToSearch.length > 0){
          this.filterBasedOnSearch();
        }
        
      
        this.displayedColumns=this.RejectedScreenColumn;
        this.on_Highlight(3);
      }
      else if(selection==3 )
      {
        this.listData=new MatTableDataSource(this.dashboardData); 
       
        this.filterdata=this.dashboardData.filter(obj=>
          {
            if(obj.phase_code=='OBF' &&  obj.shortcurrentstatus=='approved')
            {
              return obj;
            }
          }
         );
         if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
        //  if(this.cardsearcharray.length > 0)
        //  {
        //   this.getdatafromsearchandfiltereddata();
        //  }
        this.listData=new MatTableDataSource(this.filterdata);
        if(this.filtersToSearch.length > 0){
          this.filterBasedOnSearch();
        }
        
       
        this.displayedColumns=this.ApprovedOBf;
        this.on_Highlight(4);
        
      }
      else if(selection==4)
      {
       //approved PPl
        this.listData=new MatTableDataSource(this.dashboardData); 
      
        this.filterdata=this.dashboardData.filter(obj=>
          {
            if(obj.phase_code=='PPL' && obj.shortcurrentstatus=='approved')
            {
              return obj;
            }
          }
        );

        if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
        // if(this.cardsearcharray.length > 0)
        //    {
        //     //this.getdatafromsearchandfiltereddata();
        //     this.filterdatafinal();
        //    }
        this.listData=new MatTableDataSource(this.filterdata);
        if(this.filtersToSearch.length > 0){
          this.filterBasedOnSearch();
        }
        
      
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
        if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
        // if(this.cardsearcharray.length > 0)
        // {
        // // this.getdatafromsearchandfiltereddata();
        // this.filterdatafinal();
        // }
      this.listData=new MatTableDataSource(this.filterdata); 
      if(this.filtersToSearch.length > 0){
        this.filterBasedOnSearch();
      }
      this.displayedColumns=this.PendingReviewercolumn;
      this.on_Highlight(1);
      }
      else if (selection==1)
      {
         //Approved section
         this.listData=new MatTableDataSource(this.dashboardData); 
         this.filterdata=this.dashboardData.filter(obj=>
          {
            if( obj.shortcurrentstatus=='approved')
            {
              return obj;
            }
          }
         );
         if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
        //  if(this.cardsearcharray.length > 0)
        //    {
        //     //this.getdatafromsearchandfiltereddata();
        //     this.filterdatafinal();
        //    }
        
         this.listData=new MatTableDataSource(this.filterdata);
         if(this.filtersToSearch.length > 0){
          this.filterBasedOnSearch();
        }
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
        if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
        // if(this.cardsearcharray.length > 0)
        // {
        //  //this.getdatafromsearchandfiltereddata();
        //  this.filterdatafinal();
        // }
        this.listData=new MatTableDataSource(this.filterdata);
        if(this.filtersToSearch.length > 0){
          this.filterBasedOnSearch();
        }
        this.displayedColumns=this.ReviewerApproved;
        this.on_Highlight(3);
      }
      else if(selection==3)
      {
        this.listData=new MatTableDataSource(this.dashboardData); 
        this.filterdata=this.dashboardData.filter(obj=>
          {
            if(obj.phase_code=='OBF' && obj.shortcurrentstatus=='cApproved')
            {
              return obj;
            }
          }
         );
         if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
        //  if(this.cardsearcharray.length > 0)
        //  {
        //  // this.getdatafromsearchandfiltereddata();
        //  this.filterdatafinal();
        //  }
        this.listData=new MatTableDataSource(this.filterdata);
        if(this.filtersToSearch.length > 0){
          this.filterBasedOnSearch();
        }
        this.displayedColumns=this.ReviewerApproved;
        this.on_Highlight(4);
        
      }
      else if(selection==4)
      {
        this.listData=new MatTableDataSource(this.dashboardData); 
        this.filterdata=this.dashboardData.filter(obj=>
          {
            if(obj.phase_code=='PPL' && obj.shortcurrentstatus=='cApproved')
            {
              return obj;
            }
          }
        );
        if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
        // if(this.cardsearcharray.length > 0)
        //    {
        //     //this.getdatafromsearchandfiltereddata();
        //     this.filterdatafinal();
        //    }
        this.listData=new MatTableDataSource(this.filterdata);
        if(this.filtersToSearch.length > 0){
          this.filterBasedOnSearch();
        }
        this.displayedColumns=this.ReviewerApproved;
        this.on_Highlight(5);
      }
    }
   // this.getcounts(this.filterdata);
   
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
   // this.paginator.firstPage()
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
        this._dashboardservice.uploadImage(files[i],"All").subscribe(
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
  { this.selectedcolumn = parseInt(selection);
    // alert(this.autocompletearr.length);
    //this.picker.clear();
  if(this.privilege_name=="OBF Initiator" || this.privilege_name=="PPL Initiator")
    {
      if(selection==0)
      {
        //Draft Section.
        
        this.listData=new MatTableDataSource(this.dashboardData); 
        this.filterdata=this.dashboardData.filter(obj=>{
          if(obj.shortcurrentstatus=='draft' && obj.phase_code=='OBF')
          {
            return obj;
          }
         // obj.shortcurrentstatus=='draft'
         } );
         if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
          //  if(this.cardsearcharray.length > 0)
          //  {
          //  // this.getdatafromsearchandfiltereddata();
          //  this.filterdatafinal();
          //  }
          this.listData=new MatTableDataSource(this.filterdata);
          if(this.filtersToSearch.length > 0){
            this.filterBasedOnSearch();
          }
        this.displayedColumns=this.DraftColumn;
        this.on_Highlight(1);
      }
      else if (selection==1)
      {
          //Submitted section
         
        this.listData=new MatTableDataSource(this.dashboardData); 
        this.filterdata=this.dashboardData.filter(obj=>{
          if(obj.shortcurrentstatus=='submitted' && obj.phase_code=='OBF')
          {
            return obj;
          }}
        );
        if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
          //  if(this.cardsearcharray.length > 0)
          //  {
          //  // this.getdatafromsearchandfiltereddata();
          //  this.filterdatafinal();
          //  }
          this.listData=new MatTableDataSource(this.filterdata);
          if(this.filtersToSearch.length > 0){
            this.filterBasedOnSearch();
          }
          this.displayedColumns=this.SubmittedScreenColumn;
          this.on_Highlight(2);
      }
      else if(selection==2)
      {
        //Rejected
        this.listData=new MatTableDataSource(this.dashboardData); 
        this.filterdata=this.dashboardData.filter(obj=>{
          if(obj.shortcurrentstatus=='rejected' && obj.phase_code=='OBF')
          {
            return obj;
          }}
        );
        if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
          //  if(this.cardsearcharray.length > 0)
          //  {
          //  // this.getdatafromsearchandfiltereddata();
          //  this.filterdatafinal();
          //  }
        this.listData=new MatTableDataSource(this.filterdata);
        if(this.filtersToSearch.length > 0){
          this.filterBasedOnSearch();
        }
        this.displayedColumns=this.RejectedScreenColumn;
        this.on_Highlight(3);
      }
    }
    else if(this.privilege_name=="OBF Reviewer" || this.privilege_name=="PPL Reviewer")
    {
      if(selection==0)
      {
        this.filterdata=this.dashboardData.filter(obj=>
          {
            if(obj.shortcurrentstatus=='Submitted'  && obj.phase_code=='OBF')
            {
              return obj;
            }
          }
        );
        if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
          //  if(this.cardsearcharray.length > 0)
          //  {
          //  // this.getdatafromsearchandfiltereddata();
          //  this.filterdatafinal();
          //  }
      this.listData=new MatTableDataSource(this.filterdata);
      if(this.filtersToSearch.length > 0){
        this.filterBasedOnSearch();
      } 
      this.displayedColumns=this.PendingReviewercolumn;
      this.on_Highlight(1);
      }
      else if (selection==1)
      {
         //Approved section
         this.listData=new MatTableDataSource(this.dashboardData); 
         this.filterdata=this.dashboardData.filter(obj=>
          {
            if( obj.shortcurrentstatus=='approved' && obj.phase_code=='OBF')
            {
              return obj;
            }
          }
         );
         
         if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
          //  if(this.cardsearcharray.length > 0)
          //  {
          //  // this.getdatafromsearchandfiltereddata();
          //  this.filterdatafinal();
          //  }
         this.listData=new MatTableDataSource(this.filterdata);
         if(this.filtersToSearch.length > 0){
          this.filterBasedOnSearch();
        }
         this.displayedColumns=this.ReviewerApproved;
         this.on_Highlight(2);
      }
      else if(selection==2)
      {
      
        this.listData=new MatTableDataSource(this.dashboardData); 
        this.filterdata=this.dashboardData.filter(obj=>
          {
            if( obj.shortcurrentstatus=='Rejected'&& obj.phase_code=='OBF')
            {
              return obj;
            }
          }
        );
        if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
          //  if(this.cardsearcharray.length > 0)
          //  {
          //  // this.getdatafromsearchandfiltereddata();
          //  this.filterdatafinal();
          //  }
        this.listData=new MatTableDataSource(this.filterdata);
        if(this.filtersToSearch.length > 0){
          this.filterBasedOnSearch();
        }
        this.displayedColumns=this.ReviewerApproved;
        this.on_Highlight(3);
      }
     
    }
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
  }
PPLclick(selection)
{
  this.selectedcolumn = parseInt(selection);
  // alert(this.autocompletearr.length);
  //this.picker.clear();
 if(this.privilege_name=="OBF Initiator" || this.privilege_name=="PPL Initiator")
  {
    if(selection==0)
    {
      //Draft Section.
      this.filterdata=[];
      this.listData=new MatTableDataSource(this.dashboardData); 
      this.filterdata=this.dashboardData.filter(obj=>{
        if(obj.shortcurrentstatus=='draft' && obj.phase_code=='PPL')
        {
          return obj;
        }
       // obj.shortcurrentstatus=='draft'
       } );
       if(this.dateselected)
       {
         this.datefilter();
       }
       if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
        //  if(this.cardsearcharray.length > 0)
        //  {
        //  // this.getdatafromsearchandfiltereddata();
        //  this.filterdatafinal();
        //  }
        this.listData=new MatTableDataSource(this.filterdata);
        if(this.filtersToSearch.length > 0){
          this.filterBasedOnSearch();
        }
      this.displayedColumns=this.DraftColumn;
      this.on_Highlight(1);
    }
    else if (selection==1)
    {
        //Submitted section
       
     // this.listData=new MatTableDataSource(this.dashboardData); 
      this.filterdata=this.dashboardData.filter(obj=>{
        if(obj.shortcurrentstatus=='submitted' && obj.phase_code=='PPL')
        {
          return obj;
        }}
      );
      if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
          //  if(this.cardsearcharray.length > 0)
          //  {
          //  // this.getdatafromsearchandfiltereddata();
          //  this.filterdatafinal();
          //  }
        this.listData=new MatTableDataSource(this.filterdata);
        if(this.filtersToSearch.length > 0){
          this.filterBasedOnSearch();
        }
        this.displayedColumns=this.SubmittedScreenColumn;
        this.on_Highlight(2);
    }
    else if(selection==2)
    {
      //Rejected
     // this.listData=new MatTableDataSource(this.dashboardData); 
      this.filterdata=this.dashboardData.filter(obj=>{
        if(obj.shortcurrentstatus=='rejected' && obj.phase_code=='PPL')
        {
          return obj;
        }}
      );
      if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
          //  if(this.cardsearcharray.length > 0)
          //  {
          //  // this.getdatafromsearchandfiltereddata();
          //  this.filterdatafinal();
          //  }
      this.listData=new MatTableDataSource(this.filterdata);
      if(this.filtersToSearch.length > 0){
        this.filterBasedOnSearch();
      }
      this.displayedColumns=this.RejectedScreenColumn;
      this.on_Highlight(3);
    }
  }
  else if(this.privilege_name=="OBF Reviewer" || this.privilege_name=="PPL Reviewer")
  {
    if(selection==0)
    {
      this.filterdata=[];
      this.filterdata=this.dashboardData.filter(obj=>
        {
          if(obj.shortcurrentstatus=='Submitted'  && obj.phase_code=='PPL')
          {
            return obj;
          }
        }
      );
      if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
          //  if(this.cardsearcharray.length > 0)
          //  {
          //  // this.getdatafromsearchandfiltereddata();
          //  this.filterdatafinal();
          //  }
    this.listData=new MatTableDataSource(this.filterdata); 
    if(this.filtersToSearch.length > 0){
      this.filterBasedOnSearch();
    }
    this.displayedColumns=this.PendingReviewercolumn;
    this.on_Highlight(1);
    }
    else if (selection==1)
    {
       //Approved section
       this.filterdata=[];
      
       this.filterdata=this.dashboardData.filter(obj=>{
        if(obj.shortcurrentstatus=='approved' && obj.phase_code=='PPL')
        {
          return obj;
        }
       // obj.shortcurrentstatus=='draft'
       } );
       if(this.dateselected)
         {
           this.datefilter();
         }
         if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
          //  if(this.cardsearcharray.length > 0)
          //  {
          //  // this.getdatafromsearchandfiltereddata();
          //  this.filterdatafinal();
          //  }
       this.listData=new MatTableDataSource(this.filterdata);
       if(this.filtersToSearch.length > 0){
        this.filterBasedOnSearch();
      }
       this.displayedColumns=this.ReviewerApproved;
       this.on_Highlight(2);
    }
    else if(selection==2)
    {
    
     // this.listData=new MatTableDataSource(this.dashboardData); 
      this.filterdata=this.dashboardData.filter(obj=>
        {
          if( obj.shortcurrentstatus=='Rejected'&& obj.phase_code=='PPL')
          {
            return obj;
          }
        }
      );
      if(this.dateselected)
      {
        this.datefilter();
      }
      if(this.statusfilterselected)
         {
           this.statusfilterfromcardselect();
         }
        // if(this.cardsearcharray.length > 0)
        // {
        // // this.getdatafromsearchandfiltereddata();
        // this.filterdatafinal();
        // }
      this.listData=new MatTableDataSource(this.filterdata);
      if(this.filtersToSearch.length > 0){
        this.filterBasedOnSearch();
      }
      this.displayedColumns=this.ReviewerApproved;
      this.on_Highlight(3);
    }
   
  }

  this.listData.sort = this.sort;
  this.listData.paginator = this.paginator;
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
        this._mesgBox.showSucess("SAP Details Saved Successfully");
        this.dialog.closeAll();
      //  this.router.navigate(['/DealHUB/dashboard']);
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

  getcounts(data)
  {
   if(this.privilege_name == "OBF Initiator" || this.privilege_name == "PPL Initiator")
   {
    this.countparam = new count();
    //draft
    this.countparam.draftscount = data.filter(obj => obj.shortcurrentstatus == 'draft').length;
    this.countparam.draftsobfcount = data.filter(obj => obj.shortcurrentstatus == 'draft' && obj.phase_code == 'OBF').length;
    this.countparam.draftpplcount = data.filter(obj => obj.shortcurrentstatus == 'draft' && obj.phase_code == 'PPL').length;

    //submitted
    this.countparam.submittedcount = data.filter(obj => obj.shortcurrentstatus == 'submitted').length;
    this.countparam.submittedobfcount = data.filter(obj => obj.shortcurrentstatus == 'submitted' && obj.phase_code == 'OBF').length;
    this.countparam.submittedpplcount = data.filter(obj => obj.shortcurrentstatus == 'submitted' && obj.phase_code == 'PPL').length;

    //rejected
    this.countparam.rejectedcount = data.filter(obj => obj.shortcurrentstatus == 'rejected').length;
    this.countparam.rejectedobfcount = data.filter(obj => obj.shortcurrentstatus == 'rejected' && obj.phase_code == 'OBF').length;
    this.countparam.rejectedpplcount = data.filter(obj => obj.shortcurrentstatus == 'rejected' && obj.phase_code == 'PPL').length;

    //approved obf
    this.countparam.approvedobfcount =  data.filter(obj => obj.shortcurrentstatus == 'approved' && obj.phase_code == 'OBF').length;
    //approved ppl
    this.countparam.approvedpplcount =  data.filter(obj => obj.shortcurrentstatus == 'approved' && obj.phase_code == 'PPL').length;
   
   }
   else
   {
    this.countparam = new count();
    //pending
    this.countparam.draftscount = data.filter(obj => obj.shortcurrentstatus.toLowerCase() == 'submitted').length;
    this.countparam.draftsobfcount = data.filter(obj => obj.shortcurrentstatus.toLowerCase() == 'submitted' && obj.phase_code == 'OBF').length;
    this.countparam.draftpplcount = data.filter(obj => obj.shortcurrentstatus.toLowerCase() == 'submitted' && obj.phase_code == 'PPL').length;

    //approved
    this.countparam.submittedcount = data.filter(obj => obj.shortcurrentstatus.toLowerCase() == 'approved').length;
    this.countparam.submittedobfcount = data.filter(obj => obj.shortcurrentstatus.toLowerCase() == 'approved' && obj.phase_code == 'OBF').length;
    this.countparam.submittedpplcount = data.filter(obj => obj.shortcurrentstatus.toLowerCase() == 'approved' && obj.phase_code == 'PPL').length;

    //rejected
    this.countparam.rejectedcount = data.filter(obj => obj.shortcurrentstatus.toLowerCase() == 'rejected').length;
    this.countparam.rejectedobfcount = data.filter(obj => obj.shortcurrentstatus.toLowerCase() == 'rejected' && obj.phase_code == 'OBF').length;
    this.countparam.rejectedpplcount = data.filter(obj => obj.shortcurrentstatus.toLowerCase() == 'rejected' && obj.phase_code == 'PPL').length;

    //approved obf
    this.countparam.approvedobfcount =  data.filter(obj => obj.shortcurrentstatus.toLowerCase() == 'capproved' && obj.phase_code == 'OBF').length;
    //approved ppl
    this.countparam.approvedpplcount =  data.filter(obj => obj.shortcurrentstatus.toLowerCase() == 'capproved' && obj.phase_code == 'PPL').length;
   

   }
  }
  filterdataforcomment:any[]=[];
  GetComment(dh_id,dh_header_id)
  {
    this.filterdataforcomment =this.approvalstatusdetail.TimeLine.filter(x=>x.dh_header_id==dh_header_id && x.dh_id==dh_id);
  }

  copyText(val: any, copied: HTMLElement){
    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      copied.classList.add('copied');

    setTimeout(()=> {
      copied.classList.remove('copied');
    }, 700)
    }
    
    getHoldcomment(row)
    {
          if(row.phase_code =='OBF')
        {
          var mes="OBF ON Hold Comment : " + row.onholdcomment;
          return mes;
        }
        else
        {
          var mes="PPL ON Hold Comment : " + row.onholdcomment;
          return mes;
        
        }
    }

    randomIntFromInterval(min, max) { // min and max included 
      let randnum =  Math.floor(Math.random() * (max - min + 1) + min);
      //let len = randnum.toString().length;
     // return randnum.toString().trim() + (len + 1).toString().trim();
     return randnum.toString().trim();
    }

  
}
