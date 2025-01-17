import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterLink, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../config';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  baseUrl = environment.baseUrl; // Base URL for the API
  challenges: any[] = []; // Array to hold challenges fetched from the API
  categories: any[] = []; // Array to hold categories fetched from the API
  isLoading: boolean = true; // Loading indicator
  errorMessage: string = ''; // Error message if the API call fails
  selectedCategory: string = ''; // Selected category
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchCategories(); // Fetch categories for the dropdown
    this.fetchChallenges(); // Fetch all challenges initially
  }

  // Fetch categories from the backend API
  fetchCategories(): void {
    const apiUrl = `${this.baseUrl}/api/Api/GetCategories`; // API endpoint to get categories
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.categories = data; // Assign fetched categories
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.errorMessage = 'Failed to load categories';
      }
    });
  }

  // Fetch challenges filtered by category
  fetchChallengesByCategory(category: string): void {
    this.isLoading = true;
    this.errorMessage = '';
  
    const apiUrl = `${this.baseUrl}/api/Api/GetChallengeByCategory?category=${category}`;
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.challenges = data;
        } else {
          this.challenges = [];
          this.errorMessage = `No challenges found for category: ${category}`;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error(`Error fetching data for category (${category}):`, error);
        this.errorMessage = `Failed to fetch data for category: ${category}`;
        this.challenges = []; // Clear the challenges if an error occurs
        this.isLoading = false;
      }
    });
  }

  // Fetch all challenges from the API
  fetchChallenges(): void {
    const apiUrl = `${this.baseUrl}/api/Api/Challenges`;
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.challenges = data; 
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching challenges:', error);
        this.errorMessage = 'Failed to load challenges';
        this.isLoading = false;
      }
    });
  }

  // Handle category selection
  onCategoryChange(event: any): void {
    this.selectedCategory = event.target.value; // Update selected category
    if (this.selectedCategory) {
      this.fetchChallengesByCategory(this.selectedCategory); // Fetch challenges for the selected category
    } else {
      this.fetchChallenges(); // Fetch all challenges if no category is selected
    }
  }
  navigateToChallengeDetails(challengeId: string): void {
    this.router.navigate(['/layout/reply', challengeId]);
  }
}
