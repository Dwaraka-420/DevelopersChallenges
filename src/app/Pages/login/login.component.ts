import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AppComponent } from "../../app.component";
import { FormsModule } from '@angular/forms';
import { environment } from '../../../config';
import { AuthService } from '../../services/auth.service';

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
  authService = inject(AuthService);

  OnLogin() {
    debugger;
    this.http.post('https://localhost:7103/api/Auth/login', this.logiobj).subscribe((res: any) => {
        if(res.success) {
          // Store both username and token
          this.authService.setUsername(this.logiobj.username);
          
          // Store the JWT token from the response
          // The token might be in res.token, res.data.token, or res.accessToken
          // Adjust the property name based on your API response structure
          if (res.token) {
            this.authService.setToken(res.token);
          } else if (res.data && res.data.token) {
            this.authService.setToken(res.data.token);
          } else if (res.accessToken) {
            this.authService.setToken(res.accessToken);
          }
          
          alert('Login Success');
          this.router.navigateByUrl('dashboard')
        } else {
          alert('Login Failed');
        }
      })
  }
}
