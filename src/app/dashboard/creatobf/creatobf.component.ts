import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { DashboardService } from '../dashboard.service';
import {DomSanitizer} from '@angular/platform-browser';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { editobfarguement, OBFServices, SAPIO } from '../services/obfservices.service';
import {​​​​​​​​ MatTableModule ,MatTableDataSource}​​​​​​​​ from'@angular/material/table';
import {​​​​​​​​ MatDialog, throwMatDialogContentAlreadyAttachedError }​​​​​​​​ from'@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TemplateRef } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatChipList} from '@angular/material/chips';
import { MessageBoxComponent } from 'src/app/shared/MessageBox/MessageBox.Component';
import { DatePipe } from '@angular/common';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { element, error } from 'protractor';
import * as JSZip from 'jszip';
import { environment } from 'src/environments/environment';
import { loginservices } from 'src/app/auth/login/LoginServices';
import { ThrowStmt } from '@angular/compiler';
import { CommonService } from 'src/app/services/common.service';


interface Serviceslist {
  value: string;
  viewValue: string;
}

interface Verticalhead{
  value:number;
  viewValue:string;
  vertical_head_id:number;
  vertical_head_name:string;
  tablename:string;
}

interface subsecorlist {
  value: string;
  viewValue: string;
}

interface SectotGroup {
  value: string;
  viewValue: string;
  subsecorlist:subsecorlist[]
}

export interface sectors{
  value: number;
  viewValue: string;
  vertical_id:number;
  vertical_name:string;
  tablename:string;
}

interface verticallist{
  value: number;
  viewValue: string;
  tablename:string;
}

export interface subsectors{
  Sector_Id: number;
  Sector_Name: string;
  tablename:string;
  value:number;
  viewValue:string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && control.touched);
  }
}

class SaveAttachmentParameter{
  _dh_id:number;
  _dh_header_id:number;
  _fname:string;
  _fpath:string;
  _created_by:string;
  _description:string;
}
// class objectlist
// {solutioncategory:string;
//   Servicelist:string[] = [];
//   constructor(soltioncat:string,element:string)
//   {
//     this.solutioncategory = soltioncat;
//     this.Servicelist.push(element);
//   }
  
// }
class elementcls
{
   value:string;
   viewValue:string;
   constructor(val:string,viewval:string)
   {
    this.value = val;
    this.viewValue = viewval;
   }
}

class objectlist
{solutioncategory:string;
 value:string;
  Servicelist:elementcls[] = [];
  constructor(soltioncat:string,solval:string,element:elementcls)
  {
    this.solutioncategory = soltioncat;
   this.value = solval;
    this.Servicelist.push(element);
  }
  
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

 export class SaveServiceParameter{
  Solutioncategory:string;
  value:string;
  Serviceslist:Serviceslist[] = [];

 

  constructor(soltioncat:string,solval:string,element:Serviceslist)
  {
    this.Solutioncategory = soltioncat;
   this.value = solval;
    this.Serviceslist.push(element);
  }
}

export interface Solutionservices {
  Solutioncategory: string;
  value:string;
  Serviceslist: Serviceslist[];
}

export interface Solutiongroup {
  Solutioncategory: string;
  Solutionservices: Solutionservices[],
  value:string;
  viewValue:string;
}


@Component({
  selector: 'app-creatobf',
  templateUrl: './creatobf.component.html',
  styleUrls: ['./creatobf.component.scss']
})
export class CreatobfComponent implements OnInit {
  sectorlistreupload:sectors[] = [];
  sectorlist:sectors[] = [];
  branchlist:verticallist[]=[];
  subsectorlist:subsectors[] = [];
  servicesControl = new FormControl('', Validators.required);
  data: [][];
  standardTemplete:string;
 
  declarations:string = "";
    coversheetpath:string="";
    loipopath:string="";
    supportdocpath:string="";
    Comments:string="";
    progress: number = 0;
    loiopdisabled:boolean=false;
    OBFData:any;
  columns:Array<any>;
  displayedColumns:Array<any>;
  tempservicelist:string="";
  ProjectDetails: MatTableDataSource<any>;
  visiblePreview:boolean=false;
  readMore = false;
  BrifreadMore=false;
  paymentRead=false;
  matcher = new MyErrorStateMatcher();
  service:string ="";
  sector:any;

  today:any=new Date();
  
  subsector:string="";
  visiblesubsector:string="";
  visiblesector:string="";
  projecttype:string="";
  pokemonControl = new FormControl();
  Solutionservicesarray:Solutionservices[] =[];
  Subsecotarray:subsecorlist[] =[];
  serviceslist:SaveServiceParameter[] = [];

  detailstickdisabled:boolean = true;

  Solutiongroup: Solutiongroup[] =[];

  constructor(private _dashboardservice:DashboardService,private sanitizer:DomSanitizer,
    public _obfservices:OBFServices,private dialog:MatDialog,private _mesgBox: MessageBoxComponent,private datepipe: DatePipe,private router: Router,private route: ActivatedRoute,private _loginservice:loginservices,public _commonservices:CommonService) 
  { 
    // this._obfservices.createform();
    // this._obfservices.createnewobfmodelandeditobfmodel();
  }
  files: File[] = [];
  coversheetfiles: File[] = [];
  loipofiles: File[] = [];
  supportfiles: File[] = [];        
  step = 0;
  panelOpenState:boolean=true;
  verticallist:verticallist[]=[];
  domainlist:verticallist[]=[];
  Verticalheadlist:Verticalhead[];
  
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  checked_d = false;
  ServiceMore=false;
  servicecate:string="";
  SAPIONum:string="";
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  reinitiateobf:boolean = false;
  isppl:boolean = false;
  initiateppl:boolean = false;
  reinitiatefordisable:boolean = false;
  key:string="";
  editorcreateobfstring:string ="Create OBF";
  Coversheetprogress: any[] = [];
  LoiPoprogress: any[] = [];
  SupportPoprogress: any[] = [];
  isEditObf:boolean = false;
  uploadnotdisabled:boolean = false;
  User_name:string="";
  SAPNumMore:boolean=false;
  PaymentreadMore=false;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  @ViewChild('chipList') SAPIOchiplist: MatChipList;

  ngOnInit(): void {
    //this.converttocrore(this.extractonlydgits("1,00,000.65"));
    //this._obfservices.createform();
    this.User_name= localStorage.getItem("UserName"); 
    this.declarations = "This OBF is without LOI / PO";
    this.branchlist = [];
    this._obfservices.createform();
    this._obfservices.createnewobfmodelandeditobfmodel();
    this.reinitiateobf = false;
    this.reinitiatefordisable = false;
      
    this.isppl = false;
    this.initiateppl = false;
    this._obfservices.obfmodel._dh_id =0;
    this._obfservices.obfmodel._dh_header_id =0;
    //this.servicesControl.setValue("");
    this.servicesControl = new FormControl('', Validators.required);
    this.loiopdisabled = false;
    this.uploadnotdisabled = false;
    this.detailstickdisabled = true;
    this.getcreateobfmasters();
    this.getsolutionmaster();
    this.today=this.datepipe.transform(this.today);
    this._obfservices.ObfCreateForm.get('Sapio').statusChanges.subscribe(
      status => this.SAPIOchiplist.errorState = status === 'INVALID'
    );
    this.route.queryParams.subscribe(params => {
      if(params['result'] != undefined)
      {
        let resultparms = this._commonservices.decrypt(params['result'].toString().trim());
        resultparms = JSON.parse(resultparms);
        this.editorcreateobfstring = resultparms['editobf'];
        if(resultparms['isppl'] != undefined)
        {
          this.isppl = (resultparms['isppl'] == "Y")?true:false; 
         // alert("this ppl is :"+this.isppl);
        }
        if(resultparms['initiateppl'] != undefined)
        {
          this.initiateppl = (resultparms['initiateppl'] == "Y")?true:false; 
          //alert("this ppl initiation is :"+this.isppl);
        }
        if(resultparms['reinitiate'] != undefined)
        {
          this.reinitiateobf = (resultparms['reinitiate'] == "Y")?true:false; 
          //alert("reninitiate is called :" +this.reinitiateobf);
        }
        this.geteditobfdata(resultparms['dh_id'],resultparms['dh_header_id']);
      }
      // if(params['dh_id'] != undefined && params['dh_header_id'] != undefined)
      // {
      //   this.editorcreateobfstring = params['editobf'];
      //   if(params['isppl'] != undefined)
      //   {
      //     this.isppl = (params['isppl'] == "Y")?true:false; 
      //    // alert("this ppl is :"+this.isppl);
      //   }
      //   if(params['initiateppl'] != undefined)
      //   {
      //     this.initiateppl = (params['initiateppl'] == "Y")?true:false; 
      //     //alert("this ppl initiation is :"+this.isppl);
      //   }
      //   if(params['reinitiate'] != undefined)
      //   {
      //     this.reinitiateobf = (params['reinitiate'] == "Y")?true:false; 
      //     //alert("reninitiate is called :" +this.reinitiateobf);
      //   }
      //   this.geteditobfdata(params['dh_id'],params['dh_header_id']);
      // }
  });
  //this.getClientKey();
  this.standardTemplete =this.isppl?'/DealHub - PPL Coversheet.xlsx':'/DealHub - OBF Coversheet.xlsx';
  }
   editObfcoverbol:boolean = false;
   editObfLoiPobol:boolean = false;
   editObfSupportbol:boolean = false;
  
   getClientKey()
      {
    this._loginservice.getClientKey().subscribe(result =>{
     // let res = JSON.parse(result);
     console.log(result);
      let Rkey = atob(result.Secretkey);
      Rkey = Rkey.substring(0,Rkey.length - 4);
      this.key = Rkey;
      this._obfservices.obfmodel._ClientId = result.ClientID;
     // alert(this.key);
    },
      (error:HttpErrorResponse)=>{
       // this._mesgBox.showError(error.message);
      });
     }
  
  geteditobfdata(dh_id,dh_header_id)
  {
    let randomadd  =  Math.floor(Math.random() * (2000 - 1000 + 1) + 1000);
    // this._obfservices.obfmodel._dh_id = <number>(<unknown>((this._obfservices.obfmodel._dh_id + randomadd).toString()+""+randomadd));
    
   let editobf:editobfarguement = new editobfarguement();
  //  editobf.dh_id = dh_id;
  //  editobf.dh_header_id = dh_header_id;
    editobf.dh_id = <number>(<unknown>((dh_id + randomadd).toString()+""+randomadd));
    editobf.dh_header_id = <number>(<unknown>((dh_header_id + randomadd).toString()+""+this.randomIntFromInterval(1000,2000)));
  //  editobf.user_code = localStorage.getItem("UserCode");  commented for vapt
  editobf.user_code ="RANDOM";
   this._obfservices.geteditobfdata(editobf).subscribe(res =>{
    let getrandom = res.split("*$");
    let Resultdata = getrandom[0];
    let actualrandom = getrandom[1];
    let actualkey = "0c24f9de!b"+actualrandom;
    Resultdata =  this._commonservices.setDecryption(actualkey,Resultdata);
     let result =  JSON.parse(Resultdata);
     this.isEditObf = true;
    //  this.detailstickdisabled = false;
     console.log("check objectssssss after edit");
     //this.editorcreateobfstring= "Edit";
     console.log(result);
     if(result != null)
     {
      this.editObfcoverbol = true;
      this.editObfLoiPobol = true;
      this.editObfSupportbol = true;
     }
      this._obfservices.editObfObject = JSON.parse(Resultdata);
      this._obfservices.initializeobfmodelandform();
      this.editobfinitialization();
     // this.getotherservicesandsolutions();
      
   },
   error =>
   {
    this._mesgBox.showError(error.message);
   });
  }

