import { isPlatformBrowser, JsonPipe } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { single } from 'rxjs';
import { DbService } from './core/services/db.service';
@Injectable({ providedIn: 'root' })

export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private dbService = inject(DbService);
  private readonly TOKEN_KEY = 'auth_token';
  public loggedIn = signal<boolean>(false); 
  get isLoggedIn(): boolean {
    
    return this.loggedIn();
  }
  constructor(){
    this.isAuthenticated();
  }
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
      this.isAuthenticated()
    }
  }

  clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

   saveUserData(user : object): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

    isAuthenticated(): void {
  const token: string = this.getToken() ?? '';  
  const isValid = token && !this.isTokenExpired(token);
  this.loggedIn.set(!!isValid);
}
  async authUser() : Promise<any> {
    var user = await this.dbService.users.toCollection().first(); 
    return  user;

  }

  // getRoles(): string[] {
  //   return this.getUser()?.role ? [this.getUser().role] : [];
  // }

  logout(): void {
    this.clearToken();
  }

  // ---- helpers ----

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
   
    
    if (!payload?.exp) return true;
    return payload.exp * 1000 < Date.now();
  }
}
