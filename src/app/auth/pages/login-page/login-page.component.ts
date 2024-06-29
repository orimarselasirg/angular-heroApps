import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { User } from '../../interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-login-page',
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent {

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ){}

  login(email:string, password: string): void {
    this.authService.login(email, password)
    .subscribe(user => {
      this.router.navigate(['/']);
    })
  }
}
