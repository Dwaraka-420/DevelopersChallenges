import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  private apiUrl = ''; // Replace with your API URL

  constructor(private http: HttpClient) {}

  getChallenges(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  private challengeId: string | null = null;

  setId(id: string): void {
    this.challengeId = id;
  }

  getId(): string | null {
    return this.challengeId;
  }
}
