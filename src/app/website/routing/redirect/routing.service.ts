import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router, private afs: AngularFirestore) { }

  redirect(address: string) {
    
  }
}
