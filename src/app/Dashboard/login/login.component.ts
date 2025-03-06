import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent  implements OnInit {
  loginForm!: FormGroup;
  constructor(private _AuthService:AuthService,private _Router:Router){
    _AuthService.isAdminLoggedIn.subscribe((res)=>{
      this.isAdminLoggedIn = res;
    });


  }    
  isAdminLoggedIn :boolean = false;
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // console.log(this.contactForm.value);
      this._AuthService.login(this.loginForm.value).subscribe({
        next:(res)=>{
          console.log("Success")
          this._Router.navigate(['/admin-dashboard'])
          localStorage.setItem("adminToken",res.token);
          this._AuthService.isAdminLoggedIn.next(true);
        },
        error:(err)=>{
          console.log("Error")
          console.log(err);
        }
      })
    }
  }

}
