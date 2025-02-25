import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { LayoutComponent } from './Pages/layout/layout.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { AddChallengeComponent } from './Pages/add-challenge/add-challenge.component';
import { SubmittedChallengesComponent } from './Pages/submited-challenges/submited-challenges.component';
import { ReplayComponent } from './Pages/replay/replay.component';
import { HealthComponent } from './health/health.component';

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
        component: LoginComponent,
        data : {'title': 'Login'}
    },
    // Dashboard route with LayoutComponent as its parent
    {
        path: 'dashboard',
        component: DashboardComponent,
        data : {'title': 'Dashboard'}
    },
    // Layout route for challenges
    {
        path: 'layout',
        component: LayoutComponent,
        data : {'title': 'Layout'}
    },
    {
        path: 'AddChallenge',
        component: AddChallengeComponent,
        data : {'title': 'Add Challenge'}
    },
    {
        path: 'SubmitedChallenge',
        component: SubmittedChallengesComponent,
        data : {'title': 'Submited Challenges'}
    },
    {
        path: 'layout/reply/:id',
        component: ReplayComponent,
        data : {'title': 'Replay'}
    },
    {
        path: 'health',
        component: HealthComponent
    }
];
