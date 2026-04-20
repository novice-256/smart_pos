import { Component } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
    selector: 'app-serverdown',
  templateUrl: './serverdown.html',
  styleUrl: './serverdown.css',
  imports: [MatCardContent, 
MatCard,  
MatCardHeader,
MatCardTitle,
MatCardSubtitle,
MatCardActions,
MatIcon
],
})
export class Serverdown {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}