import { Injectable } from '@angular/core';

@Injectable()
export class SocialService {
  facebookName: string = "Knotty Barrel"
  twitterName: string = "@KnottyBarrel"
  instagramName: string = "#KnottyBarrel"
  activePage = 0
  constructor() { }

  incrementPage() {
    this.activePage++;
    if (this.activePage >= 3)
      this.activePage = 0
  }
}
