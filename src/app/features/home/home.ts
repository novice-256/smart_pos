import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-home',
  imports: [CommonModule, SharedModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']  


})
export class Home {
 page = 'Home'
}
