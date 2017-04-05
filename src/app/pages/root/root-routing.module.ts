import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanActivateGuard } from '../../services/guard.service';
import { PageNumComponent } from './page-num/page-num.component';
import { ClientComponent } from './client/client.component';

import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { PageComponent } from './page/page.component';
import { PackageComponent } from './package/package.component';

const routes: Routes = [
  {
    canActivate: [CanActivateGuard],
    component: PageNumComponent,
    path: 'page/:id'
  },
  {
    canActivate: [CanActivateGuard],
    component: ClientComponent,
    path: 'client'
  },
  { path: 'contact', component: ContactComponent },
  { path: 'home', component: HomeComponent },
  { path: 'p', component: PageComponent },
  { path: 'package', component: PackageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootRoutingModule { }
