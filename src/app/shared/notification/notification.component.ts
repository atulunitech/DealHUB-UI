import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
 

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(public commonService:CommonService) { }

  ngOnInit(): void {
    this.Get_System_Notification();
  }

  not_view()
  {
   // this.Get_System_Notification();
    this.commonService.notification();
   // this.Get_System_Notification();
  }
  
  Get_System_Notification()
  {
   
    this.commonService.Get_System_Notification(localStorage.getItem("UserCode")).subscribe(data=>{
      console.log(data);
      var jsonresult=JSON.parse(data);
      this.commonService.initializeNotification(JSON.parse(data));
     
      //alert("notifcation called");

    })
  }
}
