import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Md5} from 'ts-md5/dist/md5';
import { AES256 } from '@ionic-native/aes-256';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
//import {EVP_BytesToKey } from 'evp_bytestokey/index.js';
//npm i ts-md5

declare var require: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  public  PinEncryptLoginKey = "<RSAKeyValue><Modulus>uw8i9hol4s/Ik+2AfhGhnexjSoEsIP6EYL+VqxPImffT/a5S9Ic1G1/a65AeOkjkJHNhHFPw0a6fDtabLo4CQPoUZCAWMbr6rytrbZUWBYPcH4IUyTjAof2RLStJXvOSlDH1ZmG1YdBeWxZO5C2y2qAV+mO0fxm/wWuBp7SzJ3k=</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>";
 
  public encryptedDeviceID: any;
  public encryptedPlatform: any;
  public toPrint: any;
  public deviceIdentifier: any;
  public devicePlatf = "Android";
  public encryptedDeviceIDArray = [];
  public keyOT = "h[÷(iÝ&w'mó¦f§-ËFt)¼ÌÞö³áÃ"
  public ivOT = "7¯8P_à;ê<fs(@"
  public deviceID = "3fd7fdf46641282b";

  public salt = [36, 98, 147, 180, 164, 235, 189, 75];


  public encryptedPlatformArray: Array<any> = [];


  constructor(
    
    public navCtrl: NavController,
    private aes256: AES256,
    private uniqueDeviceID: UniqueDeviceID,

    
    //private evp : EVP_BytesToKey

  ) {
    
   /*  debugger;
    const aesjs = require('aes-js');
    debugger
    let aesCbc = aesjs.ModeOfOperation.cbc("93b241140d889e0b30ac9f46a552d3de", "b6833df3a75c5dc7");
    let encryptedBytes = aesCbc.encrypt("f07a13984f6d116a");
    debugger */



    this.aes256.encrypt(this.keyOT, this.ivOT, "3fd7fdf46641282b")
      .then(res => {
       console.log('Encrypted Data: ',res);
        this.encryptedDeviceID = res;
       })
      .catch((error: any) => console.error(error)); 

     



    
    //this.encrypt();
   
   // this.generateSecureKeyAndIV(this.PinEncryptLoginKey, this.salt); // To generate the random secureKey and secureIV
 }


 async generateSecureKeyAndIV(passphrase: any, salt: any) {
  debugger

 /*  this.uniqueDeviceID.get()
  .then((uuid: any) =>{
     console.log(uuid);
     this.deviceIdentifier = uuid;

  })
  .catch((error: any) => console.log(error)); */

   let concatenatedHashes: Array<any> = [];

  
    let password: Array<any> = this.toUTF8Array(passphrase);

    let currentHash: any = [];
           
    let enoughBytesForKey = false;
            // See http://www.openssl.org/docs/crypto/EVP_BytesToKey.html#KEY_DERIVATION_ALGORITHM  
            while (!enoughBytesForKey)
            {
                let preHashLength: number = currentHash.length + password.length + salt.Length;
                let preHash: Array<any> = [];
                //preHash.length = preHashLength;
                


                //Buffer.BlockCopy(currentHash, 0, preHash, 0, currentHash.Length);
                for(let i=0,j =0, l = currentHash.length; l>0; i++, j++, l--){
                  preHash.push(currentHash[i]);
                }
                
                //  Buffer.BlockCopy(password, 0, preHash, currentHash.Length, password.Length);
                for(let i=0,j =currentHash.length, l = password.length; l>0; i++, j++, l--){
                  preHash.push(password[i]);
                }

                
              
                //Buffer.BlockCopy(salt, 0, preHash, currentHash.Length + password.Length, salt.Length);
                for(let i=0,j =currentHash.length + password.length , l = salt.length; l>0; i++, j++, l--){
                  preHash.push(salt[i]);
                }

                let ASCIIpreHash = [];

                for(let i = 0; i< preHash.length; i++){
                  ASCIIpreHash.push(String.fromCharCode(preHash[i]));

                }




                let preAsciiHashString = ASCIIpreHash.join('');

                //Insert a new line character when we find a specific pattern (upper case letter followed by +), the pattern is found and used using regular expression
               
                //let regexp: RegExp = /([A-Z])(\+)/;

             
               
               // let finalPreAsciiString = preAsciiHashString.replace(regexp, '$1\n$2');




          /*       currentHash = md5.ComputeHash(preHash);
                concatenatedHashes.AddRange(currentHash);
 */
            
                currentHash = Md5.hashAsciiStr(preAsciiHashString);

                let tempCurrentHash = [];

                let chunks = []; 
                for (let i = 0, charsLength = currentHash.length; i < charsLength; i += 2) 
                { chunks.push(currentHash.substring(i, i + 2)); }

                for(let i = 0; i<chunks.length; i++){

                  tempCurrentHash.push(parseInt(chunks[i], 16) );

                }
                //currentHash = parseInt(currentHash);

                currentHash = [];
                currentHash = tempCurrentHash;
               
               
                for(let i = 0; i<currentHash.length; i++){

                  concatenatedHashes.push(currentHash[i]);

                }


             
               
/*  
                
                if (concatenatedHashes.Count >= 48)
                    enoughBytesForKey = true;
             */


             if (concatenatedHashes.length  >= 48){
               enoughBytesForKey =  true;
             }
             


            


           


 }


/*  key = new byte[32];
 iv = new byte[16];

 concatenatedHashes.CopyTo(0, key, 0, 32);
 concatenatedHashes.CopyTo(32, iv, 0, 16);

 md5.Clear();
 md5 = null; */

      let key: any = [];
      let iv: any = [];

      for (let i = 0; i<32; i++){
        key[i] = concatenatedHashes [i];
      }

      let keyString: string = key.join('');


      for (let i = 0, j= 32; j<48; i++, j++){
        iv[i] = concatenatedHashes [j];
      }


      let ivString: string = iv.join('');
 
      let outputKey = this.toUTF8Array(keyString);
      let outputIV = this.toUTF8Array(ivString); 

     // this.EncryptStringToBytesAes(this.deviceID, key, iv);
     // this.EncryptStringToBytesAes(this.devicePlatf, key, iv);
      //4529cffb0a03ecb70681de509d07b3e1
      debugger

      this.aes256.encrypt(keyString, ivString, "3fd7fdf46641282b")
      .then(res => {
       console.log('Encrypted Data: ',res);
        this.encryptedDeviceID = res;
       })
      .catch((error: any) => console.error(error)); 


      //this.encrypt();
     
}

 

 public encrypt() {
 debugger
 debugger
 
 /*  this.aes256.encrypt(this.secureKey, this.secureIV, '28483430-C999-466D-989B-CA06C1AA2894')
  .then(res => {
    console.log('Encrypted Data: ',res);
    this.toPrint  = res;
  })
  .catch((error: any) => console.error(error)); 
 */


  //Add the newly generated salt to the beginning of the AES encrypted value




  

  // this.encryptedDeviceID = 'rp/RpVq7Iz/izwVzPBoE7WgvY9h2QexmPtjYF3T4VJY='; 
  // this.encryptedPlatform = 'Qc2dmIGehiI6FRhTD66utA==';
  this.encryptedDeviceIDArray = this.encryptedDeviceID.split('');
  debugger
  let tempEncryptedDeviceIDArray = [];
  for (let i = 0; i< this.encryptedDeviceIDArray.length; i++){
    tempEncryptedDeviceIDArray.push(btoa(this.encryptedDeviceIDArray[i]));
  }
  //this.encryptedPlatformArray = this.encryptedPlatform.split('');

  debugger
  let encryptedDeviceIDwithSalt: Array<any> = [];
  let encryptedPlatformwithSalt: Array<any> = [];
    //Encode UTF8 to byte
    let salt1 = this.salt.join('');
    debugger
    let saltedString = btoa("Salted_");
    let saltedArray = saltedString.split("");
    let salt2 = btoa(salt1);
    let salt3 = salt2.split('');
    let salt4 = []
    if (salt3.length>= 8){
      for (let i = 0; i < 8; i++){
        salt4.push(salt3[i]);
      }
    }

    let finalSalt = salt4.join('');
    //equivalent of blockCopy1
    //i is the offset of the source array, j is the offset of the destination array, l is the length of the bytes to copy
  
    for(let i=0,j =0, l = saltedArray.length; l>0; i++, j++, l--){
      encryptedDeviceIDwithSalt.push(saltedArray[i]);
    }
  
  
  for (let i = 0, j = salt4.length-1, l = salt4.length; l>0; i++, j++, l--){
    encryptedDeviceIDwithSalt.push(salt4[i])

  }

  for  (let i = 0, j = encryptedDeviceIDwithSalt.length-1; i< this.encryptedDeviceIDArray.length; i++, j++){
    encryptedDeviceIDwithSalt.push(this.encryptedDeviceIDArray[i]);
  }
  



  debugger
  let output = encryptedDeviceIDwithSalt.join('');

 

  let base64 = btoa(output);
 
  
debugger
   
}



