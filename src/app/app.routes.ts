import { Routes } from '@angular/router';
import { PINS_ROUTES } from './components/pins/pins.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/pins',
    pathMatch: 'full'
  },
  {
    path: 'pins',
    loadComponent: () => import('./components/pins/pins.component').then(m => m.PinsComponent),
    children: PINS_ROUTES
  }
];
