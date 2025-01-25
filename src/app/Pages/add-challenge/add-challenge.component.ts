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
    category: ''
  };
  baseUrl = environment.baseUrl;

  @Output() challengeAdded = new EventEmitter<any>();

  onSubmit() {
    if (this.challenge.title && this.challenge.description && this.challenge.category) {
      this.challengeAdded.emit(this.challenge);
      this.challenge = { title: '', description: '', category: '' }; // Reset form
    }
  }

  entobj: any = {
    Title: '',
    Description: '',
    CreatedBy: '',
    Category: ''
  }

  http= inject(HttpClient);
  router= inject(Router);

  OnSubmit() {
    debugger;
      this.http.post(`${this.baseUrl}/api/Api/AddChallenge`, this.entobj).subscribe((res:any) => {
        if(res.success) {
          this.mailsending();
          alert(res); // Display the plain text response
          this.router.navigateByUrl('/layout');
        } else {
          alert('Failed to add challenge');
        }
      })

  }
  mailsending() {
    this.http.get(`${this.baseUrl}/api/AwsAuthentication/get-secret`).subscribe((res: any) => {
      if(res.success) {
        alert('Mail sent successfully');
      }
      else {
        alert('Failed to send mail');
      }
    })
  }

}
