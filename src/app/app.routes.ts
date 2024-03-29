import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { MasterComponent } from './views/master/master.component';
import { Authguard } from './authguard';
import { LogoutComponent } from './views/logout/logout.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { UIKitComponent } from './views/uikit/uikit.component';
export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '', component: MasterComponent,
        // canActivate: [Authguard],
        children: [
            { path: '', redirectTo: '/customer', pathMatch: 'full' },
            // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
            { path: 'uikit', component: UIKitComponent },
            { path: 'dashboard', loadChildren: () => import('../app/views/dashboard/dashboard.routes').then(m => m.routes) },
            { path: 'customer', loadChildren: () => import('./views/user/customer.routes').then(m => m.routes) },

            { path: 'site', loadChildren: () => import('./views/site/site.routes').then(m => m.routes) },
        ]
    },

    { path: 'logout', component: LogoutComponent },
    { path: '**', component: PageNotFoundComponent }
];
