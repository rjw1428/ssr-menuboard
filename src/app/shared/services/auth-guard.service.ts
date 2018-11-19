import { Injectable } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class AuthGaurdService {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated())
      return true
    else
      this.router.navigate(['/']);
    return false
  }
}
