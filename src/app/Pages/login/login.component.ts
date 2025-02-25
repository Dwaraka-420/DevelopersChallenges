import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AppComponent } from "../../app.component";
import { FormsModule } from '@angular/forms';
import { environment } from '../../../config';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  //baseUrl = environment.baseUrl;

  logiobj: any ={
    username: '',
    password: ''
  }

  http= inject(HttpClient);
  router= inject(Router);

  OnLogin() {
    debugger;
    this.http.post('https://localhost:7103/api/Auth/login', this.logiobj).subscribe((res: any) => {
        if(res.success) {
          localStorage.setItem('username', this.logiobj.username);
          sessionStorage.setItem('token', res.token) // Store the username in local storage
          alert('Login Success');
          this.router.navigateByUrl('dashboard')
        } else {
          alert('Login Failed');
        }
      })
  }
}