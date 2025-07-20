import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/vendor/login', pathMatch: 'full' },
  {
    path: 'vendor/login',
    loadComponent: () =>
      import('./vendor/login/vendor-login.component').then(m => m.VendorLoginComponent)
  },
  
  {
    path: 'vendor/dashboard',
    loadComponent: () =>
      import('./vendor/dashboard/vendor-dashboard.component').then(m => m.VendorDashboardComponent)
  },
  {
    path: 'vendor/profile',
    loadComponent: () =>
      import('./vendor/profile/vendor-profile.component').then(m => m.VendorProfileComponent)
  },
  {
    path: 'vendor/rfq',
    loadComponent: () =>
      import('./vendor/rfq/vendor-rfq-table.component').then(m => m.VendorRfqComponent)
  },
  {
    path: 'vendor/po',
    loadComponent: () =>
      import('./vendor/po/vendor-po-table.component').then(m => m.VendorpoComponent)
  },
  {
    path: 'vendor/gr',
    loadComponent: () =>
      import('./vendor/gr/vendor-gr-table.component').then(m => m.VendorgrComponent)
  },

  {
    path: 'vendor/inv',
    loadComponent: () =>
      import('./vendor/invoice/vendor-inv-table.component').then(m => m.VendorinvComponent)
  },
  {
    path: 'vendor/memo',
    loadComponent: () =>
      import('./vendor/memo/vendor-memo-table.component').then(m => m.VendormemoComponent)
  },
  {
    path: 'vendor/pay',
    loadComponent: () =>
      import('./vendor/pay/vendor-pay-table.component').then(m => m.VendorpayComponent)
  },
  { path: '**', redirectTo: '/vendor/login' }
];
