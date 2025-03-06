import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  if (typeof localStorage !== 'undefined') {
    const Token = localStorage.getItem('adminToken');
    if (Token !== null) {
      return true;
    } else {
      return false;
    }
  } else {
    return false; 
  }
};