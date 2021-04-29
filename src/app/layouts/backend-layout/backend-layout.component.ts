import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-backend-layout',
  templateUrl: './backend-layout.component.html',
  styleUrls: ['./backend-layout.component.scss']
})
export class BackendLayoutComponent implements OnInit {

  constructor(public commonService:CommonService) { }

  ngOnInit(): void {
  }

 
}
