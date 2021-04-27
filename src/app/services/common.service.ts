import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }
  menu_status: boolean = false;
  menuevent(){
    this.menu_status = !this.menu_status;       
}
}
