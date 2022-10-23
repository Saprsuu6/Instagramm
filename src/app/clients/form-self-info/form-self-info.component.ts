import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Client, Info } from '../../interfaces/interfaces';
import { regulars } from '../regulars';
import { ClientsService } from '../../services/clients.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-form-self-info',
  templateUrl: './form-self-info.component.html',
  styleUrls: ['./form-self-info.component.css'],
})
export class FormSelfInfoComponent implements OnInit {
  @Input('client') client: Client;
  form: FormGroup;
  passwordVisibitlity = 'password';
  @ViewChild('passVisibility')
  visibility: ElementRef<HTMLInputElement>;
  changesSubmited: boolean;
  @ViewChild('file') file: ElementRef<HTMLInputElement>;

  constructor(private clients: ClientsService) {}

  error(form: FormGroup, control: string, error: string) {
    return (form.get(control)?.errors as ValidationErrors)[error];
  }

  setVisibility(): void {
    this.visibility.nativeElement.checked
      ? (this.passwordVisibitlity = 'text')
      : (this.passwordVisibitlity = 'password');
  }

  loginCheckForUsed(): AsyncValidatorFn {
    return () => {
      return this.clients.getClients().pipe(
        map((clients) => {
          if (
            clients.find(
              (client) =>
                client.login === this.form.get('login')?.value &&
                client.login !== this.client.login
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

  submit(): void {
    let changes = {
      login: this.form.get('login')?.value,
      password: this.form.get('password')?.value,
      selfInfo: {
        avatar:
          '../../../assets/clientPictures/' +
          (this.file.nativeElement.files as FileList)[0]?.name,
        age: this.form.get('userInfo.age')?.value,
        name: this.form.get('userInfo.name')?.value,
        surename: this.form.get('userInfo.surename')?.value,
        email: this.form.get('userInfo.email')?.value,
        phone: this.form.get('userInfo.phone')?.value,
        bio: this.form.get('userInfo.bio')?.value,
      },
    };

    if (
      changes.selfInfo.avatar === '../../../assets/clientPictures/undefined'
    ) {
      changes.selfInfo.avatar = '../../../assets/clientPictures/user.png';
    }

    this.client.login = changes.login;
    this.client.password = changes.password;
    this.client.selfInfo = changes.selfInfo;

    this.clients.getClients().subscribe((responce) =>
      responce.map((client) => {
        if (client.id === this.client.id) {
          client.login = changes.login;
          client.password = changes.password;
          client.selfInfo = changes.selfInfo;
        }

        this.clients
          .updateClient(client)
          .subscribe((responce) => console.log(responce));
      })
    );

    this.changesSubmited = true;

    setTimeout(() => {
      this.changesSubmited = false;
    }, 3000);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl(
        this.client.login,
        [Validators.required, Validators.pattern(regulars.login)],
        this.loginCheckForUsed()
      ),
      password: new FormControl(this.client.password, [
        Validators.required,
        Validators.pattern(regulars.password),
      ]),
      userInfo: new FormGroup({
        avatar: new FormControl(''),
        age: new FormControl(this.client.selfInfo?.age, [
          Validators.required,
          Validators.pattern(regulars.age),
        ]),
        name: new FormControl(this.client.selfInfo?.name, [
          Validators.required,
          Validators.pattern(regulars.login),
        ]),
        surename: new FormControl(this.client.selfInfo?.surename, [
          Validators.required,
          Validators.pattern(regulars.login),
        ]),
        email: new FormControl(this.client.selfInfo?.email, [
          Validators.required,
          Validators.email,
        ]),
        phone: new FormControl(this.client.selfInfo?.phone, [
          Validators.required,
          Validators.pattern(regulars.phone),
        ]),
        bio: new FormControl(this.client.selfInfo?.bio),
      }),
    });
  }
}
