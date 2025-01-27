import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { environment } from '../../../config';

@Component({
  selector: 'app-replay',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './replay.component.html',
  styleUrls: ['./replay.component.scss']
})
export class ReplayComponent implements OnInit {
  baseUrl = environment.baseUrl; // Base URL for the API
  challenge: any = {}; // Store challenge details
  replays: any[] = []; // Store replays for the challenge
  isLoading: boolean = true;
  errorMessage: string = '';
  showReplyBox = false;
  replyText: string = '';
  logiobj: any = {}; // Object to store login details

  toggleReplyBox(): void {
    this.showReplyBox = !this.showReplyBox;
  }

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Get the id parameter
    if (id) {
      this.fetchChallengeDetails(id);
      this.fetchReplays(id);

    // Set username in localStorage from login object
    if (this.logiobj.username) {
      localStorage.setItem('username', this.logiobj.username);

    }
      // Set username in localStorage from login object
      if (this.logiobj.username) {
        localStorage.setItem('username', this.logiobj.username);
      }
    }
  }


  submitReply(): void {
    if (!this.replyText.trim()) {
      alert('Please enter a valid reply!');
      return;
    }

    // Get the id parameter again to include in the payload
    const apiUrl = `${this.baseUrl}/api/Api/AddChallengeToReplay`;
    const username = localStorage.getItem('username'); // Get username from localStorage
    const id = this.route.snapshot.paramMap.get('id'); 

    const payload = {
      Content: this.replyText,
      RepliedBy: username,
      ChallengeId: id
    };

    this.http.post(apiUrl, payload).subscribe({
      next: (response) => {
        debugger;
        alert('Reply submitted successfully!');
        this.mailsending();
        this.replyText = ''; // Clear the textarea
        this.showReplyBox = false; // Close the reply box
        this.fetchReplays(this.challenge.id); // Refresh replays after submission
      },
      error: (error) => {
        console.error('Error submitting reply:', error);
        alert('Failed to submit reply. Please try again later.');
      }
    });
  }

  fetchChallengeDetails(id: string): void {
    const apiUrl = `${this.baseUrl}/api/Api/GetChallengeById/${id}`;
    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        this.challenge = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching challenge details:', error);
        this.errorMessage = 'Failed to load challenge details.';
        this.isLoading = false;
      }
    });
  }

  fetchReplays(id: string): void {

    const apiUrl = `${this.baseUrl}/api/Api/GetReplays/${id}`;

    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.replays = data;
      },
      error: (error) => {
        console.error('Error fetching replays:', error);
        
      }
    });
  }

  updateReply(replyId: number, repliedBy: string, challengeId: number): void {
    const updatedContent = prompt('Enter updated reply content:');
    if (updatedContent) {
 
      const apiUrl = `${environment.baseUrl}/api/Api/UpdateReplay/${replyId}`;

      const payload = {
        Content: updatedContent,
        RepliedBy: repliedBy,
        ChallengeId: challengeId
      };
  
      // Handle plain text response
      this.http.put(apiUrl, payload, { responseType: 'text' }).subscribe({
        next: (response) => {
          alert(response); // Display the text response from the API
          this.fetchReplays(this.challenge.id); // Refresh replies
        },
        error: (error) => {
          console.error('Error updating reply:', error);
          alert('Failed to update reply.');
        }
      });
    }
  }
  

  deleteReply(replyId: number): void {
    if (confirm('Are you sure you want to delete this reply?')) {

      const apiUrl = `${this.baseUrl}/api/Api/DeleteReplay/${replyId}`;

      
      // Use responseType: 'text' to handle the plain text response
      this.http.delete(apiUrl, { responseType: 'text' }).subscribe({
        next: (response) => {
          alert(response); // Show the response message
          this.fetchReplays(this.challenge.id); // Refresh replies
        },
        error: (error) => {
          console.error('Error deleting reply:', error);
          alert('Failed to delete reply.');
        }
      });
    }
  }  

  mailsending() {
    this.http.get(`${this.baseUrl}/api/Aws/get-secret`).subscribe((res: any) => {
      if(!res.success) {
        alert('Mail sent successfully');
      }
      else {
        alert('Failed to send mail');
      }
    })
  }
  
}
