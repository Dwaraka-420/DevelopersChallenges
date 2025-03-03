import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../config';
// import { error } from 'node:console'; // Remove this line


@Component({
  selector: 'app-replay',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './replay.component.html',
  styleUrls: ['./replay.component.scss']
})
export class ReplayComponent implements OnInit {
  baseUrl = environment.baseUrl;
  challenge: any = {}; 
  replays: any[] = []; 
  isLoading: boolean = true;
  errorMessage: string = '';
  showReplyBox = false;
  replyText: string = '';
  currentUser: string = localStorage.getItem('username') || '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchChallengeDetails(id);
      this.fetchReplays(id);
    }
  }

  toggleReplyBox(): void {
    this.showReplyBox = !this.showReplyBox;
  }

  submitReply(): void {
    if (!this.replyText.trim()) {
      alert('Please enter a valid reply!');
      return;
    }

    const apiUrl = `${this.baseUrl}/api/Api/AddChallengeToReplay`;
    const token = sessionStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;
    const payload = {
      Content: this.replyText,
      RepliedBy: this.currentUser,
      ChallengeId: this.challenge.id
    };

    this.http.post(apiUrl, payload, { headers }).subscribe({
      next: () => {
        alert('Reply submitted successfully!');
        this.replyText = ''; 
        this.showReplyBox = false;
        this.fetchReplays(this.challenge.id);
      },
      error: () => {
        alert('Failed to submit reply.');

      }
    });
  }

  fetchChallengeDetails(id: string): void {
    const apiUrl = `${this.baseUrl}/api/Api/GetChallengeById/${id}`;
    const token = sessionStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;
    
    this.http.get<any>(apiUrl, { headers }).subscribe({
      next: (data) => {
        this.challenge = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load challenge details.';
        
      }
    });
  }

  fetchReplays(id: string): void {
    const apiUrl = `${this.baseUrl}/api/Api/GetReplays/${id}`;
    const token = sessionStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;

    this.http.get<any[]>(apiUrl, { headers }).subscribe({
      next: (data) => {
        this.replays = data.map(reply => ({
          ...reply,
          canEditOrDelete: reply.repliedBy === this.currentUser,
          isEditing: false,
          editedText: reply.content,
          showReplyBox: false // ✅ For replying to a reply
        }));
      },
      error: (error) => {
        console.error('Failed to load replays.', error);
        if (error.status === 401) {
          alert('Session expired. Please log in again.');
          sessionStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    });
  }

  editReply(reply: any): void {
    reply.isEditing = true;
  }

  cancelEdit(reply: any): void {
    reply.isEditing = false;
    reply.editedText = reply.content;
  }

  saveEditedReply(reply: any): void {
    const token = sessionStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;
    const apiUrl = `${this.baseUrl}/api/Api/UpdateReplay/${reply.id}`;

    const payload = {
      Content: reply.editedText,
      RepliedBy: reply.repliedBy,
      ChallengeId: reply.challengeId
    };

    this.http.put(apiUrl, payload, { headers, responseType: 'text' }).subscribe({
      next: () => {
        reply.content = reply.editedText;
        reply.isEditing = false;
      },
      error: () => {
        alert('Failed to update reply.');
      }
    });
  }

  markAsAccepted(reply: any): void {
    if (confirm('Mark this reply as accepted?')) {
      reply.isAccepted = true;

      const apiUrl = `${this.baseUrl}/api/Api/MarkAsAccepted/${reply.id}`;
      this.http.post(apiUrl, {}).subscribe({
        next: () => {
          alert('Reply marked as accepted!');
        },
        error: () => {
          alert('Failed to mark reply as accepted.');
        }
      });
    }
  }

  toggleReplyToReply(reply: any): void {
    reply.showReplyBox = !reply.showReplyBox;
  }

  submitReplyToReply(reply: any): void {
    if (!reply.replyText.trim()) {
      alert('Reply cannot be empty.');
      return;
    }

    const apiUrl = `${this.baseUrl}/api/Api/ReplyToReply`;
    const token = sessionStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;
    
    const payload = {
      Content: reply.replyText,
      RepliedBy: this.currentUser,
      ParentReplyId: reply.id
    };

    this.http.post(apiUrl, payload, { headers }).subscribe({
      next: () => {
        alert('Reply added successfully!');
        this.fetchReplays(this.challenge.id);
      },
      error: () => {
        alert('Failed to reply.');
      }
    });
  }
  deleteReply(replyId: number): void {
    if (confirm('Are you sure you want to delete this reply?')) {
      const apiUrl = `${this.baseUrl}/api/Api/DeleteReplay/${replyId}`;
      const token = sessionStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;
      
      this.http.delete(apiUrl, { headers, responseType: 'text' }).subscribe({
        next: () => {
          this.replays = this.replays.filter(reply => reply.id !== replyId);
        },
        error: (error) => {
          console.error('Error deleting reply:', error);
        }
      });
    }
  }

  downloadFile() {
   
    const apiUrl = `${this.baseUrl}/api/S3/download?BucketName=${environment.s3BucketName}&FileKey=${this.challenge.filepath}`;

    // ✅ Create a hidden <a> tag to trigger the download
    const link = document.createElement('a');
    link.href = apiUrl;
    link.target = "_blank"; // Open in new tab (optional)
    link.setAttribute('download', ''); // Let the browser handle file name
    link.click();
}

}
