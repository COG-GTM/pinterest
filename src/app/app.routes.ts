import { Routes } from '@angular/router';
import { PinsComponent } from './components/pins/pins.component';
import { PINS_ROUTES } from './components/pins/pins.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/pins',
    pathMatch: 'full'
  },
  {
    path: 'pins',
    component: PinsComponent,
    children: PINS_ROUTES
  }
];
