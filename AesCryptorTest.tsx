import {useEffect} from 'react';
import * as aes from './src/crypto/aes';

export const AesCryptorTest = () => {
  useEffect(() => {
    (async () => {
      console.log('LETS TEST CRYPTOR');
      const enc = await aes.encrypt('HEHE ENCRYPTING THIS', '1234');
      console.log('enc:', enc);
      const dec = await aes.decrypt(enc, '1234');
      console.log('dec:', dec);
    })();
  }, []);
  return null;
};
