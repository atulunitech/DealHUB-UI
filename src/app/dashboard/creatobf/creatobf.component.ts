import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { DashboardService } from '../dashboard.service';
import {DomSanitizer} from '@angular/platform-browser';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { OBFServices, SAPIO } from '../services/obfservices.service';
import {​​​​​​​​ MatTableModule ,MatTableDataSource}​​​​​​​​ from'@angular/material/table';
import {​​​​​​​​ MatDialog }​​​​​​​​ from'@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TemplateRef } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatChipList} from '@angular/material/chips';
import { MessageBoxComponent } from 'src/app/shared/MessageBox/MessageBox.Component';
import { DatePipe } from '@angular/common';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ErrorStateMatcher } from '@angular/material/core';

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

interface sectors{
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

interface subsectors{
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

class SaveServiceParameter{
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

interface Solutionservices {
  Solutioncategory: string;
  value:string;
  Serviceslist: Serviceslist[];
}

interface Solutiongroup {
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

  sectorlist:sectors[] = [];
  subsectorlist:subsectors[] = [];
  servicesControl = new FormControl('', Validators.required);
  data: [][];
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

  pokemonControl = new FormControl();
  Solutionservicesarray:Solutionservices[] =[];
  Subsecotarray:subsecorlist[] =[];
  serviceslist:SaveServiceParameter[] = [];

  Solutiongroup: Solutiongroup[] =[];

  constructor(private _dashboardservice:DashboardService,private sanitizer:DomSanitizer,
    public _obfservices:OBFServices,private dialog:MatDialog,private _mesgBox: MessageBoxComponent,private datepipe: DatePipe) 
  { }
  files: File[] = [];
  coversheetfiles: File[] = [];
  loipofiles: File[] = [];
  supportfiles: File[] = [];        
  step = 0;
  panelOpenState:boolean=true;
  verticallist:verticallist[]=[];
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

  Coversheetprogress: any[] = [];
  LoiPoprogress: any[] = [];
  SupportPoprogress: any[] = [];
  
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  @ViewChild('chipList') SAPIOchiplist: MatChipList;

  ngOnInit(): void {
    this._obfservices.ObfCreateForm.reset();
    this._obfservices.obfmodel._dh_id =0;
    this._obfservices.obfmodel._dh_header_id =0;
    this.getcreateobfmasters();
    this.getsolutionmaster();
    this.today=this.datepipe.transform(this.today, 'yyyy/MM/dd');
    this._obfservices.ObfCreateForm.get('Sapio').statusChanges.subscribe(
      status => this.SAPIOchiplist.errorState = status === 'INVALID'
    );
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
this._obfservices.getsolutionmaster().subscribe(data =>{
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
       this.verticallist =res.vertical;
       this.Verticalheadlist = res.verticalhead;
 },
 (error:HttpErrorResponse)=>{
   this._mesgBox.showError(error.message);
   //alert(error.message);
 });
  }

