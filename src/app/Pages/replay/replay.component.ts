import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-replay',
  imports: [CommonModule,RouterModule],
  templateUrl: './replay.component.html',
  styleUrl: './replay.component.scss'
})
export class ReplayComponent implements OnInit {
  challenge: any = {}; // Store challenge details
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Get the id parameter
    if (id) {
      this.fetchChallengeDetails(id);
    }
  }

  fetchChallengeDetails(id: string): void {
    const apiUrl = `https://localhost:7103/api/Api/GetChallengeById/${id}`;
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
}
