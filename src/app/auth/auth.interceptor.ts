import { HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent, HttpErrorResponse,HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import {catchError,map, tap} from "rxjs/operators";



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }
  
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        debugger;
        if (req.headers.get('No-Auth') == "True")
        {
            return next.handle(req.clone());
        }
        else
        {
            if (localStorage.getItem('userToken') != null) {
                const headers = new HttpHeaders({
                    'Authorization': "Bearer " + localStorage.getItem('Token'),
                    '_user_login': localStorage.getItem("UserName")
                  });
                const clonedreq = req.clone({
                    //headers: req.headers.set("Authorization", "Bearer " + localStorage.getItem('Token'))
                    headers
                });
                return next.handle(clonedreq).pipe(
                    tap(
                      (error:any) => {
                        // if (error.status === 401)
                        console.log("redirected here even token is not null");
                        console.log(clonedreq);
                        console.log(error);
                        console.log(error.type);
                      
                        if (error instanceof HttpErrorResponse) {
                            if (error.status != 200) {
                                //this.router.navigateByUrl('/login');
                            }
                          }

                           
                    }
                    )
                  );
            }
            else {
                console.log("redirected here as usertoken is null");
                // this.router.navigateByUrl('/login');
            }
        }
         

        
    }
}