  setStep(index: number) {
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
      this._obfservices.ObfCreateForm.get('Subsector').setValidators(Validators.required);
      this._obfservices.ObfCreateForm.get('Subsector').updateValueAndValidity();

    }
    else if(section == "preview"){
    
      if(this.servicecate !=null&& this.service !=null)
      {
        this.servicecate="";
        this.service="";
      }
     this.servicecate= this._obfservices.obfmodel.Services[0].Solutioncategory;
    for(let i=0 ;i<this._obfservices.obfmodel.Services[0].Serviceslist.length ; i++)
    {

     this.service = this.service+','+ this._obfservices.obfmodel.Services[0].Serviceslist[i].viewValue;
    }
    this.SAPIONum="";
    for (let j=0;j<this._obfservices.obfmodel.sapio.length;j++)
    {
      this.SAPIONum += "," +this._obfservices.obfmodel.sapio[j]._Cust_SAP_IO_Number;
    }
    this.SAPIONum = this.SAPIONum.substring(1)
    
    var temp= this.sectorlist.filter(x=>x.value==this._obfservices.obfmodel._Sector_Id);
    this.visiblesector = temp[0].viewValue

    var tempsector=this.subsectorlisdisplay.filter(x=>x.value==this._obfservices.obfmodel._SubSector_Id);
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
      this._obfservices.ObfCreateForm.get('Subsector').clearValidators();
      this._obfservices.ObfCreateForm.get('Subsector').updateValueAndValidity();
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
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
downloaddocument(event)
{
  event.preventDefault();
  for (let i=0;i< this._obfservices.obfmodel.Attachments.length;i++)
  {
    if(this._obfservices.obfmodel.Attachments[i]._description=="support")
    {
      var url=this._obfservices.obfmodel.Attachments[i]._fpath;
      window.open(url);
    }
  }
}

  
  message: string[] = [];
  iscoversheet:boolean=true;
  isloipo:boolean=true;
  isSupport:boolean=true;


	onSelect(event,types) {
    this.progress = 0;
    if(types == "coversheet")
       {
        
        if(this.coversheetfiles.length >= 1)
        {
         // alert("Kindly upload only one Coversheet file");
         this._mesgBox.showError("Kindly upload only one Coversheet file");
          return false;
        }
        else{
          this.coversheetfiles.push(...event.addedFiles);
          this.iscoversheet = !this.iscoversheet;
        }
        
        // this.files = this.coversheetfiles;
        this.updatedatafromcoversheet(event);

       }
       else if(types == "loipo")
       {
         
         if(this.loipofiles.length >= 1 )
         {
         // alert("Kindly upload only one Loi / Po file");
          this._mesgBox.showError("Kindly upload only one Loi / Po file");
          return false;
         }
         else{
        this.loipofiles.push(...event.addedFiles);
        this.isloipo = !this.isloipo;
        }
        // this.files = this.loipofiles;
       }
       else
       {
         this.isSupport = !this.isSupport;
        this.supportfiles.push(...event.addedFiles);
        // this.files = this.supportfiles;
       }
       console.log("check progrss value");
       console.log(this.progress);
		// this.files.push(...event.addedFiles);

	}
  SaveAttachmentParameter:SaveAttachmentParameter;
  uploadfiles(files:File[],types)
  {
    if(types == "coversheet")
    {
      this.iscoversheet = !this.iscoversheet;
      this.Coversheetprogress = [];
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
    const val = this.validateform();
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
      this.SupportPoprogress[i] = { value: 0, fileName: files[i].name };
    }
      
      path="";
    this._dashboardservice.uploadImage(files[i]).subscribe(
      event => {

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
         this._obfservices.obfmodel._created_by =  localStorage.getItem('UserName');
  
        }
        else if(types == "loipo")
        {
         this.loipopath = path;
         this._obfservices.ObfCreateForm.patchValue({Loiposheet: path});
         this.SaveAttachmentParameter._fname= files[i].name; 
         this.SaveAttachmentParameter._fpath = path;
         this.SaveAttachmentParameter._description = this._obfservices.ObfCreateForm.get("Loipodropdown").value;
         this._obfservices.obfmodel.Attachments.push(this.SaveAttachmentParameter);
         this._obfservices.obfmodel._is_loi_po_uploaded = "yes";
        }
        else if(types == "support")
        {
          this.supportdocpath = path;
          this._obfservices.ObfCreateForm.patchValue({Supportpath: path});
          this.SaveAttachmentParameter._fname= files[i].name; 
         this.SaveAttachmentParameter._fpath = path;
         this.SaveAttachmentParameter._description = "support";
         this._obfservices.obfmodel.Attachments.push(this.SaveAttachmentParameter);

        }
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
    }
        
        const msg = 'Could not upload the file: ' + files[i].name;
        this.message.push(msg);
      }
    );
    }
  }
    // this.validateform();
  }

