import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-backend-header',
  templateUrl: './backend-header.component.html',
  styleUrls: ['./backend-header.component.scss']
})
export class BackendHeaderComponent implements OnInit {

  constructor(public commonService:CommonService) { }
  UserName:string="";
  RoleName:string="";
  ngOnInit(): void {
    this.UserName=localStorage.getItem("UserName");
    this.RoleName=localStorage.getItem("role_name");
  }

 
  hamev()
  {
    this.commonService.menuevent();
  }

  not_view()
  {
    this.commonService.notification();
  }

}
