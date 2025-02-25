import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../config';


@Component({
  imports: [CommonModule, RouterOutlet, FormsModule,RouterOutlet,RouterModule],
  selector: 'app-submitted-challenges', // Corrected to match the component name
  templateUrl: './submited-challenges.component.html', // Corrected the file reference
  styleUrls: ['./submited-challenges.component.scss'] // Corrected the file reference
})
export class SubmittedChallengesComponent implements OnInit { // Added OnInit interface
  baseUrl = environment.baseUrl; // Base URL for the API
  submittedChallenges: any[] = []; // Array to hold challenges fetched from the API
  isLoading: boolean = true; // Loading indicator
  errorMessage: string = ''; // Error message if the API call fails
  username: string | null = '';
  http = inject(HttpClient); // Injecting HttpClient
  router = inject(Router); // Injecting Router

  ngOnInit(): void {
    debugger;
    this.username = localStorage.getItem('username'); // Fetching username from local storage
    if (this.username) {
      this.fetchSubmittedChallenges(this.username); // Calling the method to fetch challenges
    } else {
      console.error('Username not found in localStorage.'); // Handle missing username
      this.isLoading = false;
    }
  }

  fetchSubmittedChallenges(username: string): void {
    // Get token from sessionStorage
    const token = sessionStorage.getItem('token');

    // Create headers with Authorization token
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`, // ✅ Include Bearer Token
        'Content-Type': 'application/json'  // ✅ Ensure correct Content-Type
    });

    this.http
      .get(`${this.baseUrl}/api/Api/ChallengesByUser?username=${username}`, { headers })
      .subscribe({
        next: (response: any) => {
          this.submittedChallenges = response; // Assign fetched data to the array
          this.isLoading = false; // Stop loading spinner
        },
        error: (error) => {
          console.error('Error fetching submitted challenges:', error); // Handle API error
          
          if (error.status === 401) {
            alert('Session expired. Please log in again.');
            sessionStorage.removeItem("token"); // Clear token on unauthorized error
            window.location.href = "/login"; // Redirect to login page
          }
          this.errorMessage = 'Failed to load submitted challenges.'; // Display error message
          this.isLoading = false;
        }
      });
  }

  navigateToChallengeDetails(challengeId: string): void {
    this.router.navigate(['/layout/reply', challengeId]);
  }
}
