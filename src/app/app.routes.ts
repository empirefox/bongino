import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuard } from './services/guard.service';

import { LayoutsAuthComponent } from './pages/layouts/auth/auth';
import { RootModule } from './pages/root/root.module';
import { MyModule } from './pages/my/my.module';
import { WalletModule } from './pages/wallet/wallet.module';
import { UserModule } from './pages/user/user.module';

// Components
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export function loadWalletModule() { return WalletModule; }
export function loadUserModule() { return UserModule; }
export function loadMyModule() { return MyModule; }
export function loadRootModule() { return RootModule; }

export const routes: Routes = [
  // logged routes
  {
    canActivate: [CanActivateGuard],
    component: LayoutsAuthComponent,
    path: '',
    children: [
      { path: 'wallet', loadChildren: loadWalletModule },
      { path: 'user', loadChildren: loadUserModule },
      { path: 'my', loadChildren: loadMyModule },
      { path: '', loadChildren: loadRootModule },
    ]
  },
  // not logged routes
  {
    component: LoginComponent,
    path: 'login'
  },
  {
    component: RegisterComponent,
    path: 'register'
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
