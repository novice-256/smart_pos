import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { MatMenu } from '@angular/material/menu';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth';
import { environment } from '../../../../environments/environment.prod';
import { Router } from '@angular/router';
import { ApiService } from '../../../api';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule , MatMenu ,MatMenuModule , MatToolbarModule, MatButtonModule, MatIconModule, TranslateModule, MatDividerModule],
  templateUrl: './app-header.html',
  styleUrls: ['./app-header.css']
})
export class AppHeaderComponent {
   constructor(private apiService : ApiService , public authService : AuthService , public langService: LanguageService , private router : Router){}
  private apiUrl = environment.apiUrl;

  user: any;

  async ngOnInit() {
    this.user = await this.authService.authUser();
    
  }
  switchLang() {
    // Basic toggle logic
    const current = localStorage.getItem('preferred_lang') || 'ur';
    this.langService.setLanguage(current === 'ur' ? 'en' : 'ur');
  }
    onLogout(){
    this.apiService.logout().subscribe({
      next : (res : any)=>{
        console.log("before checking res.ok");
           this.authService.clearToken();
          this.authService.loggedIn.set(false); 
          this.router.navigate(['/login']);
      
      },
        error : (err)=>{
          alert(err);
        }
    });

  }
}

// function inject(AuthService: typeof AuthService) {
//   throw new Error('Function not implemented.');
// }
