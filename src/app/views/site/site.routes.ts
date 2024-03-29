import { Routes } from "@angular/router";
import { RoleEditComponent } from "./roleedit.component";
import { SiteAddComponent } from "./siteadd.component"
import { SiteListComponent } from "./sitelist.component";


export const routes: Routes = [
    { path: '', component: SiteListComponent },
    { path: 'add', component: SiteAddComponent },
    { path: 'edit/:id', component: RoleEditComponent },
];


