import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkTheme = new BehaviorSubject<boolean>(false);

  isDarkTheme() {
    return this.darkTheme.value;
  }

  setDarkTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    this.darkTheme.next(isDark);
  }

  toggleTheme() {
    this.setDarkTheme(!this.darkTheme.value);
  }
}
