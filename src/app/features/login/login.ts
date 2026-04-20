import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';
import { ApiService } from '../../api';
import { Router } from '@angular/router';
import { AuthService } from '../../auth';
import { MatIcon } from '@angular/material/icon';
import { DbService } from '../../core/services/db.service';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatIcon,MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']

})


export class Login {
  dbService = inject(DbService);

  name = "";
  loginForm = new FormGroup(

    {
      UserName: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, Validators.minLength(6)])
    }
  )


  readonly UserName = this.loginForm.controls.UserName;
  readonly Password = this.loginForm.controls.Password;


  errorMessage = signal('');
  res = signal('');
  
  constructor(private apiService: ApiService , private router: Router , private authService : AuthService ) {
    merge(this.UserName.statusChanges, this.UserName.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  ngOnInit(): void{
    // this.authService.isAuthenticated()
    // console.log('login status:' , this.authService.isLoggedIn);
    
    if(this.authService.isLoggedIn){
      this.router.navigate(["/"]);
    }

  }


  onSubmit() {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe({
          next: async (res : any) => {
          // this.isLoading = false; 
          if(res.token){
            
           this.authService.setToken(res.token);
           this.authService.saveUserData(res.user)          
           const count = await this.dbService.users.update(res.user.id, {
             name: res.user.name,
             email: res.user.email,
             number: res.user.phoneNumber,
             role: res.user.role,
             is_active: true,
             last_login_at: new Date()
           });
           if (count === 0) {
    
             await this.dbService.users.put({
               id: res.user.id,
               name: res.user.name,
               email: res.user.email,
               number: res.user.phoneNumber,
               role: res.user.role,
               is_active: true,
               last_login_at: new Date(),
               created_at: new Date(),
               updated_at: new Date()
             });
           }
           this.router.navigate(["/"])
          }
          
        },
        error: (err) => {
          this.res.set("Login Attempt failed please try again")
          console.error('Login failed', err.message);
        }
      })
    }
  }
updateErrorMessage() {
  if (this.UserName.invalid) {
    if (this.UserName.hasError('required')) this.errorMessage.set('Email is required');
    else if (this.UserName.hasError('email')) this.errorMessage.set('Not a valid email');
  } 
  else if (this.Password.invalid) {
    if (this.Password.hasError('required')) this.errorMessage.set('Password is required');
    else if (this.Password.hasError('minlength')) this.errorMessage.set('Minimum 12 characters');
  } 
  else {
    this.errorMessage.set('');
  }
}
}
