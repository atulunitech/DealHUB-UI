import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }
  menu_status: boolean = false;
  notification_view: boolean = false;
  menuevent(){
    this.menu_status = !this.menu_status;       
}

notification()
{
  this.notification_view = !this.notification_view;
}
}
