import { Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { LayoutComponent } from './Pages/layout/layout.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { AddChallengeComponent } from './Pages/add-challenge/add-challenge.component';
import { SubmittedChallengesComponent } from './Pages/submited-challenges/submited-challenges.component';
import { ReplayComponent } from './Pages/replay/replay.component';

export const routes: Routes = [
    // Redirect to the login page by default
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    // Login route
    {
        path: 'login',
        component: LoginComponent
    },
    // Dashboard route with LayoutComponent as its parent
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    // Layout route for challenges
    {
        path: 'layout',
        component: LayoutComponent
    },
    {
        path: 'AddChallenge',
        component: AddChallengeComponent
    },
    {
        path: 'SubmitedChallenge',
        component: SubmittedChallengesComponent
    },
    {
        path: 'layout/reply/:id',
        component: ReplayComponent
    }
];
