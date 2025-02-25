
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DevelopersChallenges';
  constructor(private router: Router, private titleService: Title) {}

  ngOnInit(): void {
    // Listen for route changes and update the title dynamically
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd), // Filter navigation end events
        map(() => {
          let child = this.router.routerState.root; // Start from the root of the router state tree
          while (child.firstChild) {
            child = child.firstChild; // Traverse to the active route
          }
          return child.snapshot.data['title']; // Get the 'title' property from route data
        })
      )
      .subscribe((title: string) => {
        // Set the title dynamically or use a default
        this.titleService.setTitle(title || 'DevelopersChallenges');
      });
  }
}


