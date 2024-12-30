import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [CommonModule, RouterOutlet, FormsModule],
  selector: 'app-submitted-challenges', // Corrected to match the component name
  templateUrl: './submited-challenges.component.html', // Corrected the file reference
  styleUrls: ['./submited-challenges.component.scss'] // Corrected the file reference
})
export class SubmittedChallengesComponent implements OnInit { // Added OnInit interface
  submittedChallenges: any[] = []; // Array to hold challenges fetched from the API
  isLoading: boolean = true; // Loading indicator
  errorMessage: string = ''; // Error message if the API call fails
  username: string | null = '';

  http = inject(HttpClient); // Injecting HttpClient

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
    this.http
      .get(`https://localhost:7103/api/Api/ChallengesByUser?username=${username}`)
      .subscribe({
        next: (response: any) => {
          this.submittedChallenges = response; // Assign fetched data to the array
          this.isLoading = false; // Stop loading spinner
        },
        error: (error) => {
          console.error('Error fetching submitted challenges:', error); // Handle API error
          this.errorMessage = 'Failed to load submitted challenges.'; // Display error message
          this.isLoading = false;
        }
      });
  }
}
