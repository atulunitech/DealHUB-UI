import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-messgae',
  templateUrl: './MessageBox.Component.html',
  styleUrls: ['./MessageBox.Component.scss']
})
export class MessageBoxComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  
  showSnackbar(content) {
    this._snackBar.open(content,'', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition:'right',
      panelClass:"custom_sneak_bar"
    });
  }

}