public EncryptStringToBytesAes(plainText: any, key: any, iv: any)
        {
            // Check arguments.     
            if (plainText == null || plainText.Length <= 0)
                console.log("Null plainText");
            if (key == null || key.Length <= 0)
                console.log("Null key");
            if (iv == null || iv.Length <= 0)
                console.log(" Null iv");

            // Declare the stream used to encrypt to an in memory   
            // array of bytes.  
          
            //let encryptedByteArray = crypt.Encrypt(plainText, iv, key, cipherName, mode);

            
        } 

toUTF8Array(str: any) {
  var utf8 = [];
  for (var i=0; i < str.length; i++) {
      var charcode = str.charCodeAt(i);
      if (charcode < 0x80) utf8.push(charcode);
      else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6), 
                    0x80 | (charcode & 0x3f));
      }
      else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12), 
                    0x80 | ((charcode>>6) & 0x3f), 
                    0x80 | (charcode & 0x3f));
      }
      // surrogate pair
      else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                    | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18), 
                    0x80 | ((charcode>>12) & 0x3f), 
                    0x80 | ((charcode>>6) & 0x3f), 
                    0x80 | (charcode & 0x3f));
      }
  }
  return utf8;
}

shuffle(array: Array<any>) {
  let tmp, current, top = array.length;
  if(top) while(--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }
  return array;
}




}
