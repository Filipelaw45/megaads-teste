import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent {
  menuItems = [
    { path: '/dashboard', icon: 'home', label: 'Dashboard' },
    { path: '/clients', icon: 'users', label: 'Clientes' },
    { path: '/transactions', icon: 'transactions', label: 'Transações' },
    { path: '/reports', icon: 'chart', label: 'Relatórios' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
