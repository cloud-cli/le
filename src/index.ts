import { Gateway } from '@cloud-cli/gw';
import { createServer } from 'http';
import { CertificateApi } from './certificate-api.js';
import { Certificate, CertificateManager } from './certificate-manager.js';

export { CertificateManager, Certificate };

export default function (host?: string, port?: number): CertificateManager {
  const gw = new Gateway();
  const manager = new CertificateManager();
  const certificates = new CertificateApi(manager);

  gw.add('certificates', certificates);

  createServer((request, response) => gw.dispatch(request, response)).listen(
    port || Number(process.env.PORT),
    host || process.env.HOST,
  );

  return manager;
}
