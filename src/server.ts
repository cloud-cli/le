import { letsEncrypt } from './index.js';

letsEncrypt({ port: +process.env.PORT });