  removeuploadfilesforinitiateppl()
  {
    this._obfservices.obfmodel.Attachments= [];
    this._obfservices.coversheetarray = [];
    this._obfservices.loipoarray= [];
    this._obfservices.supportarray = [];
    this._obfservices.ObfCreateForm.patchValue({coversheet:""});
    this._obfservices.ObfCreateForm.patchValue({Loiposheet:""});
    this._obfservices.ObfCreateForm.patchValue({Supportpath:""});
    this._obfservices.ObfCreateForm.patchValue({Loipodropdown:""});
    this._obfservices.ObfCreateForm.patchValue({Selfdeclare:""});
    this._obfservices.ObfCreateForm.get('Loiposheet').setValidators(Validators.required);
    this._obfservices.ObfCreateForm.get('Loiposheet').updateValueAndValidity();
    this._obfservices.emptyexcelformvaluesforreuploadcoversheet();
    this.loiopdisabled = false;  
    this.supportchecked = true;
    this.checked_d = false;
    this.uploadnotdisabled = this._obfservices.ObfCreateForm.valid;
    this.supportchecked = true;
    this.checked_d = false;
  }
  
 
  editobfinitialization()
  {
    
      if(this._obfservices.supportarray.length >0)
      {
        this.supportchecked = false;
         this.checked_d = true;
         this.disableSupporting=false;
         if(this.initiateppl)
         {

         }else
         {
        //  this._obfservices.ObfCreateForm.get('Supportpath').setValidators(Validators.required);
        //   this._obfservices.ObfCreateForm.get('Supportpath').updateValueAndValidity();
         }

      }
      if(this._obfservices.ObfCreateForm.get("Loiposheet").value == null)
      {
        this.editObfLoiPobol = false;
      }
      if(this._obfservices.ObfCreateForm.get("Supportpath").value == null)
      {
        this.editObfSupportbol = false;
      }
      // added on 01-Sep-2021 because servicelist were not populated
      this.Solutionservicesarray = [];
      let result = this.Solutiongroup.filter(obj => {
        return obj.value === this._obfservices.editObfObject._vertical_id.toString();
      });
      this.servicecate=result[0].viewValue;
      this.Solutionservicesarray = result[0].Solutionservices;
      //end
      this.servicesControl.setValue(this._obfservices.servicesarray);
      this._obfservices.ObfCreateForm.patchValue({Otherservicesandcategories:this._obfservices.servicesarray});
     //added on 31-Aug-2021 for unique sector
      let ressec = this.sectorlist.filter(obj =>{
        return obj.vertical_id === this._obfservices.editObfObject._vertical_id;
      });
      this.sectorlist = <sectors[]>ressec;
      //end
      var resultnew = this.subsectorlist.filter(obj => {
        return obj.Sector_Id === this._obfservices.editObfObject._Sector_Id;
      });
      this.subsectorlisdisplay = resultnew;
      let verticalname = this.getverticalname(this.verticallist);
      if(verticalname != undefined)
      {
         this._obfservices.ObfCreateForm.patchValue({Vertical:verticalname});
      }
      console.log(this._obfservices.ObfCreateForm);
      if(this._obfservices.editObfObject._is_loi_po_uploaded == "N")
      {
        if(this._obfservices.loipoarray.length > 0)
        {
          this.loiopdisabled = false;
          this.disableLOIPO=false;
          this._obfservices.ObfCreateForm.get('Loiposheet').setValidators(Validators.required);
        this._obfservices.ObfCreateForm.get('Loiposheet').updateValueAndValidity();
        }
        else
        {
        this.loiopdisabled = true;
        this.disableLOIPO=true;
        this._obfservices.ObfCreateForm.get('Loiposheet').clearValidators();
      this._obfservices.ObfCreateForm.get('Loiposheet').updateValueAndValidity();
       }
      }
      else
      {
        this.disableLOIPO=false;
      }
      this.uploadnotdisabled = true;
      // if(this._obfservices.obfmodel._solution_category_id == 0 || this._obfservices.obfmodel._Sector_Id == 0 || this._obfservices.obfmodel._SubSector_Id == 0 || this._obfservices.obfmodel.Services.length == 0)
      if(this._obfservices.obfmodel._solution_category_id == 0 || this._obfservices.obfmodel._Sector_Id == 0 || this._obfservices.obfmodel.Services.length == 0)
      {
        this.detailstickdisabled = true; 
      }
      else{
      this.detailstickdisabled = false;
    }
      if(this._obfservices.obfmodel.Services != null)
      {
        this.serviceslist = this._obfservices.obfmodel.Services;
      }
      if(this.Verticalheadlist != undefined)
      {
      var resverticalhead = this.Verticalheadlist.filter(obj => {
        // return obj.viewValue === ws.E8.h;
        return obj.value === this._obfservices.editObfObject._vertical_id;
      });
      //let verticalheadid = res[0].vertical_head_id;
       this._obfservices.ObfCreateForm.patchValue({Verticalhead:resverticalhead[0].vertical_head_name}) ;
      }
       console.log("check form after onload of editobf");
       console.log(this._obfservices.ObfCreateForm);
       console.log("check object after onload of editobf");
       console.log(this._obfservices.obfmodel);
       if(this.editorcreateobfstring.trim() == "Re-initiate OBF")
       {
        this.reinitiatefordisable = false; 
       }
       else
       {
       this.reinitiatefordisable = this.reinitiateobf;
      }
       if(this.reinitiatefordisable)
       {
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
       }
      //   console.log("get vaertdsdsdbdsdbshdsjhdsdksjkdsjkdgjksdgksgdksgdksgdks");
      //  console.log(this._obfservices.ObfCreateForm.get("Vertical").value);
      //  console.log(this._obfservices.ObfCreateForm.controls["Vertical"])
      //  this._obfservices.ObfCreateForm.controls["Vertical"].setValue("alpha");
      //  console.log(this._obfservices.ObfCreateForm.value);
      if(this.isppl)
      {
        this.declarations="This PPL is without LOI / PO"; 
      }
      if(this.initiateppl)
      {
        this.removeuploadfilesforinitiateppl();
      }

      if(this.editorcreateobfstring.trim() == "Edit PPL")
       {
        this.getpreviousversion();
       }
      var tempprojectType=this.domainlist.filter(x=>x.value==this._obfservices.obfmodel._projecttype);
      this.projecttype =  tempprojectType[0].viewValue;
  }

  getpreviousversion()
  {
    let editobf:editobfarguement = new editobfarguement();
    editobf.dh_id = this._obfservices.editObfObject._dh_id;
    editobf.dh_header_id = this._obfservices.editObfObject._dh_header_id;
    editobf.user_code = localStorage.getItem("UserCode");
    this._obfservices.getpreviousversion(editobf).subscribe(res =>{
     
      let getrandom = res.split("*$");
    let Resultdata = getrandom[0];
    let actualrandom = getrandom[1];
    let actualkey = "0c24f9de!b"+actualrandom;
    Resultdata =  this._commonservices.setDecryption(actualkey,Resultdata);

      let result = JSON.parse(Resultdata);
      console.log("get previous data");
      console.log(result);
      this._obfservices.editObfObject._total_cost = result._total_cost;
      this._obfservices.editObfObject._capex = result._capex;
      this._obfservices.editObfObject._irr_borrowed_fund = result._irr_borrowed_fund;
      this._obfservices.editObfObject._irr_surplus_cash = result._irr_surplus_cash;
      this._obfservices.editObfObject._payment_terms = result._payment_terms;
      this._obfservices.editObfObject._total_margin = result._total_margin;
      this._obfservices.editObfObject._total_project_life = result._total_project_life;
      this._obfservices.editObfObject._total_revenue = result._total_revenue;
      this._obfservices.editObfObject._version_name = result._version_name;

    },
    error=>{

    }
    )
  }

