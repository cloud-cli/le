import { CertificateManager, CertificateOptions, CreateCertificateOptions } from './certificate-manager.js';
import { Gateway } from '@cloud-cli/gw';
import { createServer } from 'http';
import { CertificateApi } from './certificate-api.js';

export interface LetsEncryptConfiguration {
  host?: string;
  port: number;
}

export class CommandLineInterface {
  private manager = new CertificateManager();

  createCertificate(certificate: CreateCertificateOptions) {
    this.manager.createCertificate(certificate);
  }

  removeCertificate(options: CertificateOptions) {
    this.manager.removeCertificate(options);
  }

  listCertificates() {
    return this.manager.getCertificateList().join('\n');
  }

  certificateExists(options: CertificateOptions) {
    return this.manager.certificateExists(options);
  }

  start(configuration: LetsEncryptConfiguration): void {
    const gw = new Gateway();
    const certificates = new CertificateApi(this.manager);
    const { port, host = '127.0.0.1' } = configuration;

    gw.add('certificates', certificates);

    createServer((request, response) => gw.dispatch(request, response)).listen(port, host);
    console.log(`LetsEncrypt running at http://${host}:${port}`);
  }
}
