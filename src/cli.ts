import { CertificateManager, CertificateOptions, CreateCertificateOptions } from './certificate-manager';

export class CommandLineInterface {
  constructor(private manager: CertificateManager) {}
  createCertificate(certificate: CreateCertificateOptions) {
    this.manager.createCertificate(certificate);
  }

  removeCertificate(options: CertificateOptions) {
    this.manager.removeCertificate(options);
  }

  listCertificates() {
    return this.manager.getCertificateList().join('\n');
  }

  exists(options: CertificateOptions) {
    return this.manager.certificateExists(options);
  }
}
