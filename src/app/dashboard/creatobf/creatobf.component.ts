import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { DashboardService } from '../dashboard.service';
import {DomSanitizer} from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OBFServices } from '../services/obfservices.service';
import {​​​​​​​​ MatTableModule ,MatTableDataSource}​​​​​​​​ from'@angular/material/table';
import {​​​​​​​​ MatDialog }​​​​​​​​ from'@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TemplateRef } from '@angular/core';

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
 
  pokemonControl = new FormControl();
  Solutionservicesarray:Solutionservices[] =[];
  Subsecotarray:subsecorlist[] =[];
  serviceslist:SaveServiceParameter[] = [];
  Sectorgrouparray:SectotGroup[] = [
    {
      value:'Online Marketplace',
      viewValue:'Online Marketplace',
      subsecorlist:[{value:'Multi-category',viewValue:'Multi-category'},
                    {value:'Single category',viewValue:'Single category'},
                    {value:'Other',viewValue:'Other'}
                   ]
    },
    {
      value:'Online Retail',
      viewValue:'Online Retail',
      subsecorlist:[{value:'Online Retail',viewValue:'Online Retail'},
                    {value:'Other',viewValue:'Other'}
                   ]
    }
    ,
    {
      value:'Food and Hyperlocal',
      viewValue:'Food and Hyperlocal',
      subsecorlist:[{value:'Food and Hyperlocal',viewValue:'Food and Hyperlocal'},
                    {value:'Other',viewValue:'Other'}
                   ]
    },
    {
      value:'Other',
      viewValue:'Other',
      subsecorlist:[
                    {value:'Other',viewValue:'Other'}
                   ]
    }
  ];
  Solutiongroup: Solutiongroup[] =[];

  constructor(private _dashboardservice:DashboardService,private sanitizer:DomSanitizer,public _obfservices:OBFServices) 
  { }
  files: File[] = [];
  coversheetfiles: File[] = [];
  loipofiles: File[] = [];
  supportfiles: File[] = [];        
  step = 0;
  panelOpenState:boolean=true;
  verticallist:verticallist[]=[];
  Verticalheadlist:Verticalhead[];

  ngOnInit(): void {
    this._obfservices.ObfCreateForm.reset();
    this._obfservices.obfmodel._dh_id =0;
    this._obfservices.obfmodel._dh_header_id =0;
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
         this.sectorlist = res.sectors;
         this.subsectorlist = res.subsector;
         this.verticallist =res.vertical;
         this.Verticalheadlist = res.verticalhead;
   });
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
  alert(error.message);
}
);
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

