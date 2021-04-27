import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-backend-header',
  templateUrl: './backend-header.component.html',
  styleUrls: ['./backend-header.component.scss']
})
export class BackendHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  menu_status: boolean = false;
  menuevent(){
    this.menu_status = !this.menu_status;       
}



}
