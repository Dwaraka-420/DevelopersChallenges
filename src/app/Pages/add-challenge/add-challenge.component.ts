import { Component, Output, EventEmitter, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, Router } from '@angular/router';
import { environment } from '../../../config';

@Component({
  selector: 'app-add-challenge',
  imports: [RouterOutlet,FormsModule],
  templateUrl: './add-challenge.component.html',
  styleUrl: './add-challenge.component.scss'
})
export class AddChallengeComponent {
  challenge = {
    title: '',
    description: '',
    category: '',
    username: ''
  };
  logiobj: any = {};
  baseUrl = environment.baseUrl;

  @Output() challengeAdded = new EventEmitter<any>();

  entobj: any = {
    Title: '',
    Description: '',
    CreatedBy: '',
    Category: ''
  }

  ngOnInit(): void {

    // Set username in localStorage from login object
    if (this.logiobj.username) {
      localStorage.setItem('username', this.logiobj.username);

    }
      // Set username in localStorage from login object
      if (this.logiobj.username) {
        localStorage.setItem('username', this.logiobj.username);
      }
    }

  

  http= inject(HttpClient);
  router= inject(Router);

  
  OnSubmit() {
    debugger;
  
    // Add the username from localStorage
    const username = localStorage.getItem('username');
    if (username) {
      this.entobj.CreatedBy = username; // Add username to the payload
    }
  
    // Add the current date
    const currentDate = new Date().toISOString(); // ISO format for date-time
    this.entobj.createdAt = currentDate;
  
    // Make the POST request
    this.http.post(`${this.baseUrl}/api/Api/AddChallenge`, this.entobj).subscribe((res: any) => {
      if (res.success) {
        this.mailsending(); // Call mail sending logic
        alert('Challenge added successfully');
        this.router.navigateByUrl('/layout'); // Navigate to another page
      } else {
        alert('Failed to add challenge');
      }
    });
  }
  
  mailsending() {
    this.http.get(`${this.baseUrl}/api/Aws/get-secret`).subscribe((res: any) => {
      if(res.success) {
        alert('Mail sent successfully');
      }
      else {
        alert('Failed to send mail');
      }
    })
  }

}