	onRemove(files:File[],event) {
		console.log(event);
		files.splice(files.indexOf(event), 1);
    if(this.coversheetfiles.length == 0)
    {
      this._obfservices.ObfCreateForm.patchValue({coversheet: ""});
    }
    if(this.loipofiles.length == 0)
    {
      this._obfservices.ObfCreateForm.patchValue({Loiposheet: ""});
    }
    if(this.supportfiles.length == 0)
    {
      this._obfservices.ObfCreateForm.patchValue({Supportpath: ""});
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
      debugger;

      const wsname : string = wb.SheetNames[6];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      console.log("get values");
      console.log(ws);
    // console.log(ws.A1.h);
    this._obfservices.ObfCreateForm.patchValue({Projectname: ws.E4.h});
    this._obfservices.obfmodel._dh_project_name = ws.E4.h;
    this._obfservices.ObfCreateForm.patchValue({Customername: ws.E5.h});
    this._obfservices.obfmodel._customer_name = ws.E5.h;
    // this._obfservices.ObfCreateForm.patchValue({Solutioncategory: ws.E6.h});
    // this._obfservices.ObfCreateForm.patchValue({Otherservicesandcategories: ws.E7.h});
    // this._obfservices.ObfCreateForm.patchValue({Projecttype: ws.E5.h});
    this._obfservices.ObfCreateForm.patchValue({Opportunityid: ws.E6.h});
    this._obfservices.obfmodel._opportunity_id = ws.E6.h;
    this._obfservices.ObfCreateForm.patchValue({State: ws.E7.h});
    this._obfservices.obfmodel._dh_location = ws.E7.h;
    this._obfservices.ObfCreateForm.patchValue({Vertical: ws.E8.h});

    let value: any = ws.H3.v;
    const parsedDate: Date = new Date(value);
     //parsedDate.setHours(parsedDate.getHours() + timezoneOffset); // utc-dates
    // value = df(parsedDate, "dd/mm/yyyy");
    value =  this.datepipe.transform(parsedDate, 'yyyy/MM/dd');
    this._obfservices.ObfCreateForm.patchValue({Projectdate: value});
    var result = this.verticallist.filter(obj => {
     //  return obj.viewValue === ws.E8.h;
      return obj.viewValue === "E-Commerce";
    });
     let verticalid = parseInt(result[0].value.toString());
    //let verticalid = 2;
    this._obfservices.obfmodel._vertical_id = verticalid;

    var ressec = this.sectorlist.filter(obj =>{
      return obj.vertical_id === verticalid;
    });
    this.sectorlist = <sectors[]>ressec;
     this._obfservices.ObfCreateForm.patchValue({Verticalhead: ws.E9.w});
     var res = this.Verticalheadlist.filter(obj => {
      // return obj.viewValue === ws.E8.h;
      return obj.value === verticalid;
    });
    //let verticalheadid = res[0].vertical_head_id;
     this._obfservices.obfmodel._verticalhead_id = res[0].vertical_head_id;
    //this._obfservices.ObfCreateForm.patchValue({Verticalhead: "abc"});
    // this._obfservices.ObfCreateForm.patchValue({Sector: ws.E11.h});
    // this._obfservices.ObfCreateForm.patchValue({Subsector: ws.E12.h});
    this._obfservices.ObfCreateForm.patchValue({Projectbrief: ws.D12.h});
    this._obfservices.obfmodel._dh_desc = ws.D12.h;
    this._obfservices.ObfCreateForm.patchValue({Totalrevenue: ws.D13.w});
    this._obfservices.obfmodel._total_revenue = parseFloat(ws.D13.w.toString());
    this._obfservices.ObfCreateForm.patchValue({Totalcost: ws.F13.w});
    this._obfservices.obfmodel._total_cost = parseFloat(ws.F13.w.toString());
    this._obfservices.ObfCreateForm.patchValue({Totalmargin: ws.H13.w});
    this._obfservices.obfmodel._total_margin = parseFloat(ws.H13.w.toString().replace('%',""));
    this._obfservices.ObfCreateForm.patchValue({Totalprojectlife: ws.D14.w});
    this._obfservices.obfmodel._total_project_life = ws.D14.w;
    this._obfservices.ObfCreateForm.patchValue({IRRsurpluscash: ws.F14.w});
    this._obfservices.obfmodel._irr_surplus_cash = parseFloat(ws.F14.w.toString().replace('%',""));
    this._obfservices.ObfCreateForm.patchValue({EBT: ws.H14.w});
    this._obfservices.obfmodel._ebt = parseFloat(ws.H14.w.toString().replace('%',""));
    this._obfservices.ObfCreateForm.patchValue({Capex: ws.D15.w});
    this._obfservices.obfmodel._capex = parseFloat(ws.D15.w.toString().replace('%',""));
    this._obfservices.ObfCreateForm.patchValue({IRRborrowedfund: ws.F15.w});
    this._obfservices.obfmodel._irr_borrowed_fund = parseFloat(ws.F15.w.toString().replace('%',""));
    this._obfservices.ObfCreateForm.patchValue({Paymentterms: ws.H15.w});
    this._obfservices.obfmodel._payment_terms = parseInt(ws.H15.w.toString().replace(" Days",""));
    this._obfservices.ObfCreateForm.patchValue({Payment_Terms_description: ws.D16.h})
    this._obfservices.ObfCreateForm.patchValue({Assumptionrisks: ws.D17.h});
    this._obfservices.obfmodel._assumptions_and_risks = ws.D17.h;
    this._obfservices.ObfCreateForm.patchValue({Loipo: ws.D18.h});
    console.log("check form values");
    console.log(this._obfservices.ObfCreateForm);
    this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

     console.log("MAin DATa: "+this.data);

     let x = this.data.slice(1);
      console.log("Sliced DATA"+x);

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
    this._obfservices.obfmodel._dh_phase_id =1;
    this._obfservices.obfmodel._parent_dh_main_id = 0;
    this._obfservices.obfmodel._active = "A";
    this._obfservices.obfmodel._status ="A";
    this._obfservices.obfmodel._is_saved =1;
    this._obfservices.obfmodel._is_submitted = 0;
    this._obfservices.obfmodel._mode = "insert";
    this._obfservices.obfmodel._service_category = "";
    if(type == "details")
    {
      if(this._obfservices.obfmodel._dh_id === 0)
      {
        this._obfservices.obfmodel.save_with_solution_sector = "Y";
        
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
        // alert("Documents uploaded Successfully");
        this._mesgBox.showSucess("Documents uploaded Successfully");
      }
      else{
       // alert("Technical error while uploading documents");
        this._mesgBox.showError("Technical error while uploading documents");
      }
      },
      (error:HttpErrorResponse)=>{
        this._mesgBox.showError(error.message);
        //alert(error.message);
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
        }
        else{
          // alert("Technical error while updating details");
          this._mesgBox.showError("Technical error while updating details");
        }
        // this._obfservices.obfmodel._dh_header_id = res.dh_header_id;
        // this._obfservices.obfmodel._dh_id = res.dh_id;
      },
      (error:HttpErrorResponse)=>{
        this._mesgBox.showError(error.message);
        //alert(error.message);
      })
    }
    this.servicecate= this._obfservices.obfmodel.Services[0].Solutioncategory;
    for(let i=0 ;i<this._obfservices.obfmodel.Services[0].Serviceslist.length ; i++)
    {
     this.service = this.service+','+ this._obfservices.obfmodel.Services[0].Serviceslist[i].viewValue;
    
    }
    this.service= this.service.substring(1)
    var temp= this.sectorlist.filter(x=>x.value==this._obfservices.obfmodel._Sector_Id);
    this.visiblesector = temp[0].viewValue

    var tempsector=this.subsectorlisdisplay.filter(x=>x.value==this._obfservices.obfmodel._SubSector_Id);
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
        this._mesgBox.showSucess("Documents uploaded Successfully");
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
     }
     else{
      this.supportchecked =true;
      this._obfservices.ObfCreateForm.get('Supportpath').clearValidators();
      this._obfservices.ObfCreateForm.get('Supportpath').updateValueAndValidity();
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
      this._obfservices.obfmodel._is_loi_po_uploaded = "no";
    }
    else{
      this._obfservices.ObfCreateForm.get('Loiposheet').setValidators(Validators.required)
      this._obfservices.ObfCreateForm.get('Loiposheet').updateValueAndValidity();
      this.loiopdisabled = false;
      this._obfservices.obfmodel._is_loi_po_uploaded = "yes";
    }
  }

  // GridBinding()
  //   {
  //     debugger;
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
    debugger;
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
    if(this._obfservices.ObfCreateForm.get('Projectname').errors)
    {
      //alert("Project name is required");
      this._mesgBox.showError("Project name is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Customername').errors)
    {
     // alert("Customer name is required");
      this._mesgBox.showError("Customer name is required");
      return false;
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
    else if(this._obfservices.ObfCreateForm.get('Opportunityid').errors)
    {
     // alert("Opportunityid is required");
      this._mesgBox.showError("Opportunityid is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('State').errors)
    {
      //alert("Project primay location is required");
      this._mesgBox.showError("Project primay location is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Vertical').errors)
    {
     // alert("Vertical field is required");
     this._mesgBox.showError("Vertical field is required");
      return false;
    }
    // else if(this._obfservices.ObfCreateForm.get('Sector').errors)
    // {
    //   alert("Sector field is required");
    //   return false;
    // }
    else if(this._obfservices.ObfCreateForm.get('Verticalhead').errors)
    {
     // alert("Vertical head field is required");
      this._mesgBox.showError("Vertical head field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Projectbrief').errors)
    {
     // alert("Project brief is required");
     this._mesgBox.showError("Project brief is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Totalrevenue').errors)
    {
      //alert("Total revenue field is required");
      this._mesgBox.showError("Total revenue field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Totalcost').errors)
    {
     // alert("Total cost field is required");
       this._mesgBox.showError("Total cost field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Totalmargin').errors)
    {
      // alert("Total margin field is required");
      this._mesgBox.showError("Total margin field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Totalprojectlife').errors)
    {
     // alert("Total project life field is required");
     this._mesgBox.showError("Total project life field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Capex').errors)
    {
      //alert("Capex field is required");
      this._mesgBox.showError("Capex field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Paymentterms').errors)
    {
     // alert("Payment terms field is required");
     this._mesgBox.showError("Payment terms field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Assumptionrisks').errors)
    {
     // alert("Assumption and risks  field is required");
     this._mesgBox.showError("Assumption and risks  field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Loipo').errors)
    {
     // alert("Loi / po  field is required");
      this._mesgBox.showError("Loi / po  field is required");
      return false;
    }
    return true;
  }

  onchange(evt,solutioncategory)
  {
    if(evt.isUserInput){
    this.Solutionservicesarray = [];
    //alert("hello world");
    console.log(evt);
    var result = this.Solutiongroup.filter(obj => {
      return obj.Solutioncategory === solutioncategory;
    });
    this.Solutionservicesarray = result[0].Solutionservices;
    this._obfservices.ObfCreateForm.patchValue({Solutioncategory: evt.source.value});
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


  }

  onsubsectorchange(evt)
  {
    this._obfservices.obfmodel._SubSector_Id = evt.value;
  }

  otherssave(type:string){
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
      value =  this._obfservices.ObfCreateForm.get('integratedsolution').value;
    }
      let res = this.serviceslist.filter(obj => {
        // return obj.viewValue === ws.E8.h;
        return obj.value === solid;
      });
      let elements:Serviceslist = new Serviceslist("0",value);
      res[0].Serviceslist.push(elements);
    
  }
  SavetoModel(){
this._obfservices.obfmodel._dh_comment = this._obfservices.ObfCreateForm.get("comments").value;

  }
  FinalSubmit()
  {
    console.log(this._obfservices.obfmodel);
    this._obfservices.obfmodel._dh_phase_id =1;
    this._obfservices.obfmodel._parent_dh_main_id = 0;
    this._obfservices.obfmodel._active = "A";
    this._obfservices.obfmodel._status ="A";
    this._obfservices.obfmodel._is_saved =1;
    this._obfservices.obfmodel._is_submitted = 1;
    this._obfservices.obfmodel._mode = "insert";
    this._obfservices.obfmodel._service_category = "";
    if(this._obfservices.obfmodel._dh_id === 0)
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
        // alert("Documents uploaded Successfully");
        this._mesgBox.showSucess("Documents uploaded Successfully");
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
        }
        else{
          //alert("Technical error while updating details");
          this._mesgBox.showError("Technical error while updating details");
        }
        // this._obfservices.obfmodel._dh_header_id = res.dh_header_id;
        // this._obfservices.obfmodel._dh_id = res.dh_id;
      },
      (error:HttpErrorResponse)=>{
        this._mesgBox.showError(error.message);
        //alert(error.message);
      })
    }
    
    }

  }

  //Ankita code
 
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

}
