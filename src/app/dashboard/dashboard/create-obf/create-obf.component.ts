import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { DashboardService } from '../../dashboard.service';
import {DomSanitizer} from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OBFServices } from '../../services/obfservices.service';
import {​​​​​​​​ MatTableModule ,MatTableDataSource}​​​​​​​​ from'@angular/material/table';
import {​​​​​​​​ MatDialog }​​​​​​​​ from'@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TemplateRef } from '@angular/core';

@Component({
  selector: 'app-create-obf',
  templateUrl: './create-obf.component.html',
  styleUrls: ['./create-obf.component.scss']
})

export class CreateOBFComponent implements OnInit {
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
  ProjectDetails: MatTableDataSource<any>;

  readMore = false;
  BrifreadMore=false;
      @ViewChild(MatSort) sort: MatSort;
      @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    constructor(private _dashboardservice:DashboardService,private sanitizer:DomSanitizer,public _obfservices:OBFServices,private dialog:MatDialog) { }

    ngOnInit(): void {
        this._obfservices.ObfCreateForm.reset();
      }

      sanitize(url:string){
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    files: File[] = [];
    coversheetfiles: File[] = [];
    loipofiles: File[] = [];
    supportfiles: File[] = [];        
  
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
        this.ProjectDetails.sort = this.sort;
        this.ProjectDetails.paginator = this.paginator;
        }
        
       
}