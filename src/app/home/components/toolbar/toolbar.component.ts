import {Component, HostListener, Inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, NgClass} from '@angular/common';
import { NgIf, NgOptimizedImage } from "@angular/common";
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";
import { MatToolbar } from "@angular/material/toolbar";
import { MatAnchor, MatButton, MatIconButton } from "@angular/material/button";
import {RouterLink, RouterOutlet} from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { Router } from "@angular/router";
import {ThemeService} from "../../../services/theme.service";
import {MatSidenav, MatSidenavContainer} from "@angular/material/sidenav";
import {MatListItem, MatNavList} from "@angular/material/list";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    LanguageSwitcherComponent,
    MatToolbar,
    MatAnchor,
    RouterLink,
    MatButton,
    MatIconButton,
    MatIcon,
    NgIf,
    MatSidenavContainer,
    MatNavList,
    MatListItem,
    RouterOutlet,
    MatSidenav,
    NgClass,

  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  isSidenavOpen = false;
  isLargeScreen = true;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.themeService.setDarkTheme(true);
      }
    }
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 769;
    if (this.isLargeScreen) {
      this.isSidenavOpen = false; // Asegura que el sidenav esté cerrado en pantallas grandes
    }
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  get isDarkTheme(): boolean {
    return this.themeService.isDarkTheme();
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
