import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { regulars } from '../regulars';
import { ClientsService } from '../../services/clients.service';
import { map } from 'rxjs';
import { CurrentClientService } from '../../services/current-client.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Client } from '../../interfaces/interfaces';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  formRegistration: FormGroup;
  formAutorisation: FormGroup;
  passwordVisibitlitySingUp = 'password';
  passwordVisibitlityLogIn = 'password';
  @ViewChild('passVisibilitySingUp')
  visibilitySingUp: ElementRef<HTMLInputElement>;
  @ViewChild('passVisibilityLogIn')
  visibilityLogIn: ElementRef<HTMLInputElement>;

  constructor(
    private clients: ClientsService,
    private currentClient: CurrentClientService,
    private router: Router
  ) {}

  error(form: FormGroup, control: string, error: string) {
    return (form.get(control)?.errors as ValidationErrors)[error];
  }

  setVisibilitySingUp(): void {
    this.visibilitySingUp.nativeElement.checked
      ? (this.passwordVisibitlitySingUp = 'text')
      : (this.passwordVisibitlitySingUp = 'password');
  }

  setVisibilityLogIn(): void {
    this.visibilityLogIn.nativeElement.checked
      ? (this.passwordVisibitlityLogIn = 'text')
      : (this.passwordVisibitlityLogIn = 'password');
  }

  loginCheckForUsed(): AsyncValidatorFn {
    return () => {
      return this.clients.getClients().pipe(
        map((clients) => {
          if (
            clients.find(
              (client) =>
                client.login === this.formRegistration.get('login')?.value
            )
          ) {
            return { used: true };
          } else {
            return null;
          }
        })
      );
    };
  }

  singUp() {
    this.clients
      .addclient({
        login: this.formRegistration.get('login')?.value,
        password: this.formRegistration.get('password')?.value,
      })
      .subscribe((responce) => {
        this.currentClient.client = responce as Client;
        this.router.navigate(['']);
      });
  }

  logIn() {
    return this.clients.getClients().subscribe((responce) => {
      let client = responce.find(
        (client) =>
          client.login === this.formAutorisation.get('login')?.value &&
          client.password === this.formAutorisation.get('password')?.value
      );
      if (client) {
        this.currentClient.client = client;
        this.router.navigate(['']);
      } else {
        this.formAutorisation.get('login')?.setErrors({
          uncorrectLogin: true,
        });

        this.formAutorisation.get('password')?.setErrors({
          uncorrectPassword: true,
        });

        setTimeout(() => {
          this.formAutorisation.get('login')?.setErrors(null);
          this.formAutorisation.get('password')?.setErrors(null);
        }, 3000);
      }
    });
  }

  ngOnInit(): void {
    this.formRegistration = new FormGroup({
      login: new FormControl(
        '',
        [Validators.required, Validators.pattern(regulars.login)],
        this.loginCheckForUsed()
      ),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(regulars.password),
      ]),
    });

    this.formAutorisation = new FormGroup({
      login: new FormControl('Andry', [
        Validators.required,
        Validators.pattern(regulars.login),
      ]),
      password: new FormControl('Cormax25524', [
        Validators.required,
        Validators.pattern(regulars.password),
      ]),
    });
  }
}
