import { Injectable } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import * as _ from 'lodash'
@Injectable()
export class AuthGaurdService {
  client: string
  // constructor(private auth: AuthService, private router: Router) { }

  // canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
  //   return this.auth.user
  //     .take(1)
  //     .map(user => _.has(_.get(user, 'roles'), 'read'))  //returns true if read is one of the roles
  //     .do(authorized => authorized ? this.router.navigate(['/edit/breweries']) : this.router.navigate(['/']))
  // }

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated()) {
      return true
    } else
      this.router.navigate([`signin`]);
    return false
  }
}