onSelect(event,types) {
    debugger;
    if(types == "coversheet")
       {
        
        if(this.coversheetfiles.length > 1)
        {
          alert("Kindly upload only one Coversheet file");
          return false;
        }
        else{
          this.coversheetfiles.push(...event.addedFiles);
        }
        // this.files = this.coversheetfiles;
        this.updatedatafromcoversheet(event);
        
       }
       else if(types == "loipo")
       {
         if(this.loipofiles.length > 1 )
         {
          alert("Kindly upload only one Loi / Po file");
          return false;
         }
         else{
        this.loipofiles.push(...event.addedFiles);
        }
        // this.files = this.loipofiles;
       }
       else
       {
        this.supportfiles.push(...event.addedFiles);
        // this.files = this.supportfiles;
       }
        // this.files.push(...event.addedFiles);
     
    }

  uploadfiles(files:File[],types)
  {
    this._dashboardservice.uploadImage(files).subscribe(
      event => {
        var path="";
        if(event.type === HttpEventType.UploadProgress)
        {
          console.log('Upload Progress: '+Math.round(event.loaded/event.total * 100) +"%");
          this.progress = Math.round(event.loaded/event.total * 100);
        }
        else if(event.type === HttpEventType.Response)
        {
        console.log(event.body);
        path = JSON.stringify(event.body);
      }
      debugger;
      path=path.split('"').join('');
      path = path.substring(0,path.length -1);
      if(types == "coversheet")
      {
       this.coversheetpath = path;
       this._obfservices.ObfCreateForm.patchValue({coversheet: path});
      }
      else if(types == "loipo")
      {
       this.loipopath = path;
       this._obfservices.ObfCreateForm.patchValue({Loiposheet: path});
      }
      else if(types == "support")
      {
        this.supportdocpath = path;
        this._obfservices.ObfCreateForm.patchValue({Supportpath: path});
      }
       
      }
    );

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

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      debugger;

      const wsname : string = wb.SheetNames[6];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    // console.log(ws.A1.h);
    this._obfservices.ObfCreateForm.patchValue({Projectname: ws.E4.h});
    this._obfservices.ObfCreateForm.patchValue({Projecttype: ws.E5.h});
    this._obfservices.ObfCreateForm.patchValue({Opportunityid: ws.E6.h});
    this._obfservices.ObfCreateForm.patchValue({State: ws.E7.h});
    this._obfservices.ObfCreateForm.patchValue({Vertical: ws.E8.h});
    this._obfservices.ObfCreateForm.patchValue({Verticalhead: ws.E9.h});
    this._obfservices.ObfCreateForm.patchValue({Projectbrief: ws.D12.v});
    this._obfservices.ObfCreateForm.patchValue({Totalrevenue: ws.D13.w});
    this._obfservices.ObfCreateForm.patchValue({Totalcost: ws.F13.w});
    this._obfservices.ObfCreateForm.patchValue({Totalmargin: ws.H13.w});
    this._obfservices.ObfCreateForm.patchValue({Totalprojectlife: ws.D14.w});
    this._obfservices.ObfCreateForm.patchValue({IRRsurpluscash: ws.F14.w});
    this._obfservices.ObfCreateForm.patchValue({EBT: ws.H14.w});
    this._obfservices.ObfCreateForm.patchValue({Capex: ws.D15.w});
    this._obfservices.ObfCreateForm.patchValue({IRRborrowedfund: ws.F15.w});
    this._obfservices.ObfCreateForm.patchValue({Paymentterms: ws.D16.w});
    this._obfservices.ObfCreateForm.patchValue({Assumptionrisks: ws.D17.w});
    this._obfservices.ObfCreateForm.patchValue({Loipo: ws.D18.w});
     console.log(ws);

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

  Saveasdraft(){
     console.log(this._obfservices.ObfCreateForm.value);
       }

  onCheckboxChange(e) {
    if(e.currentTarget.checked)
    {
      this._obfservices.ObfCreateForm.get('Loiposheet').clearValidators();
      this._obfservices.ObfCreateForm.get('Loiposheet').updateValueAndValidity();
      this._obfservices.ObfCreateForm.patchValue({Loiposheet: ""});
      this.loipofiles.length=0;
      this.loiopdisabled = true;
    }
    else{
      this._obfservices.ObfCreateForm.get('Loiposheet').setValidators(Validators.required)
      this._obfservices.ObfCreateForm.get('Loiposheet').updateValueAndValidity();
      this.loiopdisabled = false;
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
  
  onchange(evt)
  {
    
    console.log(evt);
    var result = this.Solutiongroup.filter(obj => {
      return obj.Solutioncategory === evt.value;
    });
    this.Solutionservicesarray = result[0].Solutionservices;
    this._obfservices.ObfCreateForm.patchValue({Solutioncategory: evt.value});


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
sector:string="";
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
  this.sector=evt.viewValue;

}

subsector:string="";
  onsubsectorchange(evt)
  {
    this._obfservices.obfmodel._SubSector_Id = evt.value;
    this.subsector=evt.viewValue;

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
  FinalSubmit()
  {
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
        alert("Documents uploaded Successfully");
      }
      else{
        alert("Technical error while uploading documents");
      }
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
        if(res[0].status == "Success"){
           this._obfservices.obfmodel._dh_header_id = res[0].dh_header_id;
           this._obfservices.obfmodel._dh_id = res[0].dh_id;
          alert("Details updated Successfully");
        }
        else{
          alert("Technical error while updating details");
        }
        // this._obfservices.obfmodel._dh_header_id = res.dh_header_id;
        // this._obfservices.obfmodel._dh_id = res.dh_id;
      })
    }
    
    }

  }
  validateform()
  {
    if(this._obfservices.ObfCreateForm.get('Projectname').errors)
    {
      alert("Project name is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Customername').errors)
    {
      alert("Customer name is required");
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
      alert("Opportunityid is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('State').errors)
    {
      alert("Project primay location is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Vertical').errors)
    {
      alert("Vertical field is required");
      return false;
    }
    // else if(this._obfservices.ObfCreateForm.get('Sector').errors)
    // {
    //   alert("Sector field is required");
    //   return false;
    // }
    else if(this._obfservices.ObfCreateForm.get('Verticalhead').errors)
    {
      alert("Vertical head field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Projectbrief').errors)
    {
      alert("Project brief is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Totalrevenue').errors)
    {
      alert("Total revenue field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Totalcost').errors)
    {
      alert("Total cost field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Totalmargin').errors)
    {
      alert("Total margin field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Totalprojectlife').errors)
    {
      alert("Total project life field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Capex').errors)
    {
      alert("Capex field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Paymentterms').errors)
    {
      alert("Payment terms field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Assumptionrisks').errors)
    {
      alert("Assumption and risks  field is required");
      return false;
    }
    else if(this._obfservices.ObfCreateForm.get('Loipo').errors)
    {
      alert("Loi / po  field is required");
      return false;
    }
    return true;
  }

  // prevStep(section) {
  //   if(section == "details")
  //   {
  //     this._obfservices.ObfCreateForm.get('Solutioncategory').clearValidators();
  //     this._obfservices.ObfCreateForm.get('Solutioncategory').updateValueAndValidity();
  //     this._obfservices.ObfCreateForm.get('Otherservicesandcategories').clearValidators();
  //     this._obfservices.ObfCreateForm.get('Otherservicesandcategories').updateValueAndValidity();
  //   }
  //   this.step--;
  // }
}
