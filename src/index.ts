import { CertificateManager, CertificateOptions, CreateCertificateOptions } from './certificate-manager.js';

const  manager = new CertificateManager();

export default {
  add(certificate: CreateCertificateOptions) {
    return manager.createCertificate(certificate);
  },

  remove(options: CertificateOptions) {
    return manager.removeCertificate(options);
  },

  list() {
    return manager.getCertificateList();
  },

  exists(options: CertificateOptions) {
    return manager.certificateExists(options);
  },
}
