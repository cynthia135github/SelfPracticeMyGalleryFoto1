import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Plugins } from '@capacitor/core';
import { FotoService } from '../services/foto.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  //Variabel utk key pada Local Storage yg save url" foto yg di save di firebase
  private keyFoto : string = "foto";

  constructor(public fotoservice:FotoService, public firestorage: AngularFireStorage) {}

  async ngOnInit(){
    //Saat Pertama Kali buka lakukan load foto" yg disimpan di Storage Local
    await this.fotoservice.loadFoto();
  }

  async ionViewDidEnter(){
    //Saat buka tab1 lakukan load foto" yg disimpan di Storage Local
    await this.fotoservice.loadFoto();

  }

  addNewFoto(){
    this.fotoservice.addFoto();
    this.fotoservice.loadFoto();
  }

  //Happus foto yg diinginkan
  hapusFoto(counter){
   console.log("indexFoto:"+counter);
   console.log("nama file dihapus :" + this.fotoservice.dataFoto[counter].namefile);

   var fotoYgdihapus = this.fotoservice.dataFoto[counter].namefile;
   var refImage = this.firestorage.storage.ref();
   refImage.child(fotoYgdihapus).delete();

   this.fotoservice.dataFoto.splice(counter,1);

   //simpan array dataFoto ke Storage Local
   Storage.set({
    key : this.keyFoto,
    value : JSON.stringify(this.fotoservice.dataFoto)
  });
  }

}
