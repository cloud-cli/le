import { Documentation, Gateway } from '@cloud-cli/gw';
import { createServer, Server } from 'node:http';
import { dirname, join } from 'node:path';
import { URL } from 'node:url';
import { CertificateApi } from './certificate-api.js';
import { CertificateManager, CertificateOptions, CreateCertificateOptions } from './certificate-manager.js';

export interface LetsEncryptConfiguration {
  host?: string;
  port: number;
}

export class CommandLineInterface {
  private manager = new CertificateManager();

  createCertificate(certificate: CreateCertificateOptions) {
    return this.manager.createCertificate(certificate);
  }

  removeCertificate(options: CertificateOptions) {
    return this.manager.removeCertificate(options);
  }

  listCertificates() {
    return this.manager.getCertificateList().join('\n');
  }

  certificateExists(options: CertificateOptions) {
    return this.manager.certificateExists(options);
  }

  start(configuration: LetsEncryptConfiguration): Server {
    const gw = new Gateway();
    const certificates = new CertificateApi(this.manager);
    const { port, host = '127.0.0.1' } = configuration;
    const cwd = join(dirname(new URL(import.meta.url).pathname), '..');

    gw.add('docs', new Documentation(cwd));
    gw.add('certificates', certificates);

    console.log(`LetsEncrypt running at http://${host}:${port}`);
    return createServer((request, response) => gw.dispatch(request, response)).listen(port, host);
  }
}
