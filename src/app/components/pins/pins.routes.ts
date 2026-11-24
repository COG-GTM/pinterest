import { Routes } from '@angular/router';
import { authenticatedGuard } from '../../guards/authenticated';
import { canEditPinGuard } from '../../guards/can-edit-pin';

const loadPinEdit = () => import('./pin-edit/pin-edit.component').then(m => m.PinEditComponent);

export const PINS_ROUTES: Routes = [
  { path: 'new', loadComponent: loadPinEdit, canActivate: [authenticatedGuard] },
  { path: ':id', loadComponent: () => import('./pin-detail/pin-detail.component').then(m => m.PinDetailComponent) },
  { path: ':id/edit', loadComponent: loadPinEdit, canActivate: [authenticatedGuard, canEditPinGuard] }
];
