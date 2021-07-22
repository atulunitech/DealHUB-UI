import { Component, OnInit } from '@angular/core';
import { MasterService } from '../services/master.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-type',
  templateUrl: './project-type.component.html',
  styleUrls: ['./project-type.component.scss']
})

export class ProjectTypeComponent implements OnInit {
  masterType = "Project Type";
 
  constructor(private MasterService: MasterService,private router: Router) { }

  ngOnInit(): void {
    this.getMaster();
  }
  getMaster() {
    this.MasterService.getMaster().subscribe(
      result => {
        console.log("atul",result);
      }
    )
  }
}
