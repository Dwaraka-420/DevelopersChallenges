import { Component, Output, EventEmitter, inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../config';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-challenge',
  imports: [FormsModule, CommonModule, MatIconModule, RouterModule],
  templateUrl: './add-challenge.component.html',
  styleUrl: './add-challenge.component.scss'
})
export class AddChallengeComponent {
  logiobj: any = {};
  baseUrl = environment.baseUrl;
  uploadedFileUrl: string | null = null;

  @Output() challengeAdded = new EventEmitter<any>();

  entobj: any = {
    Title: '',
    Description: '',
    CreatedBy: '',
    Category: '',
    filepath: ''  // ✅ Store uploaded file URL in challenge object
  };

  http = inject(HttpClient);
  router = inject(Router);

  ngOnInit(): void {
    // ✅ Initialize username from localStorage
    const username = localStorage.getItem('username');
    if (username) {
      this.entobj.CreatedBy = username;
    }
  }

  // ✅ File selection logic
  uploadProgress: number | null = null;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  // ✅ Upload File to S3 Bucket First
  uploadFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        alert('No file selected');
        return reject('No file selected');
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile as File);

      const uploadUrl = `${this.baseUrl}/api/s3/upload?bucketName=${environment.s3BucketName}&prefix=attachments/`;

      this.http.post(uploadUrl, formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((event.loaded / (event.total ?? 1)) * 100);
        } else if (event.type === HttpEventType.Response) {
          const responseBody = event.body as { fileUrl: string };
          this.uploadedFileUrl = responseBody.fileUrl;  // ✅ Store uploaded file URL
          this.uploadProgress = null;
          resolve(responseBody.fileUrl);
        }
      }, error => {
        console.error('Upload error:', error);
        this.uploadProgress = null;
        reject(error);
      });
    });
  }

  // ✅ Submit Challenge AFTER Uploading File
  async OnSubmit() {
    try {
      if (!this.uploadedFileUrl) {
        alert('Uploading file... Please wait.');
        this.uploadedFileUrl = await this.uploadFile();  // ✅ Wait for file upload
      }

      // ✅ Ensure file URL is attached
      this.entobj.filepath = this.uploadedFileUrl;
      this.entobj.createdAt = new Date().toISOString();

      // ✅ Make the POST request to submit challenge
      this.http.post(`${this.baseUrl}/api/Api/AddChallenge`, this.entobj).subscribe((res: any) => {
        if (res.success) {
          this.mailsending();
          alert('Challenge added successfully');
          this.router.navigateByUrl('/layout');
        } else {
          alert('Failed to add challenge');
        }
      });

    } catch (error) {
      console.error('Error in challenge submission:', error);
      alert('Challenge submission failed.');
    }
  }

  // ✅ Send Confirmation Email
  mailsending() {
    this.http.get(`${this.baseUrl}/api/Aws/get-secret`).subscribe((res: any) => {
      if (res.success) {
        alert('Mail sent successfully');
      } else {
        alert('Failed to send mail');
      }
    });
  }
}
