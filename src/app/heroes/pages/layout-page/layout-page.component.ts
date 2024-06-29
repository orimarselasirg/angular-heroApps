import { Component } from '@angular/core';
import { AuthServiceService } from '../../../auth/services/auth-service.service';
import { Router } from '@angular/router';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {
  public sidebarItem = [
    { label: 'Listado', icon: 'label', url: './list' },
    { label: 'Añadir', icon: 'add', url: './new-hero' },
    { label: 'Buscar', icon: 'search', url: './search' }
  ]

  constructor(
    private authService: AuthServiceService,
    private router: Router){}

    get user(): User | undefined {
      return this.authService.currentUser
    }

    onLogout(): void {
      this.authService.logout()
      this.router.navigate(['/auth']);
    }
}
