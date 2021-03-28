import { Injectable } from '@angular/core';

//Import utk Firebase Storage
import { AngularFireStorage } from '@angular/fire/storage';

//Tambahkan import utk Camera, Capacitor, Plugins
import { CameraPhoto, CameraResultType, CameraSource, Capacitor, Plugins } from '@capacitor/core';


const { Camera, Storage } = Plugins;

//Spt Class tpi tdk dipisah tempat
export interface Photo{
  filePath : string;
  namefile : string;
}

@Injectable({
  providedIn: 'root'
})
export class FotoService {

  //Variabel simpan url foto firebase
  public dataFoto: Photo[] = [];

  //Variabel utk key pada Local Storage yg save url" foto yg di save di firebase
  private keyFoto : string = "foto";

  constructor(public firestorage: AngularFireStorage) { }

  public async loadFoto(){
    const listFoto = await Storage.get({
      key : this.keyFoto
    });

    this.dataFoto = JSON.parse(listFoto.value) || [];
  }

  public async addFoto(){

    //Utk Buka Camera lalu ambil Foto
    const Foto = await Camera.getPhoto({
      resultType : CameraResultType.Uri,
      source : CameraSource.Camera,
      quality : 100
    });
    console.log(Foto);

    this.simpanFoto(Foto);

  }

  public async simpanFoto(foto : CameraPhoto){
    //Membuat Folder+Nama File foto yg akan disimpan di firebase storage
    const randomIdImage = Math.random().toString(36).substring(2, 8);
    const namaFile = `images/${new Date().getTime()}_${randomIdImage}.jpeg`;

    //3 perintah penting supaya foto bs diupload ke firebaase storage
    const response  = await fetch(foto.webPath); //ambil webPath yg bawaan dr Camera yaitu lokasi temporary fotonya
    const blob      = await response.blob(); //ubah foto jadi bentuk blob supaya bisa dijadiin file yg akan diupload
    const FilePhoto = new File([blob], foto.path, { type : "image/jpeg" });
    
    //Variabel utk menampung url hsl return dari firebase storage stlh upload image
    var imgurl = "";

    //Upload FilePhoto (gmbr yg mau diupload ke firebase berupa file) ke Firebase Storage
    await this.firestorage.upload(namaFile, FilePhoto). then((result) => {
      result.ref.getDownloadURL().then((url) => {
        //URL image yang telah diupload ditampung di var imgurl  
        imgurl = url;
        console.log("img urlnya: "+ url);

        var newfoto = {
          filePath : imgurl,
          namefile : namaFile
        }

        //simpan url image yg ditampung ke dlm array dataFoto supaya bs dipanggil /di load brdsr url
        this.dataFoto.unshift(newfoto);

        //simpan array dataFoto ke Storage Local
        Storage.set({
          key : this.keyFoto,
          value : JSON.stringify(this.dataFoto)
        });
      });
    });
  }
}
