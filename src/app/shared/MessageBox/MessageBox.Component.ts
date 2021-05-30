import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-messgae',
  templateUrl: './MessageBox.Component.html',
  styleUrls: ['./MessageBox.Component.scss']
})
export class MessageBoxComponent implements OnInit {

  showsuccess:boolean=false;
  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  
  showSucess(content) {
    this.showsuccess=true;
    this._snackBar.openFromComponent(MessageBoxComponent, {
      duration:1000,
      verticalPosition: 'top',
      horizontalPosition:'right',
     
    });
    
  }

    // this._snackBar.open(content,'X', {
    //   duration: 1000,
    //   verticalPosition: 'top',
    //   horizontalPosition:'right',
    //   panelClass:"custom_sneak_bar"
    // });
  
  showUpdate(content) {
    this._snackBar.open(content,'X', {
      duration: 1000,
      verticalPosition: 'top',
      horizontalPosition:'right',
      panelClass:"custom_sneak_bar"
    });
  }
  showError(content) {
    let sb =this._snackBar.open(content,'X', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition:'right',
      panelClass:"custom_error_sneak_bar"
    });

    sb.onAction().subscribe(() => {
      sb.dismiss();
    });
  }


}
