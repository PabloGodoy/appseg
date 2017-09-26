import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  usuario: any;
  pass: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: 'Usuario o contraseña incorrectos',
      buttons: ['OK']
    });
    alert.present();
  }

  login() {
    if (this.usuario == "Cognitiva" && this.pass == "1234"){
      this.navCtrl.push(HomePage);
    } else {
      this.showAlert();
    }
  }

}
