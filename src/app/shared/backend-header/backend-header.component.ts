import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-backend-header',
  templateUrl: './backend-header.component.html',
  styleUrls: ['./backend-header.component.scss']
})
export class BackendHeaderComponent implements OnInit {

  constructor(public commonService:CommonService) { }

  ngOnInit(): void {
  }

 
  hamev()
  {
    this.commonService.menuevent();
  }


}
