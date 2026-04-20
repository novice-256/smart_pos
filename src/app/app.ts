import { Component, signal } from '@angular/core';
import { RouterOutlet ,RouterLink ,RouterLinkActive, Router} from '@angular/router';
import { CommonModule } from "@angular/common";
import { AuthService } from './auth';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ApiService } from './api';
import { Home } from './features/home/home';
import { SharedModule } from './shared/shared.module';
import { DbService, User } from './core/services/db.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, CommonModule, MatToolbarModule, MatButtonModule , SharedModule],
  templateUrl: './app.html',

})
export class App {
   constructor(public authService : AuthService , private router : Router,  private apiService : ApiService){

     
    }

  protected title = signal('learn-angular');
  

  onLogout(){
    
    this.apiService.logout().subscribe(
      {
        next : (res : any)=>{  
          
          this.authService.clearToken();
          this.authService.loggedIn.set(false); 
          this.router.navigate(['/login']);
           
        },
        error : (err)=>{
          alert(err);
        }
      }
    )
  }
   

}
