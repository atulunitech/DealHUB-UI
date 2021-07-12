import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-type',
  templateUrl: './project-type.component.html',
  styleUrls: ['./project-type.component.scss']
})
export class ProjectTypeComponent implements OnInit {
  masterType = "Project Type";
  constructor() { }

  ngOnInit(): void {
  }

}
