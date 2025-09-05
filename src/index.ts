import { CertificateManager, CertificateOptions, CreateCertificateOptions } from './certificate-manager.js';

const manager = new CertificateManager();
const readDomain = (options) => {
  options.domain ||= options._.shift();
}

export default {
  add(certificate: CreateCertificateOptions) {
    readDomain(certificate);
    return manager.createCertificate(certificate);
  },

  remove(options: CertificateOptions) {
    readDomain(options);
    return manager.removeCertificate(options);
  },

  list() {
    return manager.getCertificateList();
  },

  exists(options: CertificateOptions) {
    readDomain(options);
    return manager.certificateExists(options);
  },

  show(options: CertificateOptions) {
    readDomain(options);
    return manager.getCertificate(options);
  },

  showDomains(options: CertificateOptions) {
    readDomain(options);
    return manager.getDomainsFromCert(options);
  }
}
