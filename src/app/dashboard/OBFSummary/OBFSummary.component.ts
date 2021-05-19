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
import { Router } from '@angular/router';
@Component({
    selector: 'app-obfSummary',
    templateUrl: './OBFSummary.component.html',
    styleUrls: ['./OBFSummary.component.scss']
  })

  export class OBFSummaryComponent implements OnInit {


    constructor(private sanitizer:DomSanitizer,
        public _obfservices:OBFServices,private dialog:MatDialog,private _mesgBox: MessageBoxComponent,private datepipe: DatePipe,private router: Router) 
      { }
      
  ngOnInit(): void {
    
  }
  }