  getverticalname(verticallist:verticallist[])
  { var response = "";
    verticallist.forEach((obj) =>{
         if(obj.value == this._obfservices.editObfObject._vertical_id)
         {
          response =  obj.viewValue;
         }
    });
    return response;
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

  remove(io: SAPIO): void {
    const index = this._obfservices.obfmodel.sapio.indexOf(io);
    this._obfservices.ObfCreateForm.get("Sapio").setValue('');
    if (index >= 0) {
      this._obfservices.obfmodel.sapio.splice(index, 1);
      // this._obfservices.ObfCreateForm.get("Sapio").setValue(io);
      // this._obfservices.ObfCreateForm.get("Sapionumber").setValue("");
      
    }
  }

  

getsolutionmaster()
{
  let encryptedusercode = this._commonservices.setEncryption(this._commonservices.commonkey,localStorage.getItem('UserCode'));
this._obfservices.getsolutionmaster(encryptedusercode).subscribe(data =>{
  let getrandom = data.split("*$");
    let Resultdata = getrandom[0];
    let actualrandom = getrandom[1];
    let actualkey = "0c24f9de!b"+actualrandom;
    Resultdata =  this._commonservices.setDecryption(actualkey,Resultdata);
  let res = JSON.parse(Resultdata);
  console.log("get solution masters");
  console.log(res);
  this.Solutiongroup= res;
  // this._obfservices.ObfCreateForm.patchValue({Solutioncategory: 2});
  if(this.isEditObf)
  {
  this.editobfinitialization();
  }
},
(error:HttpErrorResponse)=>{
 // this._mesgBox.showError(error.message);
  //alert(error.message);
}
);
}

  getcreateobfmasters()
  {
    let encryptedusercode = this._commonservices.setEncryption(this._commonservices.commonkey,localStorage.getItem('UserCode'));
    this._obfservices.GetCreateOBFMasters(encryptedusercode).subscribe(data =>{
      
      let getrandom = data.split("*$");
    let Resultdata = getrandom[0];
    let actualrandom = getrandom[1];
    let actualkey = "0c24f9de!b"+actualrandom;
    Resultdata =  this._commonservices.setDecryption(actualkey,Resultdata);
      let res = JSON.parse(Resultdata);
       console.log(Object.keys(res) );
       console.log(res.sectors);
       console.log(res.subsector);
       console.log("Vertical Master");
       console.log(res.vertical);
       console.log("Vertical head Master");
       console.log(res.verticalhead);
       this.sectorlist = res.verticalsectorwise;
       this.sectorlistreupload = res.verticalsectorwise;
       console.log("Vertical wise sector");
       console.log(res.verticalsectorwise);
       this.subsectorlist = res.subsector;
       this.verticallist =res.vertical;
       this.Verticalheadlist = res.verticalhead;
       this.domainlist = res.domains;
       this.branchlist = res.branch;
       if(this.isEditObf)
       {
         this.editobfinitialization();
       }
     
 },
 (error:HttpErrorResponse)=>{
   //this._mesgBox.showError(error.message);
   //alert(error.message);
 });
  }

  removeandaddvalidation(type:string){
  //  alert("hello world");
    if(type == "upload")
    {
      this._obfservices.ObfCreateForm.get('Solutioncategory').clearValidators();
      this._obfservices.ObfCreateForm.get('Solutioncategory').updateValueAndValidity();
      this._obfservices.ObfCreateForm.get('Otherservicesandcategories').clearValidators();
      this._obfservices.ObfCreateForm.get('Otherservicesandcategories').updateValueAndValidity();

      this._obfservices.ObfCreateForm.get('Sector').clearValidators();
      this._obfservices.ObfCreateForm.get('Sector').updateValueAndValidity();
      // this._obfservices.ObfCreateForm.get('Subsector').clearValidators();
      // this._obfservices.ObfCreateForm.get('Subsector').updateValueAndValidity();
     // this.detailstickdisabled = true;
    }

    if(type == "details")
    {
      this._obfservices.ObfCreateForm.get('Solutioncategory').setValidators(Validators.required);
      this._obfservices.ObfCreateForm.get('Solutioncategory').updateValueAndValidity();
      this._obfservices.ObfCreateForm.get('Otherservicesandcategories').setValidators(Validators.required);
      this._obfservices.ObfCreateForm.get('Otherservicesandcategories').updateValueAndValidity();

      this._obfservices.ObfCreateForm.get('Sector').setValidators(Validators.required);
      this._obfservices.ObfCreateForm.get('Sector').updateValueAndValidity();
      // this._obfservices.ObfCreateForm.get('Subsector').setValidators(Validators.required);
      // this._obfservices.ObfCreateForm.get('Subsector').updateValueAndValidity();
    }
  }

  setStep(index: number) {
   // alert(index);
    this.step = index;
  }

  nextStep(section) {
    if(section == "details")
    {
      this._obfservices.ObfCreateForm.get('Solutioncategory').setValidators(Validators.required);
      this._obfservices.ObfCreateForm.get('Solutioncategory').updateValueAndValidity();
      this._obfservices.ObfCreateForm.get('Otherservicesandcategories').setValidators(Validators.required);
      this._obfservices.ObfCreateForm.get('Otherservicesandcategories').updateValueAndValidity();

      this._obfservices.ObfCreateForm.get('Sector').setValidators(Validators.required);
      this._obfservices.ObfCreateForm.get('Sector').updateValueAndValidity();
      // this._obfservices.ObfCreateForm.get('Subsector').setValidators(Validators.required);
      // this._obfservices.ObfCreateForm.get('Subsector').updateValueAndValidity();
      console.log("check edit obf after next button");
      console.log(this._obfservices.ObfCreateForm);
      console.log("check uploadnotdisabled after next button");
      console.log(this.uploadnotdisabled);
    }
    else if(section == "preview"){
    console.log("check object after preview next click");
    console.log(this._obfservices.obfmodel);
      if(this.service !=null)
      {
        
        this.service="";
      }
     
    var finalservicecat="";
    for(let i=0 ;i<this._obfservices.obfmodel.Services.length ; i++)
    {
      var Tempservice="";
      var tempservicecat="";
      Tempservice += this._obfservices.obfmodel.Services[i].Solutioncategory;
      
      for(let t=0;t < this._obfservices.obfmodel.Services[i].Serviceslist.length;t++)
      {
        if(Tempservice == this._obfservices.obfmodel.Services[i].Solutioncategory)
        {
          
          tempservicecat += ','+ this._obfservices.obfmodel.Services[i].Serviceslist[t].viewValue;
        }
      }
    
     tempservicecat=tempservicecat.substring(1);
     finalservicecat += " "+ Tempservice +"-"+ tempservicecat +".";
     
    }
    // this.service = this.service.substring(1);
    this.service=finalservicecat;
    this.SAPIONum="";
    for (let j=0;j<this._obfservices.obfmodel.sapio.length;j++)
    {
      this.SAPIONum += "," +this._obfservices.obfmodel.sapio[j]._Cust_SAP_IO_Number;
    }
    this.SAPIONum = this.SAPIONum.substring(1)
    
    var temp= this.sectorlist.filter(x=>x.value==this._obfservices.obfmodel._Sector_Id);
    if(temp[0] != undefined)
    this.visiblesector = temp[0].viewValue

    var tempsector=this.subsectorlisdisplay.filter(x=>x.value==this._obfservices.obfmodel._SubSector_Id);
    if(tempsector[0] != undefined)
    this.visiblesubsector=tempsector[0].viewValue;

     this.OBFData = this._obfservices.ObfCreateForm.getRawValue();
      console.log(this._obfservices.ObfCreateForm.value);
    }
    this.step++;
  }

  prevStep(section) {
    if(section == "details")
    {
      this._obfservices.ObfCreateForm.get('Solutioncategory').clearValidators();
      this._obfservices.ObfCreateForm.get('Solutioncategory').updateValueAndValidity();
      this._obfservices.ObfCreateForm.get('Otherservicesandcategories').clearValidators();
      this._obfservices.ObfCreateForm.get('Otherservicesandcategories').updateValueAndValidity();

      this._obfservices.ObfCreateForm.get('Sector').clearValidators();
      this._obfservices.ObfCreateForm.get('Sector').updateValueAndValidity();
      // this._obfservices.ObfCreateForm.get('Subsector').clearValidators();
      // this._obfservices.ObfCreateForm.get('Subsector').updateValueAndValidity();
    }
    this.step--;
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
      this.detailstickdisabled = this._obfservices.ObfCreateForm.invalid;
      
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

  sanitize(url:string){
    if(this.isEditObf)
    {
      url = environment.apiUrl+url
    }
    else
    {
      url = environment.apiUrl+url;
    }
      return this.sanitizer.bypassSecurityTrustUrl(url);
  }
downloaddocument(event)
{
//   var zip = new JSZip();
// var count = 0;
// var zipFilename = "Supportfiles.zip";
//   var filesarr = this._obfservices.obfmodel.Attachments.filter(x => x._description == "support");
  event.preventDefault();
  if(this._obfservices.ObfCreateForm.get("Supportpath").value == null || this._obfservices.ObfCreateForm.get("Supportpath").value == "")
  {
    this._mesgBox.showError("No Supporting Documents to Download");
    //this.disableSupporting=true;
  }
  if(this._obfservices.obfmodel.Attachments.length != 0)
  {
    for (let i=0;i< this._obfservices.obfmodel.Attachments.length;i++)
    {
      if(this._obfservices.obfmodel.Attachments[i]._description=="support")
      {
        
         let url=this._obfservices.obfmodel.Attachments[i]._fpath;
         if(this.isEditObf)
         {
            url = environment.apiUrl+url
         }
         else
         {
          url = environment.apiUrl+url
         }
         window.open(url);
       //  window.location.href = url;
        //var filename = this._obfservices.obfmodel.Attachments[i]._fname;
        // loading a file and add it in a zip file
        // JSZipUtils.getBinaryContent(this._obfservices.obfmodel.Attachments[i]._fpath, function (err, data) {
        //    if(err) {
        //       throw err; // or handle the error
        //    }
        //    zip.file(filename, data, {binary:true});
        //    count++;
        //    if (count == filesarr.length) {
        //     zip.generateAsync({type:'blob'}).then(function(content) {
        //       saveAs(content, zipFilename);
        //    });
        //    }
        // });
      }
    }
  }
  else{
    this._mesgBox.showError("No Supporting Documents to Download");

  }

  
}
disableLOIPO:boolean=true;
disableSupporting:boolean=true;
//disablefinalagg:boolean=false;

downloadLOIp(event)
{
  event.preventDefault();
  if(this._obfservices.ObfCreateForm.get("Loiposheet").value == null || this._obfservices.ObfCreateForm.get("Loiposheet").value == "")
  {
   
    this._mesgBox.showError("No LOI/PO to Download");
  }
  else{
    let url = this._obfservices.ObfCreateForm.get("Loiposheet").value;
    if(this.isEditObf)
         {
            url = environment.apiUrl+url;
         }
         else{
          url = environment.apiUrl+url;
         }
         
    // window.open(this.loipopath,"_self");
    //window.open(this.loipopath);
    window.open(url);
  }
 

}
downloadCoversheet(event)
{
  event.preventDefault();
  if(this.coversheetpath != "")
  {
    let url = environment.apiUrl+this.coversheetpath;
    window.open(url);
  }
 else{
  let url = environment.apiUrl+this._obfservices.ObfCreateForm.get('coversheet').value;
  window.open(url);
   
 }
  
}
  
  message: string[] = [];
  iscoversheet:boolean=true;
  isloipo:boolean=true;
  isSupport:boolean=true;

   bytesToSize(bytes):number {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return 0;
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    if (i === 0) return bytes;
    return parseFloat((bytes / (1024 ** i)).toFixed(1));
  }

  supportfilecount:number=0;

	onSelect(event,types) {
    
    try{
    // var format = /[`!@#$%^&*()+\=\[\]{};':"\\|,<>\/?~]/;
     
    var format = /[`!@#$%^*+\=\[\]{};':"\\|,<>\/?~]/;   //removed () from validation 
   
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
      // if( element.size > 4194304)
      // {
      //   throw new Error("The file size of "+element.name+" is greater than 4 Mb, Kindly re-upload files with size less than 4 Mb" );
      // }
      if( element.size > 31457280)
      {
        throw new Error("The file size of "+element.name+" is greater than 30 Mb, Kindly re-upload files with size less than 4 Mb" );
      }

    });
    this.progress = 0;
    if(types == "coversheet")
       {
        this.editObfcoverbol = false;
        this._obfservices.ObfCreateForm.controls.Sector.setValue("");
        this._obfservices.ObfCreateForm.controls.Subsector.setValue("");
        this._obfservices.ObfCreateForm.patchValue({coversheet: null});
        this.uploadnotdisabled = this._obfservices.ObfCreateForm.valid;
        if(event.addedFiles.length > 1)
        {
          throw new Error("Kindly upload only one valid coversheet");
        }
        
        if(this.coversheetfiles.length >= 1)
        {
         // alert("Kindly upload only one Coversheet file");
         this._mesgBox.showError("Kindly upload only one Coversheet file");
          return false;
        }
        else{
          this._obfservices.emptyexcelformvaluesforreuploadcoversheet();
          this.coversheetfiles.push(...event.addedFiles);
          this.iscoversheet = !this.iscoversheet;
        }
        
        // this.files = this.coversheetfiles;
        this.updatedatafromcoversheet(event);

       }
       else if(types == "loipo")
       {
        this.editObfLoiPobol = false;
        this._obfservices.ObfCreateForm.patchValue({Loiposheet: null});
        this.uploadnotdisabled = this._obfservices.ObfCreateForm.valid;
        if(this.isEditObf)
        {
          let index = this._obfservices.obfmodel.Attachments.findIndex(obj => obj._description == this._obfservices.ObfCreateForm.get("Loipodropdown").value);
         if(index > -1)
            {
             this._obfservices.obfmodel.Attachments.splice(index,1);
            //  this._obfservices.ObfCreateForm.patchValue({Loiposheet:""});
            //  this.uploadnotdisabled = false;
           }
        }
        if(event.addedFiles.length > 1)
        {
          throw new Error("Kindly upload only one valid LOI/PO Sheet");
        }
         if(this.loipofiles.length >= 1 )
         {
         // alert("Kindly upload only one Loi / Po file");
          this._mesgBox.showError("Kindly upload only one valid LOI/PO Sheet");
          return false;
         }
         else{
           if(this._obfservices.ObfCreateForm.get("Loipodropdown").value == null || this._obfservices.ObfCreateForm.get("Loipodropdown").value == "")
           {
            throw new Error("Kindly select LOI or PO file type");
           }
        this.loipofiles.push(...event.addedFiles);
        //this.isloipo = !this.isloipo;
        this.isloipo = false;
        }
        // this.files = this.loipofiles;
       }
       else
       {
        this.editObfSupportbol = false;
        this._obfservices.ObfCreateForm.patchValue({Supportpath: null});
        this.uploadnotdisabled = this._obfservices.ObfCreateForm.valid;
        if(this.isEditObf)
        {
          this.editObfSupportbol = true;
        //   for(var i = 0;i<this._obfservices.obfmodel.Attachments.length;i++)
        //   {
        //   let index = this._obfservices.obfmodel.Attachments.findIndex(obj => obj._description == "support");
        //  if(index > -1)
        //     {
        //      this._obfservices.obfmodel.Attachments.splice(index,1);
        //     //  this._obfservices.ObfCreateForm.patchValue({Loiposheet:""});
        //     //  this.uploadnotdisabled = false;
        //    }
        //   }
        }
         this.supportfilecount +=1;
         if(this.supportfilecount > 1)
         {
          this.isSupport = false;
         }
         else
         {
         // this.isSupport = !this.isSupport;
         this.isSupport = false;
         }
        this.supportfiles.push(...event.addedFiles);
        // this.files = this.supportfiles;
       }
       console.log("check progrss value");
       console.log(this.progress);
		// this.files.push(...event.addedFiles);
  }
  catch(e)
  {
    this._mesgBox.showError(e.message);
  }

	}
  SaveAttachmentParameter:SaveAttachmentParameter;
  finalsupportarray:any[]=[];
  uploadfiles(files:File[],types)
  {
    let val = true;
    if(types == "coversheet")
    {
      this.iscoversheet = !this.iscoversheet;
      this.Coversheetprogress = [];
      val = this.validateform();
    }
    else if(types == "loipo")
    {
      this.isloipo = !this.isloipo;
      this.LoiPoprogress = [];
      
    }
    else if(types == "support")
    {
      this.isSupport = !this.isSupport;
      this.SupportPoprogress = [];
    }
    
    this.message= [];
    var path="";
    var consolidatedpath="";
   // const val = this.validateform();
    if(val)
    {
    for (let i = 0; i < files.length; i++) {
      if(types == "coversheet")
    {
      this.Coversheetprogress[i] = { value: 0, fileName: files[i].name };
    }
    else if(types == "loipo")
    {
      this.LoiPoprogress[i] = { value: 0, fileName: files[i].name };
    }
    else if(types == "support")
    {
      this.SupportPoprogress[i] = { value: 0, fileName: files[i].name,_description:"support" };
    }
      
      path="";
    this._dashboardservice.uploadImage(files[i],types).subscribe(
      event => {
       // files.splice(i,1);
        if(event.type === HttpEventType.UploadProgress)
        {
          console.log('Upload Progress: '+Math.round(event.loaded/event.total * 100) +"%");
          this.progress = Math.round(event.loaded/event.total * 100);
          
          if(types == "coversheet")
    { 
      this.Coversheetprogress[i].value = Math.round(event.loaded/event.total * 100);
    }
    else if(types == "loipo")
    {
      this.LoiPoprogress[i].value = Math.round(event.loaded/event.total * 100);
    }
    else if(types == "support")
    {
      this.SupportPoprogress[i].value = Math.round(event.loaded/event.total * 100);
    }
        }
        else if(event.type === HttpEventType.Response)
        {
        console.log(event.body);
        path = JSON.stringify(event.body);
        path=path.split('"').join('');
        path = path.substring(0,path.length -1);
        consolidatedpath += path +",";
        consolidatedpath = consolidatedpath.substring(0,consolidatedpath.length -1);
         this.SaveAttachmentParameter = new SaveAttachmentParameter();
        if(path != ""){
        if(types == "coversheet")
        {
         this.coversheetpath = path;
         this._obfservices.ObfCreateForm.patchValue({coversheet: path});
         this._obfservices.obfmodel._fname =  files[i].name;
         this._obfservices.obfmodel._fpath =  path;
         this.uploadnotdisabled = this._obfservices.ObfCreateForm.valid;
    
         console.log(this._obfservices.ObfCreateForm);
         this._obfservices.obfmodel._created_by =  localStorage.getItem('UserCode');
          
        }
        else if(types == "loipo")
        {
         this.loipopath = path;
         this._obfservices.ObfCreateForm.patchValue({Loiposheet: path});
         this.SaveAttachmentParameter._fname= files[i].name; 
         this.SaveAttachmentParameter._fpath = path;
         this.SaveAttachmentParameter._description = this._obfservices.ObfCreateForm.get("Loipodropdown").value;
        // this._obfservices.obfmodel.Attachments.push(this.SaveAttachmentParameter);
         this.uploadnotdisabled = this._obfservices.ObfCreateForm.valid;
         this._obfservices.obfmodel._is_loi_po_uploaded = "Y";
         if(this.isEditObf)
         {
          let desc = this._obfservices.loipoarray[0] !=undefined?this._obfservices.loipoarray[0]._description:"";
          let index = this._obfservices.obfmodel.Attachments.findIndex(obj => obj._description == desc);
          if(index > -1)
           {
            this._obfservices.obfmodel.Attachments.splice(index,1);
           }
         }
         this.disableLOIPO=false;
         this._obfservices.obfmodel.Attachments.push(this.SaveAttachmentParameter);
        }
        else if(types == "support")
        {
          this.supportdocpath = path;
          this._obfservices.ObfCreateForm.patchValue({Supportpath: path});
          //this.SupportPoprogress[i].fileName = path;
          this.SaveAttachmentParameter._fname= files[i].name; 
         this.SaveAttachmentParameter._fpath = path;
         this.SaveAttachmentParameter._description = "support";
         this.uploadnotdisabled = this._obfservices.ObfCreateForm.valid;
         this.disableSupporting=false;
         console.log(this._obfservices.ObfCreateForm);
         let index = this._obfservices.obfmodel.Attachments.findIndex(obj => obj._fname == this.SaveAttachmentParameter._fname && obj._description == "support");
         if(index > -1)
         {}
         else{
         this._obfservices.obfmodel.Attachments.push(this.SaveAttachmentParameter);
        }
        this.finalsupportarray.push(this.SupportPoprogress[i]);

        // let newindex = files.findIndex(obj => obj.name == files[i].name);
        // if(newindex > -1)
        // {
        //   files.splice(i,1);
        // }
        if(i == (files.length - 1))
        {
          this.supportfiles = [];
        }
        }
        //alert(this._obfservices.ObfCreateForm.valid);
       
      }
      }
     
      },
      (err:any)=>{
        if(types == "coversheet")
    {
      this.Coversheetprogress[i].value = 0;
    }
    else if(types == "loipo")
    {
      this.LoiPoprogress[i].value = 0;
    }
    else if(types == "support")
    {
      this.SupportPoprogress[i].value = 0;
      this.supportfiles = [];
    }
        
        const msg = 'Could not upload the file: ' + files[i].name;
        this.message.push(msg);
        this._mesgBox.showError(msg);
      }
    );
    }
    
  }
  
  console.log("check for disable");
  console.log(this._obfservices.ObfCreateForm);
    // this.validateform();
  }

	onRemove(files:File[],event,types) {
    if(types == "coversheet")
    {
      this.iscoversheet = !this.iscoversheet;
    }
    else if(types == "loipo")
    {
      this.isloipo = !this.isloipo;
      
    }
    else if(types == "support")
    {
      
      // this.isSupport = !this.isSupport;
    }
		console.log(event);
		files.splice(files.indexOf(event), 1);
    if(types == "coversheet" && this.coversheetfiles.length == 0)
    {
      this._obfservices.ObfCreateForm.patchValue({coversheet: ""});
    }
    if(types == "loipo" && this.loipofiles.length == 0)
    {
      this._obfservices.ObfCreateForm.patchValue({Loiposheet: ""});
    }
    if(types == "support" && this.supportfiles.length == 0)
    {
      this.isSupport = !this.isSupport;
      this._obfservices.ObfCreateForm.patchValue({Supportpath: ""});
    }
    
	}

  onRemoveAttachments(attachment,array)
  {

    let index = this._obfservices.obfmodel.Attachments.findIndex(obj => obj._fpath == attachment._fpath);
    if(index > -1)
    {
      this._obfservices.obfmodel.Attachments.splice(index,1);
    }

    let indexnew = array.findIndex(obj => obj._fpath == attachment._fpath);
    if(indexnew > -1)
    {
      array.splice(index,1);
     
      //this.supportfiles=array;
    }
    // console.log(attachment);
    if(array.length == 0)
    {
      this.supportfiles = [];
      this._obfservices.ObfCreateForm.patchValue({Supportpath:""});
     // this.uploadnotdisabled = this._obfservices.ObfCreateForm.valid;
      this.isSupport = !this.isSupport;
    }
    if(this._obfservices.obfmodel.Attachments.length==0)
    {
      this.disableSupporting=true;
    }
  }

  onRemoveAttachmentsPreview(attachment,array)
  {

    let index = this._obfservices.obfmodel.Attachments.findIndex(obj => (obj._fname == attachment.fileName && obj._description == "support"));
    if(index > -1)
    {
      this._obfservices.obfmodel.Attachments.splice(index,1);
    }

    let indexnew = array.findIndex(obj => obj.fileName == attachment.fileName);
    if(indexnew > -1)
    {
      array.splice(index,1);
      let tempindex = this.supportfiles.findIndex(obj => obj.name == attachment.fileName);
      if(tempindex>-1)
      {
        this.supportfiles.splice(tempindex,1);
      }
    }

    if(array.length == 0)
    {
      this.supportfiles = [];
      this._obfservices.ObfCreateForm.patchValue({Supportpath:""});
      //this.uploadnotdisabled = this._obfservices.ObfCreateForm.valid;
      this.isSupport = !this.isSupport;
    }
    if(this._obfservices.obfmodel.Attachments.length==0)
    {
      this.disableSupporting=true;
    }
    // console.log(attachment);
  }

  onRemoveLoiPoPreview(attachment,array)
  {

    let index = this._obfservices.obfmodel.Attachments.findIndex(obj => (obj._fname == attachment.fileName && obj._description == this._obfservices.ObfCreateForm.get("Loipodropdown").value));
    if(index > -1)
    {
      this._obfservices.obfmodel.Attachments.splice(index,1);
    }

    let indexnew = array.findIndex(obj => obj.fileName == attachment.fileName);
    if(indexnew > -1)
    {
      array.splice(index,1);
    }

    if(array.length == 0)
    {
      this.loipofiles = [];
      this._obfservices.ObfCreateForm.patchValue({Loiposheet:""});
      this.uploadnotdisabled = this._obfservices.ObfCreateForm.valid;
      this.isloipo = !this.isloipo;
      
    }

    // console.log(attachment);
  }

  

  onRemoveLoiAttachments()
  {
    
    // let index = this._obfservices.obfmodel.Attachments.findIndex(obj => obj._description == this._obfservices.ObfCreateForm.get("Loipodropdown").value);
    let index = this._obfservices.obfmodel.Attachments.findIndex(obj => obj._description == "LOI" || obj._description == "PO" || obj._description == "Agreement");
    if(index > -1)
    {
      this._obfservices.obfmodel.Attachments.splice(index,1);
      this._obfservices.ObfCreateForm.patchValue({Loiposheet:""});
      this.uploadnotdisabled = false;
    }

    let indexnew = this._obfservices.loipoarray.findIndex(obj => obj._description == "LOI" || obj._description == "PO" || obj._description == "Agreement");
    if(indexnew > -1)
    {
      this._obfservices.loipoarray.splice(index,1);
    }

    if(this._obfservices.loipoarray.length == 0)
    {
      this.loipofiles = [];
      this._obfservices.ObfCreateForm.patchValue({Loiposheet:""});
      this.isloipo = !this.isloipo;
    }
    // console.log(attachment);
  }

  removeeditcoversheet()
  {
    this._obfservices.coversheetarray =[];
    this.coversheetfiles =[];
    this._obfservices.obfmodel._fname = "";
    this._obfservices.obfmodel._fpath = "";
    this._obfservices.ObfCreateForm.patchValue({coversheet:""});
    this.uploadnotdisabled = false;
  }

  removeprogresscoversheet()
  {
    // console.log(this._obfservices.obfmodel);
    // //let filepath = this._obfservices.obfmodel._fpath;
    // let filepath =  this.coversheetpath;
    // this._obfservices.deletefile(this._obfservices.obfmodel._fpath).subscribe(res =>{
    //    alert("hello world");
    // });
    this.coversheetfiles =[];
    this.Coversheetprogress = [];
    this._obfservices.obfmodel._fname = "";
    this._obfservices.obfmodel._fpath = "";
    this._obfservices.ObfCreateForm.patchValue({coversheet:""});
    this.uploadnotdisabled = false;
  }

   renameKey(obj, old_key, new_key) {   
    // check if old key = new key  
        if (old_key !== new_key) {                  
           Object.defineProperty(obj, new_key, // modify old key
                                // fetch description from object
           Object.getOwnPropertyDescriptor(obj, old_key));
           delete obj[old_key];                // delete old key
           }
    }
    updatedatafromcoversheet(evt)
    {
      console.log(evt);
     // const target : DataTransfer =  <DataTransfer>(evt.target);
  
      if (evt.addedFiles.length !== 1) throw new Error('Cannot use multiple files');
  
      const reader: FileReader = new FileReader();
  
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
  
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary',cellDates:true });
      
              wb.SheetNames.forEach((element,index) =>{
                wb.SheetNames[index] = element.toLowerCase();
              });
          if(this.isppl)
          {
            if(!wb.SheetNames.includes("ppl coversheet"))
          {
            this._mesgBox.showError("Standard PPL Coversheet not found");
            this.coversheetfiles = [];
            this.iscoversheet = !this.iscoversheet;
            return false;
          }  
          }
          else
          {    
          if(!wb.SheetNames.includes("obf coversheet"))
          {
            this._mesgBox.showError("Standard OBF Coversheet not found");
            this.coversheetfiles = [];
            this.iscoversheet = !this.iscoversheet;
            return false;
          }
        }
          for (var key in wb.Sheets) {
            if (Object.prototype.hasOwnProperty.call(wb.Sheets, key)) {
              this.renameKey(wb.Sheets,key,key.toLowerCase());
            }
        }
        const wsname : string = this.isppl?"ppl coversheet":"obf coversheet";
        
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        console.log("get values");
        console.log(ws);
      // console.log(ws.A1.h);
      try{
        this.sectorlist = this.sectorlistreupload;
        if(this.isEditObf)
        {
          this._obfservices.emptyexcelformvaluesforreuploadcoversheet();
        }
        let count:number = 0;
        let validcount:number = 0;
        let validmsg:string = "";
        if(ws.H3 == undefined || ws.H3.w == "#N/A" )
        {
        count +=1;
      }
      else{
        let domain = ws.H3.w;
        let index = this.domainlist.findIndex(obj => obj.viewValue == domain.toString().trim());
        if(index > -1)
        {
          domain = this.domainlist[index].value.toString().trim();
          if(this.initiateppl || (this.reinitiateobf && this.isppl) || (this.editorcreateobfstring.trim() == 'Edit PPL'))
          {
            if(domain != this._obfservices.editObfObject._projecttype.toString().trim())
            {
              // this._mesgBox.showError("Project type does not matched with the previous version of "+((this.initiateppl || (this.editorcreateobfstring.trim() == 'Edit PPL'))?"OBF":"PPL"));
              // this.coversheetfiles = [];
              // this.iscoversheet = !this.iscoversheet;
              // return false;
              validmsg += "Project type does not matched with the previous version of "+((this.initiateppl || (this.editorcreateobfstring.trim() == 'Edit PPL'))?"OBF":"PPL")+",";
              validcount +=1;
            }
          }
          this._obfservices.ObfCreateForm.patchValue({Projecttype: domain});
          this._obfservices.obfmodel._projecttype = domain;
        }
        else
        {
          //count +=1;
          // this._mesgBox.showError("Project type is not correct");
          //     this.coversheetfiles = [];
          //     this.iscoversheet = !this.iscoversheet;
          //     return false;
          validmsg += "Project type is not correct ,";
          validcount += 1;
        }
      
     }
        if(ws.E4 == undefined || ws.E4.w == "#N/A" )
        {
        count +=1;
      }
      else{
        if(this.initiateppl || (this.reinitiateobf && this.isppl) || (this.editorcreateobfstring.trim() == 'Edit PPL'))
          {
            if(ws.E4.w.toString().trim().toUpperCase() != this._obfservices.editObfObject._dh_project_name.trim().toUpperCase())
            {
              // this._mesgBox.showError("Project name does not matched with the previous version of "+((this.initiateppl || (this.editorcreateobfstring.trim() == 'Edit PPL'))?"OBF":"PPL"));
              // this.coversheetfiles = [];
              // this.iscoversheet = !this.iscoversheet;
              // return false;
              validmsg += "Project name does not matched with the previous version of "+((this.initiateppl || (this.editorcreateobfstring.trim() == 'Edit PPL'))?"OBF":"PPL")+",";
              validcount +=1;
            }
          }
      this._obfservices.ObfCreateForm.patchValue({Projectname: ws.E4.w});
      this._obfservices.obfmodel._dh_project_name = ws.E4.w;
     }
      if(ws.E5 == undefined || ws.E5.w == "#N/A" )
      {
      // throw new Error();
      count +=1;
    }
    else{
      if(this.reinitiateobf && this.isppl)
          {
            if(ws.E5.w.toString().trim().toUpperCase() != this._obfservices.editObfObject._customer_name.toString().trim().toUpperCase())
            {
              // this._mesgBox.showError("Customer name does not matched with the previous version of OBF");
              // this.coversheetfiles = [];
              // this.iscoversheet = !this.iscoversheet;
              // return false;
              validmsg +="Customer name does not matched with the previous version of "+((this.initiateppl || (this.editorcreateobfstring.trim() == 'Edit PPL'))?"OBF":"PPL")+",";
              validcount +=1;
            }
          }
      this._obfservices.ObfCreateForm.patchValue({Customername: ws.E5.w});
      this._obfservices.obfmodel._customer_name = ws.E5.w;
    }
      // this._obfservices.ObfCreateForm.patchValue({Solutioncategory: ws.E6.h});
      // this._obfservices.ObfCreateForm.patchValue({Otherservicesandcategories: ws.E7.h});
      // this._obfservices.ObfCreateForm.patchValue({Projecttype: ws.E5.h});
      if(ws.E6 == undefined || ws.E6.h == "#N/A")
      {
      count +=1;
    }
    else
    {
      this._obfservices.ObfCreateForm.patchValue({Opportunityid: ws.E6.w});
      if(this.reinitiateobf)
        {
          if(this._obfservices.editObfObject._opportunity_id.toString().trim().toUpperCase() != ws.E6.w.toString().trim().toUpperCase())
          {
            // this._mesgBox.showError("Opportunity ID not matched with previous version of OBF");
            // this.coversheetfiles = [];
            // this.iscoversheet = !this.iscoversheet;
            // return false;
            validmsg +="Opportunity ID not matched with previous version of OBF,";
            validcount +=1;
          }
        }
      this._obfservices.obfmodel._opportunity_id = ws.E6.w;
    }
      if( ws.E7 == undefined || ws.E7.w == "#N/A")
      {
      count +=1;
    }
    else{
      let branchname:string = ws.E7.w;
      let indexbranch = this.branchlist.findIndex(obf => obf.viewValue.toString().trim().toUpperCase() == branchname.toString().trim().toUpperCase());
      // if(indexbranch == -1)
      // {
      //   validmsg +="Branch location is not correct, kindly check ,";
      //   validcount +=1;
      // }
      if(this.initiateppl || (this.reinitiateobf && this.isppl) || (this.editorcreateobfstring.trim() == 'Edit PPL'))
          {
            if(ws.E7.w.toString().trim().toUpperCase() != this._obfservices.editObfObject._dh_location.toString().trim().toUpperCase())
            {
              // this._mesgBox.showError("Project location / state does not matched with the previous version of "+((this.initiateppl || (this.editorcreateobfstring.trim() == 'Edit PPL'))?"OBF":"PPL"));
              // this.coversheetfiles = [];
              // this.iscoversheet = !this.iscoversheet;
              // return false;
              validmsg +="Project location / state does not matched with the previous version of "+((this.initiateppl || (this.editorcreateobfstring.trim() == 'Edit PPL'))?"OBF":"PPL")+",";
              validcount +=1;
            }
          }
      
      this._obfservices.ObfCreateForm.patchValue({State: ws.E7.w});
      this._obfservices.obfmodel._dh_location = ws.E7.w;
    }
      if(ws.E8 == undefined || ws.E8.w == "#N/A")
      {
        count +=1;
      }
      else{
      this._obfservices.ObfCreateForm.patchValue({Vertical: ws.E8.w});
      var result = this.verticallist.filter(obj => {
        return obj.viewValue.toString().trim().toUpperCase() === (ws.E8 == undefined?"":ws.E8.w.toString().trim().toUpperCase());
      // return obj.viewValue === "E-Commerce";
     });
     if(!(result.length > 0))
     {
      //  this._mesgBox.showError("Vertical field is not correct, please check.");
      //  this.coversheetfiles = [];
      //  this.iscoversheet = !this.iscoversheet;
      //      return false; 
      validmsg +="Vertical field is not correct, please check ,";
      validcount +=1;
     }
     else
     {
      let verticalid = parseInt(result[0].value.toString());
      if(verticalid == 8)
      {
        if(this._obfservices.obfmodel._projecttype != 3)
        {
          // this._mesgBox.showError("Project type can be only `Transportation` for MLL Network");
          //     this.coversheetfiles = [];
          //     this.iscoversheet = !this.iscoversheet;
          //     return false;
          validmsg +="Project type can be only `Transportation` for MLL Network,";
          validcount +=1;
        }
      }
      if(verticalid == 10)
      {
        if(this._obfservices.obfmodel._projecttype != 3)
        {
          // this._mesgBox.showError("Project type can be only `Transportation` for MLL Network");
          //     this.coversheetfiles = [];
          //     this.iscoversheet = !this.iscoversheet;
          //     return false;
          validmsg +="Project type can be only `Transportation` for TSG,";
          validcount +=1;
        }
      }
      if(verticalid == 6)
      {
        if(this._obfservices.obfmodel._projecttype != 3)
        {
          // this._mesgBox.showError("Project type can be only `Transportation` for Enterprise Mobility");
          //     this.coversheetfiles = [];
          //     this.iscoversheet = !this.iscoversheet;
          //     return false;
          validmsg +="Project type can be only `Transportation` for Enterprise Mobility,";
          validcount +=1;
        }
      }
      if(this.reinitiateobf)
        {
          if(this._obfservices.editObfObject._vertical_id != verticalid)
          {
            // this._mesgBox.showError("Vertical different with previous OBF version");
            // this.coversheetfiles = [];
            // this.iscoversheet = !this.iscoversheet;
            // return false;
            validmsg +="Vertical different with previous OBF version ,";
            validcount +=1;
          }
        }
     //let verticalid = 2;
     this._obfservices.obfmodel._vertical_id = verticalid;
  
     var ressec = this.sectorlist.filter(obj =>{
       return obj.vertical_id === verticalid;
     });
     this.sectorlist = <sectors[]>ressec;
     var res = this.Verticalheadlist.filter(obj => {
      // return obj.viewValue === ws.E8.h;
      return obj.value === verticalid;
    });
    //let verticalheadid = res[0].vertical_head_id;
     this._obfservices.obfmodel._verticalhead_id = res[0].vertical_head_id;
    }
  }
      // let value: any = ws.H3.v;
      // const parsedDate: Date = new Date(value);
      //  //parsedDate.setHours(parsedDate.getHours() + timezoneOffset); // utc-dates
      // // value = df(parsedDate, "dd/mm/yyyy");
      // value =  this.datepipe.transform(parsedDate, 'yyyy/MM/dd');
      // this._obfservices.ObfCreateForm.patchValue({Projectdate: value});
     
      if(ws.E9 == undefined || ws.E9.w == "#N/A")
      {
        count +=1;
      }
      else{
       this._obfservices.ObfCreateForm.patchValue({Verticalhead: ws.E9.w});
      }
      
      //this._obfservices.ObfCreateForm.patchValue({Verticalhead: "abc"});
      // this._obfservices.ObfCreateForm.patchValue({Sector: ws.E11.h});
      // this._obfservices.ObfCreateForm.patchValue({Subsector: ws.E12.h});
      if(ws.D12 == undefined || ws.D12.w == "#N/A" )
      {
        count +=1;
      }
      else{
      this._obfservices.ObfCreateForm.patchValue({Projectbrief: ws.D12.w});
      this._obfservices.obfmodel._dh_desc = ws.D12.w;
    }
      if(ws.D13 == undefined || ws.D13.w == "#N/A")
      {
        count +=1;
      }
      else
      {
        let val = this.converttocrore(this.extractonlydgits(ws.D13.w.toString().trim()),"Total revenue");
       // alert(parseInt(val.toString()));
        if(parseInt(val.toString()) == -1 || parseInt(val.toString()) == -2)
        {
          this.coversheetfiles = [];
            this.iscoversheet = !this.iscoversheet;
            return false;
        }
        this._obfservices.ObfCreateForm.patchValue({Totalrevenue: ws.D13.w});
      // this._obfservices.obfmodel._total_revenue = parseFloat(ws.D13.w.toString());
        this._obfservices.obfmodel._total_revenue = val;
      }
      
      if(ws.F13 == undefined || ws.F13.w == "#N/A")
      {
        count +=1;
      }
      else{
        let val = this.converttocrore(this.extractonlydgits(ws.F13.w.toString().trim()),"Total cost");
        if(parseInt(val.toString()) == -1 || parseInt(val.toString()) == -2)
        {
          this.coversheetfiles = [];
            this.iscoversheet = !this.iscoversheet;
            return false;
        }
      this._obfservices.ObfCreateForm.patchValue({Totalcost: ws.F13.w});
      // this._obfservices.obfmodel._total_cost = parseFloat(ws.F13.w.toString());
      this._obfservices.obfmodel._total_cost = val;
    }
      if(ws.H13 == undefined || ws.H13.w == "#N/A")
      {
        count +=1
      }
      else{
        if(this.checkifdigitexist(ws.H13.w.toString().trim()))
        {
          // this._mesgBox.showError("Total margin is not in correct format");
          //   this.coversheetfiles = [];
          //   this.iscoversheet = !this.iscoversheet;
          //   return false;
          validmsg +="Total margin is not in correct format ,";
          validcount +=1;
        }
      this._obfservices.ObfCreateForm.patchValue({Totalmargin: ws.H13.w});
      // this._obfservices.obfmodel._total_margin = parseFloat(ws.H13.w.toString().replace('%',""));
      this._obfservices.obfmodel._total_margin = parseFloat(this.extractonlydgits(ws.H13.w.toString().trim()));
    }
      if(ws.D14 == undefined || ws.D14.w == "#N/A")
      {
         count +=1; 
      }
      else
      {
        this._obfservices.ObfCreateForm.patchValue({Totalprojectlife: ws.D14.w});
      this._obfservices.obfmodel._total_project_life = ws.D14.w;
      }
     
      this._obfservices.ObfCreateForm.patchValue({IRRsurpluscash: ws.F14 == undefined?"":ws.F14.w});
      this._obfservices.obfmodel._irr_surplus_cash = parseFloat(ws.F14 == undefined ?0:ws.F14.w.toString().replace('%',""));
      this._obfservices.ObfCreateForm.patchValue({EBT: ws.H14 == undefined?"":ws.H14.w});
      this._obfservices.obfmodel._ebt = parseFloat(ws.H14 == undefined?0:ws.H14.w.toString().replace('%',""));
      if(ws.D15 == undefined || ws.D15.w == "#N/A")
      {
        count +=1;
      }
      else{
        if(this.checkifdigitexist(ws.D15.w.toString().trim()))
        {
          // this._mesgBox.showError("Capex is not in correct format");
          //   this.coversheetfiles = [];
          //   this.iscoversheet = !this.iscoversheet;
          //   return false;
          validmsg +="Capex is not in correct format ,";
          validcount +=1;
        }

        let val = this.converttocrore(this.extractonlydgits(ws.D15.w.toString().trim()),"Capex");
        if(parseInt(val.toString()) == -1 || parseInt(val.toString()) == -2)
        {
          this.coversheetfiles = [];
            this.iscoversheet = !this.iscoversheet;
            return false;
        }

        this._obfservices.ObfCreateForm.patchValue({Capex: ws.D15.w});
      // this._obfservices.obfmodel._capex = parseFloat(ws.D15.w.toString().replace('%',""));
      // this._obfservices.obfmodel._capex = parseFloat(this.extractonlydgits(ws.D15.w.toString().trim()));
         this._obfservices.obfmodel._capex = val;
      }
      
      this._obfservices.ObfCreateForm.patchValue({IRRborrowedfund: ws.F15 == undefined?"":ws.F15.w});
      this._obfservices.obfmodel._irr_borrowed_fund = parseFloat(ws.F15 == undefined?0:ws.F15.w.toString().replace('%',""));
      if(ws.H15 == undefined || ws.H15.w == "#N/A" )
      {
        count +=1;
      }
      else{
        if(this.checkifdigitexist(ws.H15.w.toString().trim()))
        {
          // this._mesgBox.showError("Payment terms is not in correct format");
          //   this.coversheetfiles = [];
          //   this.iscoversheet = !this.iscoversheet;
          //   return false;
          validmsg +="Payment terms is not in correct format ,";
          validcount +=1;
        }
        this._obfservices.ObfCreateForm.patchValue({Paymentterms: ws.H15.w});
       // this._obfservices.obfmodel._payment_terms = parseInt(ws.H15.w.toString().replace(" Days",""));
       this._obfservices.obfmodel._payment_terms = parseFloat(this.extractonlydgits(ws.H15.w.toString().trim()));
      }
  
      if(ws.D16 == undefined || ws.D16.w == "#N/A")
      {
        count +=1;
      }
      else{
        this._obfservices.ObfCreateForm.patchValue({Payment_Terms_description: ws.D16.w})
      this._obfservices.obfmodel._payment_term_desc = ws.D16.w;
      }
      
      if(ws.D17 == undefined || ws.D17.w == "#N/A" )
      {
        count +=1;
      }
      else{
        this._obfservices.ObfCreateForm.patchValue({Assumptionrisks: ws.D17.w});
      this._obfservices.obfmodel._assumptions_and_risks = ws.D17.w;
      }
      
      if(ws.D18 == undefined || ws.D18.w == "#N/A")
      {
        count +=1;
      }
      else{
        this._obfservices.ObfCreateForm.patchValue({Loipo: ws.D18.w});
        this._obfservices.obfmodel._loi_po_details = ws.D18.w;
      }

      if(this.editorcreateobfstring.trim() == "Revise PPL")
       {
        if(this._obfservices.obfmodel._total_revenue.toString().trim() == this._obfservices.editObfObject._total_revenue.toString().trim() && this._obfservices.obfmodel._total_cost.toString().trim() == this._obfservices.editObfObject._total_cost.toString().trim() && this._obfservices.obfmodel._total_margin.toString().trim() == this._obfservices.editObfObject._total_margin.toString().trim() && this._obfservices.obfmodel._irr_surplus_cash.toString().trim() == this._obfservices.editObfObject._irr_surplus_cash.toString().trim() && this._obfservices.obfmodel._ebt.toString().trim() == this._obfservices.editObfObject._ebt.toString().trim() && this._obfservices.obfmodel._capex.toString().trim() == this._obfservices.editObfObject._capex.toString().trim() && this._obfservices.obfmodel._irr_borrowed_fund.toString().trim() == this._obfservices.editObfObject._irr_borrowed_fund.toString().trim() && this._obfservices.obfmodel._payment_terms.toString().trim().toUpperCase() == this._obfservices.editObfObject._payment_terms.toString().trim().toUpperCase()) 
       {
        // this._mesgBox.showError("Details are same as of previous PPL");
        // this.coversheetfiles = [];
        // this.iscoversheet = !this.iscoversheet;
        // return false;
         validmsg +="Details are same as of previous PPL ,";
         validcount +=1;
       } 
      }
     
      if(count > 0)
      {
        throw new Error();
      }

      if(validcount > 0)
      {
        validmsg = validmsg.substring(0,validmsg.length - 1);
        this._mesgBox.showErrorforfile(validmsg);
              this.coversheetfiles = [];
              this.iscoversheet = !this.iscoversheet;
              return false;
      }
     
      console.log("check form values");
      console.log(this._obfservices.ObfCreateForm);
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      var tempprojectType=this.domainlist.filter(x=>x.value==this._obfservices.obfmodel._projecttype);
      this.projecttype =  tempprojectType[0].viewValue;
      //  console.log("MAin DATa: "+this.data);
  
      //  let x = this.data.slice(1);
      //   console.log("Sliced DATA"+x);
      }
      catch(Error)
      {
        let val =  this.validateform();
        if(!val)
        {
          this.coversheetfiles = [];
          this.iscoversheet = !this.iscoversheet;
            return false; 
        }
      }
        
      };
  
      reader.readAsBinaryString(evt.addedFiles[0]);
    }
  onFileChange(evt) {
    const excel = evt.target.files[0]
    // this._dashboardservice.uploadImage(excel).subscribe(
    //   event => {
    //     if(event.type === HttpEventType.UploadProgress)
    //     {
    //       console.log('Upload Progress: '+Math.round(event.loaded/event.total * 100) +"%");
    //     }
    //     else if(event.type === HttpEventType.Response)
    //     {
    //     console.log(event);
    //   }

    //   }
    // );
       }

  Saveasdraft(type:string){
    console.log("view model");
    console.log(this._obfservices.obfmodel);
    if(this.isppl)
    {
      this._obfservices.obfmodel._dh_phase_id =2;
      if(this.initiateppl)
      {
        this._obfservices.obfmodel._parent_dh_main_id = this._obfservices.editObfObject._dh_id;  
        this._obfservices.obfmodel._dh_id = 0;
        this._obfservices.obfmodel._dh_header_id = 0;   
      }
      else{
    this._obfservices.obfmodel._parent_dh_main_id = this._obfservices.editObfObject._parent_dh_main_id; 
  }  
    }
    else{
      this._obfservices.obfmodel._dh_phase_id =1;
      this._obfservices.obfmodel._parent_dh_main_id = 0;
    }
    
    this._obfservices.obfmodel._active = "A";
    this._obfservices.obfmodel._status ="A";
    this._obfservices.obfmodel._is_saved =1;
    this._obfservices.obfmodel._is_submitted = 0;
    this._obfservices.obfmodel._created_by = this._commonservices.setEncryption(this._commonservices.commonkey,localStorage.getItem('UserCode'));
    if(this.isEditObf)
    {
      if(this.reinitiateobf)
      {
        this._obfservices.obfmodel._mode = "insert";
      }
      else
      {
      this._obfservices.obfmodel._mode = "edit";
      }
    }
    else{
    this._obfservices.obfmodel._mode = "insert";
     }
    this._obfservices.obfmodel._service_category = "";
    // this._obfservices.encryptfields();
   this.obfmodelforencryption();
    if(type == "details")
    {
      if(this._obfservices.obfmodel._dh_id === 0 || this._obfservices.obfmodel._dh_id != 0)
      {
        //alert("obf is called");
        this._obfservices.obfmodel.save_with_solution_sector = "Y";
        
      let val =  this.validateform();
      if(val)
    {
      this._obfservices.createobf(this._obfservices.obfmodel).subscribe(data =>{
        console.log("data arrived after insert");
        let res = JSON.parse(data);
        console.log(res);
        if(res[0].Result == "success"){
          sessionStorage.setItem("Action","Draft");
        this._obfservices.obfmodel._dh_header_id = res[0].dh_header_id;
        this._obfservices.obfmodel._dh_id = res[0].dh_id;
        // alert("Documents uploaded Successfully");
       // this._mesgBox.showSucess("Successfully saved as draft");
        this._mesgBox.showSucess( (this.isppl?"PPL":"OBF")+" saved as draft successfully");
        this.router.navigate(['/DealHUB/dashboard']);
      }
      else{
       // alert("Technical error while uploading documents");
        this._mesgBox.showError("Technical error while uploading documents");
      }
      },
      (error:HttpErrorResponse)=>{
        if(error.status === 400)
        {
        if(this.isEditObf)
        {
          this._obfservices.obfmodel._dh_id = this._obfservices.editObfObject._dh_id;
          this._obfservices.obfmodel._dh_header_id = this._obfservices.editObfObject._dh_header_id;
          
        }
        else
        {
          this._obfservices.obfmodel._dh_id = 0;
          this._obfservices.obfmodel._dh_header_id = 0;
        }
        this._obfservices.ObfCreateForm.controls.Sector.setValue("");
          this._obfservices.ObfCreateForm.controls.Subsector.setValue("");
      }
      else
      {
        this._mesgBox.showError(error.message);
      }
      })
    }
      }
      else
      {
      this._obfservices.obfmodel.save_with_solution_sector = "N";
      this._obfservices.obfsolutionandservices._dh_id = this._obfservices.obfmodel._dh_id;
      this._obfservices.obfsolutionandservices._dh_header_id = this._obfservices.obfmodel._dh_header_id;
      this._obfservices.obfsolutionandservices._fname = this._obfservices.obfmodel._fname;
      this._obfservices.obfsolutionandservices._fpath = this._obfservices.obfmodel._fpath;
      this._obfservices.obfsolutionandservices._created_by = this._obfservices.obfmodel._created_by;
      this._obfservices.obfsolutionandservices._Sector_Id = this._obfservices.obfmodel._Sector_Id;
      this._obfservices.obfsolutionandservices._SubSector_Id = this._obfservices.obfmodel._SubSector_Id;
      this._obfservices.obfsolutionandservices.Services = this._obfservices.obfmodel.Services;
      this._obfservices.obfsolutionandservices._sap_customer_code = this._obfservices.obfmodel._sap_customer_code;
      this._obfservices.obfsolutionandservices.sapio = this._obfservices.obfmodel.sapio;
      this._obfservices.obfsolutionandservices._dh_comment = this._obfservices.obfmodel._dh_comment;


      let val =  this.validateform();
      if(val)
    {
      this._obfservices.savesolutionandservices(this._obfservices.obfsolutionandservices).subscribe(data =>{
        console.log("data arrived after services update");
        let res = JSON.parse(data);
        console.log(res);
        if(res[0].status == "Success"){
          //  this._obfservices.obfmodel._dh_header_id = res[0].dh_header_id;
          //  this._obfservices.obfmodel._dh_id = res[0].dh_id;
          //alert("Details updated Successfully");
          this._mesgBox.showSucess("Details updated Successfully");
          this.router.navigate(['/DealHUB/dashboard']);
        }
        else{
          // alert("Technical error while updating details");
          this._mesgBox.showError("Technical error while updating details");
        }
        // this._obfservices.obfmodel._dh_header_id = res.dh_header_id;
        // this._obfservices.obfmodel._dh_id = res.dh_id;
      },
      (error:HttpErrorResponse)=>{
        //this._mesgBox.showError(error.message);
        //alert(error.message);
      })
    }
  
    var finalservicecat="";
    for(let i=0 ;i<this._obfservices.obfmodel.Services.length ; i++)
    {
      var Tempservice="";
      var tempservicecat="";
      Tempservice += this._obfservices.obfmodel.Services[i].Solutioncategory;
      
      for(let t=0;t < this._obfservices.obfmodel.Services[i].Serviceslist.length;t++)
      {
        if(Tempservice == this._obfservices.obfmodel.Services[i].Solutioncategory)
        {
          
          tempservicecat += ','+ this._obfservices.obfmodel.Services[i].Serviceslist[t].viewValue;
        }
      }
    
     tempservicecat=tempservicecat.substring(1);
     finalservicecat += " "+ Tempservice +"-"+ tempservicecat +".";
     
    }
    // this.service = this.service.substring(1);
    this.service=finalservicecat;
    
    var temp= this.sectorlist.filter(x=>x.value==this._obfservices.obfmodel._Sector_Id);
    if(temp[0] != undefined)
    this.visiblesector = temp[0].viewValue

    var tempsector=this.subsectorlisdisplay.filter(x=>x.value==this._obfservices.obfmodel._SubSector_Id);
    if(tempsector[0] != undefined)
    this.visiblesubsector=tempsector[0].viewValue;
    this.SAPIONum="";
    for (let j=0;j<this._obfservices.obfmodel.sapio.length;j++)
    {
      this.SAPIONum += "," +this._obfservices.obfmodel.sapio[j]._Cust_SAP_IO_Number;
    }
    this.SAPIONum = this.SAPIONum.substring(1)
    
  }
    }
    else if(type == "upload")
    {
      this._obfservices.obfmodel.save_with_solution_sector = "N";
      let val =  this.validateform();
      if(val)
    {
      this._obfservices.createobf(this._obfservices.obfmodel).subscribe(data =>{
        console.log("data arrived after insert");
        let res = JSON.parse(data);
        console.log(res);
        if(res[0].Result == "success"){
        this._obfservices.obfmodel._dh_header_id = res[0].dh_header_id;
        this._obfservices.obfmodel._dh_id = res[0].dh_id;
        //alert("Documents uploaded Successfully");
        this._mesgBox.showSucess( (this.isppl?"PPL":"OBF")+" Saved successfully");
       // this._mesgBox.showSucess("Details Saved Successfully");
      }
      else{
        //alert("Technical error while uploading documents");
        this._mesgBox.showError("Technical error while uploading documents");
      }
      },
      (error:HttpErrorResponse)=>{
       // this._mesgBox.showError(error.message);
        //alert(error.message);
      })
    }
    console.log("check why form not valid");
    console.log(this._obfservices.obfmodel);
    }
   }
    
   supportchecked:boolean=true;
   Supportcheckboxchange(e:MatCheckboxChange)
   {
     
     if(e.checked)
     {
      this.supportchecked =false;
      this._obfservices.ObfCreateForm.get('Supportpath').setValidators(Validators.required);
      this._obfservices.ObfCreateForm.get('Supportpath').updateValueAndValidity();
      this.uploadnotdisabled = this._obfservices.ObfCreateForm.valid;
     }
     else{
      this.isSupport = !this.isSupport;
      this.supportchecked =true;
      this._obfservices.ObfCreateForm.get('Supportpath').clearValidators();
      this._obfservices.ObfCreateForm.get('Supportpath').updateValueAndValidity();
      this.supportfiles =[];
      this.SupportPoprogress = [];
      this._obfservices.supportarray = [];
      this._obfservices.ObfCreateForm.patchValue({Supportpath: ""});
      let filteredsupportarray:SaveAttachmentParameter[] = [];
       this._obfservices.obfmodel.Attachments.forEach((element,index,array) => {
         if(element._description != "support")
         {
          // this._obfservices.obfmodel.Attachments.splice(index, 1);
          filteredsupportarray.push(element);
         // console.log(element._fname);
        }
       });
       this._obfservices.obfmodel.Attachments = filteredsupportarray;
       this.uploadnotdisabled = this._obfservices.ObfCreateForm.valid;
      //this._obfservices.obfmodel.Attachments.splice(this._obfservices.obfmodel.Attachments.findIndex(e => e._description === "support"),1);
      console.log("check attachment after");
      console.log(this._obfservices.obfmodel.Attachments);
     }
   }

  onCheckboxChange(e:MatCheckboxChange) {
    if(e.checked)
    {
      this._obfservices.ObfCreateForm.get('Loiposheet').clearValidators();
      this._obfservices.ObfCreateForm.get('Loiposheet').updateValueAndValidity();
      this._obfservices.ObfCreateForm.patchValue({Loiposheet: ""});
      this.loipofiles.length=0;
      this.loiopdisabled = true;
      this._obfservices.obfmodel._is_loi_po_uploaded = "N";
      this.loipofiles = [];
      this.LoiPoprogress = [];
      this.disableLOIPO=true;
      if(this.isEditObf)
      {
        this.onRemoveLoiAttachments();
      }
      else{
        let index = this._obfservices.obfmodel.Attachments.findIndex(obj => obj._description == this._obfservices.ObfCreateForm.get("Loipodropdown").value);
    if(index > -1)
    {
      this._obfservices.obfmodel.Attachments.splice(index,1);
      this._obfservices.ObfCreateForm.patchValue({Loiposheet:""});
      this.uploadnotdisabled = false;
    }
      }
      this._obfservices.ObfCreateForm.get("Loipodropdown").setValue("");
     
    }
    else{
      this.disableLOIPO=false;
      this._obfservices.ObfCreateForm.get('Loiposheet').setValidators(Validators.required);
      this._obfservices.ObfCreateForm.get('Loiposheet').updateValueAndValidity();
      this.loiopdisabled = false;
      this._obfservices.obfmodel._is_loi_po_uploaded = "Y";
    }
    this.uploadnotdisabled = this._obfservices.ObfCreateForm.valid;
  }

  // GridBinding()
  //   {
  //   
  //     const columns = this.OBFData
  //     .reduce((columns, row) => {
  //       return [...columns, ...Object.keys(row)]
  //     }, [])
  //     .reduce((columns, column) => {
  //       return columns.includes(column)
  //         ? columns
  //         : [...columns, column]
  //     }, [])
  //   // Describe the columns for <mat-table>.
  //   this.columns = columns.map(column => {
  //     return {
  //       columnDef: column,
  //       header: column.replace("_"," "),
  //       cell: (element: any) => `${element[column] ? element[column] : ``}`
  //     }
  //   })
  //   this.displayedColumns = this.columns.map(c => c.columnDef);
  //   this.ProjectDetails = new MatTableDataSource(this.OBFData);
  //   this.ProjectDetails.sort = this.sort;
  //   this.ProjectDetails.paginator = this.paginator;
  //   }
  Prview()
  {
  
    this.OBFData = this._obfservices.ObfCreateForm.getRawValue();
    // this.GridBinding();
    //this.router.navigate(['/DealHUB/dashboard/preview']);
    const dialogRef = this.dialog.open(this.callAPIDialog, {
      width: '80%',
      height:'80%',
      disableClose: true,
     // data: { campaignId: this.params.id }
  })

    //let dialogRef = this.dialog.open(this.callAPIDialog);
  }

  EditOBF()
  {
    this._obfservices.ObfCreateForm.setValue(this._obfservices.ObfCreateForm.value);
    this.dialog.closeAll();
  }

  validateform()
  {
    let count:number = 0;
    let message = "";
    if(this._obfservices.ObfCreateForm.get('Projecttype').errors)
    {
      //alert("Project name is required");
      // this._mesgBox.showError("Project name is required");
      message += "Project Type"+",";
      count +=1;
    }
    if(this._obfservices.ObfCreateForm.get('Projectname').errors)
    {
      //alert("Project name is required");
      // this._mesgBox.showError("Project name is required");
      message += "Project Name"+",";
      count +=1;
    }
    if(this._obfservices.ObfCreateForm.get('Customername').errors)
    {
     // alert("Customer name is required");
      // this._mesgBox.showError("Customer name is required");
      // return false;
      message += "Customer Name"+",";
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
      message += "Vertical Head Field"+",";
      count +=1;
    }
    if(this._obfservices.ObfCreateForm.get('Projectbrief').errors)
    {
     // alert("Project brief is required");
    //  this._mesgBox.showError("Project brief is required");
    //   return false;
      message += "Project Brief"+",";
      count +=1;
    }
    if(this._obfservices.ObfCreateForm.get('Totalrevenue').errors)
    {
      //alert("Total revenue field is required");
      // this._mesgBox.showError("Total revenue field is required");
      // return false;
      message += "Total Revenue"+",";
      count +=1;
    }
    if(this._obfservices.ObfCreateForm.get('Totalcost').errors)
    {
     // alert("Total cost field is required");
      //  this._mesgBox.showError("Total cost field is required");
      // return false;
      message += "Total Cost Field"+",";
      count +=1;
    }
    if(this._obfservices.ObfCreateForm.get('Totalmargin').errors)
    {
      // alert("Total margin field is required");
      // this._mesgBox.showError("Total margin field is required");
      // return false;
      message += "Total Margin"+",";
      count +=1;
    }
    if(this._obfservices.ObfCreateForm.get('Totalprojectlife').errors)
    {
     // alert("Total project life field is required");
    //  this._mesgBox.showError("Total project life field is required");
    //   return false;
    message += "Total Project Life"+",";
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
    message += "Payment Terms"+",";
      count +=1;
    }
    if(this._obfservices.ObfCreateForm.get('Payment_Terms_description').errors)
    {
     // alert("Payment terms field is required");
    //  this._mesgBox.showError("Payment terms description field is required");
    //   return false;
    message += "Payment Terms Description"+",";
      count +=1;
    }
    if(this._obfservices.ObfCreateForm.get('Assumptionrisks').errors)
    {
     // alert("Assumption and risks  field is required");
    //  this._mesgBox.showError("Assumption and risks  field is required");
    //   return false;
    message += "Assumption and Risks"+",";
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
    this.detailstickdisabled = this._obfservices.ObfCreateForm.invalid;
    // this.servicesControl.setValue(["1","2"]);
  }

  }
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
    this.detailstickdisabled = this._obfservices.ObfCreateForm.invalid;

  }

  onsubsectorchange(evt)
  {
    this._obfservices.obfmodel._SubSector_Id = evt.value;
    this.detailstickdisabled = this._obfservices.ObfCreateForm.invalid;
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
      if(this.isEditObf)
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
    this.detailstickdisabled = this._obfservices.ObfCreateForm.invalid;
  }
  SavetoModel(){
this._obfservices.obfmodel._dh_comment = this._obfservices.ObfCreateForm.get("comments").value;
this.Comments=this._obfservices.ObfCreateForm.get("comments").value;
  }
  FinalSubmit()
  {
    console.log(this._obfservices.obfmodel);
    console.log(this._obfservices.ObfCreateForm.value) ;
    if(this.isppl)
    {
      this._obfservices.obfmodel._dh_phase_id =2;
      if(this.initiateppl)
      {
        this._obfservices.obfmodel._parent_dh_main_id = this._obfservices.editObfObject._dh_id;  
        this._obfservices.obfmodel._dh_id = 0;
        this._obfservices.obfmodel._dh_header_id = 0;   
      }
      else{
    this._obfservices.obfmodel._parent_dh_main_id = this._obfservices.editObfObject._parent_dh_main_id; 
  }
     // this._obfservices.obfmodel._parent_dh_main_id = this._obfservices.editObfObject._parent_dh_main_id; 
     // this._obfservices.obfmodel._parent_dh_main_id = 0;
    }
    else{
      this._obfservices.obfmodel._dh_phase_id =1;
    this._obfservices.obfmodel._parent_dh_main_id = 0;
    }
    
    this._obfservices.obfmodel._active = "A";
    this._obfservices.obfmodel._status ="A";
    this._obfservices.obfmodel._is_saved =1;
    this._obfservices.obfmodel._is_submitted = 1;
    this._obfservices.obfmodel._created_by =  this._commonservices.setEncryption(this._commonservices.commonkey,localStorage.getItem('UserCode'));
    if(this.isEditObf)
    {
      if(this.reinitiateobf)
      {
        this._obfservices.obfmodel._mode = "insert";
      }
      else
      {
      this._obfservices.obfmodel._mode = "edit";
    }
    }
    else
    {
      this._obfservices.obfmodel._mode = "insert"; 
    }
    this._obfservices.obfmodel._service_category = "";
    if(this._obfservices.obfmodel._dh_id === 0 || this._obfservices.obfmodel._dh_id != 0)
      {
        this._obfservices.obfmodel.save_with_solution_sector = "Y";
        this._obfservices.obfsumbitmodel._dh_id = this._obfservices.obfmodel._dh_id;
      this._obfservices.obfsumbitmodel._dh_header_id = this._obfservices.obfmodel._dh_header_id;
      this._obfservices.obfsumbitmodel._fname = this._obfservices.obfmodel._fname;
      this._obfservices.obfsumbitmodel._fpath = this._obfservices.obfmodel._fpath;
      this._obfservices.obfsumbitmodel._created_by = this._obfservices.obfmodel._created_by;
      this._obfservices.obfsumbitmodel._active = this._obfservices.obfmodel._active;
      this._obfservices.obfsumbitmodel._is_submitted = this._obfservices.obfmodel._is_submitted;

      this._obfservices.obfmodel._SubmitOBFParameters.push(this._obfservices.obfsumbitmodel);
      this.obfmodelforencryption();
      let val =  this.validateform();
      if(val)
    {
      this._obfservices.createobf(this._obfservices.obfmodel).subscribe(data =>{
        console.log("data arrived after insert");
        let res = JSON.parse(data);
        console.log(res);
        sessionStorage.setItem("Action","Submitted");
        if(res[0].Result == "success"){
        this._obfservices.obfmodel._dh_header_id = res[0].dh_header_id;
        this._obfservices.obfmodel._dh_id = res[0].dh_id;
        // alert("Documents uploaded Successfully");
       this._mesgBox.showSucess( (this.isppl?"PPL":"OBF")+" created successfully");
        this.router.navigate(['/DealHUB/dashboard']);
      }
      else{
        //alert("Technical error while uploading documents");
        this._mesgBox.showError("Technical error while uploading documents");
      }
      },
      (error:HttpErrorResponse)=>{
        if(error.status === 400)
        {
        if(this.isEditObf)
        {
          this._obfservices.obfmodel._dh_id = this._obfservices.editObfObject._dh_id;
          this._obfservices.obfmodel._dh_header_id = this._obfservices.editObfObject._dh_header_id;
         
        }
        else
        {
          this._obfservices.obfmodel._dh_id = 0;
          this._obfservices.obfmodel._dh_header_id = 0;
        }
        this._obfservices.ObfCreateForm.controls.Sector.setValue("");
          this._obfservices.ObfCreateForm.controls.Subsector.setValue("");
      }
      else
      {
        this._mesgBox.showError(error.message);
      }
        //alert(error.message);
      });
    }
      }
    else
    {
      this._obfservices.obfmodel.save_with_solution_sector = "N";
      this._obfservices.obfsumbitmodel._dh_id = this._obfservices.obfmodel._dh_id;
      this._obfservices.obfsumbitmodel._dh_header_id = this._obfservices.obfmodel._dh_header_id;
      this._obfservices.obfsumbitmodel._fname = this._obfservices.obfmodel._fname;
      this._obfservices.obfsumbitmodel._fpath = this._obfservices.obfmodel._fpath;
      this._obfservices.obfsumbitmodel._created_by = this._obfservices.obfmodel._created_by;
      this._obfservices.obfsumbitmodel._active = this._obfservices.obfmodel._active;
      this._obfservices.obfsumbitmodel._is_submitted = this._obfservices.obfmodel._is_submitted;
      
      

      let val =  this.validateform();
      if(val)
    {
      this._obfservices.SubmitOBF(this._obfservices.obfsumbitmodel).subscribe(data =>{
        console.log("data arrived after services update");
        let res = JSON.parse(data);
        console.log(res);
        if(String(res[0].status).toLowerCase() == "success"){
           this._obfservices.obfmodel._dh_header_id = res[0].dh_header_id;
           this._obfservices.obfmodel._dh_id = res[0].dh_id;
          // alert("Details updated Successfully");
          this._mesgBox.showSucess("Details updated Successfully");
          this.router.navigate(['/DealHUB/dashboard']);
        }
        else{
          //alert("Technical error while updating details");
          this._mesgBox.showError("Technical error while updating details");
        }
        // this._obfservices.obfmodel._dh_header_id = res.dh_header_id;
        // this._obfservices.obfmodel._dh_id = res.dh_id;
      },
      (error:HttpErrorResponse)=>{
       // this._mesgBox.showError(error.message);
        //alert(error.message);
      })
    }
    
    }

  }

  GridBinding()
    {
      const columns = this.OBFData
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
    this.ProjectDetails = new MatTableDataSource(this.OBFData);
    // this.ProjectDetails.sort = this.sort;
    // this.ProjectDetails.paginator = this.paginator;
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
  
  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  supportingDocumnet(url:string)
  {
    //alert("supporting document");
   
    for (let i=0;i< this._obfservices.obfmodel.Attachments.length;i++)
    {
      if(this._obfservices.obfmodel.Attachments[i]._description=="support")
      {
        var url=this._obfservices.obfmodel.Attachments[i]._fpath;
        //this.sanitize(url);
      }
    }
    
  }

  fetchcustomercode()
  {
    this._obfservices.obfmodel._sap_customer_code = this._obfservices.ObfCreateForm.get("Sapcustomercode").value;
   // alert("customer code :"+this._obfservices.obfmodel._sap_customer_code );
  }

  obfmodelforencryption()
  {
    console.log("check model beofre encvryption");
    console.log(this._obfservices.obfmodel);
    let randomadd  =  Math.floor(Math.random() * (2000 - 1000 + 1) + 1000);
    // this._obfservices.obfmodel._dh_id = <number>(<unknown>((this._obfservices.obfmodel._dh_id + randomadd).toString()+""+randomadd));
    this._obfservices.obfmodel._dh_id = <number>(<unknown>((this._obfservices.obfmodel._dh_id + randomadd).toString()+""+randomadd));
    this._obfservices.obfmodel._dh_header_id = <number>(<unknown>((this._obfservices.obfmodel._dh_header_id + randomadd).toString()+""+this.randomIntFromInterval(1000,2000)));
    this._obfservices.obfmodel._sap_customer_code =(this._obfservices.obfmodel._sap_customer_code == undefined || this._obfservices.obfmodel._sap_customer_code == "")?this.randomIntFromInterval(1000,2000): (parseInt(this._obfservices.obfmodel._sap_customer_code) + randomadd).toString()+""+this.randomIntFromInterval(1000,2000);
    this._obfservices.obfmodel._total_margin = <number>(<unknown>((this._obfservices.obfmodel._total_margin + randomadd).toString()+""+this.randomIntFromInterval(1000,2000)));
    this._obfservices.obfmodel._capex = <number>(<unknown>((this._obfservices.obfmodel._capex + randomadd).toString()+""+this.randomIntFromInterval(1000,2000)));
    this._obfservices.obfmodel._total_revenue = <number>(<unknown>((this._obfservices.obfmodel._total_revenue + randomadd).toString()+""+this.randomIntFromInterval(1000,2000)));
    this._obfservices.obfmodel._payment_terms = <number>(<unknown>((this._obfservices.obfmodel._payment_terms + randomadd).toString()+""+this.randomIntFromInterval(1000,2000)));
    this._obfservices.obfmodel._vertical_id = <number>(<unknown>((this._obfservices.obfmodel._vertical_id + randomadd).toString()+""+this.randomIntFromInterval(1000,2000)));
    this._obfservices.obfmodel._projecttype = <number>(<unknown>((parseInt(this._obfservices.obfmodel._projecttype.toString()) + randomadd).toString()+""+this.randomIntFromInterval(1000,2000)));
    this._obfservices.obfmodel._total_cost = <number>(<unknown>((this._obfservices.obfmodel._total_cost + randomadd).toString()+""+this.randomIntFromInterval(1000,2000)));
  }

  randomIntFromInterval(min, max) { // min and max included 
    let randnum =  Math.floor(Math.random() * (max - min + 1) + min);
    //let len = randnum.toString().length;
   // return randnum.toString().trim() + (len + 1).toString().trim();
   return randnum.toString().trim();
  }

  checkifdigitexist(val:string)
  {
      let res = val.replace(/[^0-9]/g, '');
      //alert(res);
      if(res == '')
      {
        return true;
      }
      else
      {
        return false;
      }
  }

  extractonlydgits(val:string)
  {
      let res = val.replace(/[^0-9.]/g, '');
      return res;
  }

   converttocrore(value,type) {
     try{
       if(value == "")
       throw new Error();
    let val = Math.abs(value)
    // if (val >= 10000000) {
    //   val = <number><unknown>(val / 10000000).toFixed(2);
    // } else if (val >= 100000) {
    //   val = <number><unknown>(val / 100000).toFixed(2);
    // }
    if(val < 999)
    { 
    }
    else if(val > 999 && val < 5000)
    {
      if(confirm(type+" is considered to be "+val+" crore, do you wish to continue??"))
      {
      }
      else
      {
        val = -1;
      }
    }
    else if(val > 5000)
    {
      if(confirm(type+" is considered to be "+val+" crore, do you wish to continue??"))
      {
      // val = <number><unknown>(val / 10000000).toFixed(2);
      val = <number><unknown>(val / 10000000);
      }
      else
      {
       val = -1;
      }
    }
    return val;
  }
    catch(Error)
      {
        this._mesgBox.showError(type+ " is not valid, Kindly check again");
        return -2; 
      }
  }
  downloadtemplete(url)
  {
    let temp= environment.apiUrl+url;
    window.open(temp);
  }
}
