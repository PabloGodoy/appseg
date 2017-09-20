import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import {  NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isListening: boolean = false;
  matches: Array<String>;
  muestra: any;
  busca: boolean;
  data: any = {};
  palabra: any;
  encontrado: any = "no";
  texto: any;

  constructor(private storage: Storage, public toastCtrl: ToastController, public geolocation: Geolocation, public navCtrl: NavController, public speech: SpeechRecognition, public http: Http, private zone: NgZone) {
  this.data.nombre = '';
  this.data.telefono = '';
  this.data.contacto = '';
  this.data.fonocontacto = '';
  this.data.lat = '';
  this.data.lon = '';
  this.data.response = '';
  this.http = http;
  }

  submit() {
    var link = 'http://cognitivachile.com/appsegdev/api.php';
    var myData = JSON.stringify({lat: this.data.lat, lon: this.data.lon, nombre: this.data.nombre, telefono: this.data.telefono, contacto: this.data.contacto, fonocontacto: this.data.fonocontacto, texto: this.texto});
    
    this.http.post(link, myData).subscribe(data => {
      this.data.response = data["_body"]; 
    }, error => {
      console.log("algo esta mal jejeje!");
    });
  }

  localizar() {
    this.geolocation.getCurrentPosition({timeout: 6000})
                .then( info => {
                  this.data.lat = info.coords.latitude;
                  this.data.lon = info.coords.longitude;
                })
                .catch(error =>{
                  let toast = this.toastCtrl.create({
                    message: 'No se pudo encontrar la ubicacion',
                    duration: 2000
                  });
                  toast.present();
                })
  }

  async hasPermission():Promise<boolean> {
    try {
      const permission = await this.speech.hasPermission();
      console.log(permission);

      return permission;
    } catch(e) {
      console.log(e);
    }
  }

  async getPermission():Promise<void> {
    try {
      this.speech.requestPermission();
    } catch(e) {
      console.log(e);
    }
  }

  listen(): void {
    console.log('Escuchando');
    this.localizar();
    if (this.isListening) {
      this.speech.stopListening();
      this.toggleListenMode();
      return;
    }

    this.toggleListenMode();
    let _this = this;

    this.speech.startListening()
      .subscribe(matches => {
        _this.zone.run(() => {
          _this.matches = matches;
          _this.encontrado = "no";
          for (var i = 0; i < matches.length; i++) { 
            var re = new RegExp(_this.palabra,"gi"); 
            if (matches[i].search(re) == -1 ) { 
              _this.muestra = "no hay hotword";
            } else { 
              _this.texto = matches[i];
              _this.encontrado = "si";
            } 
          }
          if (_this.encontrado == "si") {
            _this.muestra = "Hotword encontrada";
            _this.submit();
          }
        })
      }, error => console.error(error));
  }

  toggleListenMode():void {
    this.isListening = this.isListening ? false : true;
    console.log('te estoy escuchando XD : ' + this.isListening);
  }

}