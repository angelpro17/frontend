import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgIf, NgOptimizedImage } from "@angular/common";
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";
import { MatToolbar } from "@angular/material/toolbar";
import { MatAnchor, MatButton, MatIconButton } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { Router } from "@angular/router";
import {ThemeService} from "../../../services/theme.service";

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
    NgIf
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
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
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  get isDarkTheme(): boolean {
    return this.themeService.isDarkTheme();
  }
}
