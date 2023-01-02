import { CertificateManager, CertificateOptions, CreateCertificateOptions } from './certificate-manager.js';

const  manager = new CertificateManager();

export default {
  createCertificate(certificate: CreateCertificateOptions) {
    return manager.createCertificate(certificate);
  },

  removeCertificate(options: CertificateOptions) {
    return manager.removeCertificate(options);
  },

  listCertificates() {
    return manager.getCertificateList();
  },

  certificateExists(options: CertificateOptions) {
    return manager.certificateExists(options);
  },
}
