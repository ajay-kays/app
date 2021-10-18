import {useEffect} from 'react';
import {NativeModules, Platform} from 'react-native';
import AesType from 'react-native-aes-crypto';

// Assumes Android(?)
const Aes: typeof AesType = NativeModules.Aes;

const generateKey = (password, salt, cost, length) =>
  Aes.pbkdf2(password, salt, cost, length);

const encryptData = (text, key) => {
  return Aes.randomKey(16).then(iv => {
    return Aes.encrypt(text, key, iv).then(cipher => ({
      cipher,
      iv,
    }));
  });
};

const decryptData = (encryptedData, key) =>
  Aes.decrypt(encryptedData.cipher, key, encryptedData.iv);

export const AesTest = () => {
  useEffect(() => {
    try {
      generateKey('Arnold', 'salt', 5000, 256).then(key => {
        console.log('Key:', key);
        encryptData('These violent delights have violent ends', key)
          .then(({cipher, iv}) => {
            console.log('Encrypted:', cipher);

            decryptData({cipher, iv}, key)
              .then(text => {
                console.log('Decrypted:', text);
              })
              .catch(error => {
                console.log(error);
              });

            Aes.hmac256(cipher, key).then(hash => {
              console.log('HMAC', hash);
            });
          })
          .catch(error => {
            console.log(error);
          });
      });
    } catch (e) {
      console.error(e);
    }
  }, []);
  return null;
};
