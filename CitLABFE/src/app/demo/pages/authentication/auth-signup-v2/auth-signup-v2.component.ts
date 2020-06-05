import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-signup-v2',
  templateUrl: './auth-signup-v2.component.html',
  styleUrls: ['./auth-signup-v2.component.scss']
})
export class AuthSignupV2Component implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    if(this.auth.isAuthenticated()){
      this.router.navigate(['dashboard/pubblications-search']);
    }
  }
}
