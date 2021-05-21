import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit,AfterViewInit, ViewChild } from '@angular/core';
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
import { Router } from '@angular/router';

@Component({
    selector: 'app-obfSummary',
    templateUrl: './OBFSummary.component.html',
    styleUrls: ['./OBFSummary.component.scss']
  })

  export class OBFSummaryComponent implements OnInit,AfterViewInit {
    readMore = false;
    BrifreadMore=false;
    paymentRead=false;
    comments = new FormControl('', Validators.required);
    step=0;
    service:string;
    constructor(private sanitizer:DomSanitizer,
        public _obfservices:OBFServices,private dialog:MatDialog,

        private _mesgBox: MessageBoxComponent,private datepipe: DatePipe,private router: Router) 
      { 

        this._obfservices.Obfsummarysubject.subscribe(data=>{
          console.log(data +" :data");
        });
      }
      
  ngOnInit(): void {
   
    console.log(this._obfservices.obfsummarymodel);
    this.getserviceslist();
  }
  ngAfterViewInit(){
    this._obfservices.getobfsummarydataonRefresh().subscribe(data=>{
      console.log(data +" :data on nginit");
    });
  }
  getserviceslist()
  {
 
    var Tempservice="";
    for(let i=0 ;i<this._obfservices.obfsummarymodel.solutionDetails.length ; i++)
    {
      Tempservice += ','+ this._obfservices.obfsummarymodel.solutionDetails[i].solution_name;
      
    //   for(let t=0;t < this._obfservices.obfmodel.Services[i].Serviceslist.length;t++)
    //   {
    //     if(Tempservice == this._obfservices.obfmodel.Services[i].Solutioncategory)
    //     {
          
    //       tempservicecat += ','+ this._obfservices.obfmodel.Services[i].Serviceslist[t].viewValue;
    //     }
    //   }
    
    //  tempservicecat=tempservicecat.substring(1);
    //  finalservicecat += " "+ Tempservice +"-"+ tempservicecat +".";
     
    }
    this.service=Tempservice;
     this.service = this.service.substring(1);
   
  }
  
  ApproveDeatils()
  {
    this._obfservices._approveRejectModel.isapproved=1;
    this._obfservices._approveRejectModel.rejectcomment="";
    this._obfservices._approveRejectModel.rejectionto=0;
    this._obfservices._approveRejectModel._dh_id=this._obfservices.obfsummarymodel.uploadDetails[0].dh_id;
    this._obfservices._approveRejectModel._dh_header_id=this._obfservices.obfsummarymodel.uploadDetails[0].dh_header_id;
    this._obfservices._approveRejectModel._fname="";
    this._obfservices._approveRejectModel._fpath="";
    this._obfservices._approveRejectModel._created_by=localStorage.getItem("user_id");
    this._obfservices.ApproveRejectObf(this._obfservices._approveRejectModel).subscribe(data=>{
    
      if(data.status =="sucess")
      {
        this._mesgBox.showSucess(data.message);
      }
      else{
        this._mesgBox.showError(data.message);
      }
    });
  }
  
  // setStep(index: number) {
  //   this.step = index;
  // }


  }