import {
  CertificateManager,
  CertificateOptions,
  CreateCertificateOptions,
} from "./certificate-manager.js";

import { help } from '@cloud-cli/cli';

const manager = new CertificateManager();
const readDomain = (options) => {
  options.domain ||= options._.shift();
};

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
  },

  [help]: () => `Manage SSL/TLS certificates

Available commands:
  le add [domain] - Create a new SSL certificate for a domain
  le remove [domain] - Remove an existing certificate
  le list - List all certificates
  le exists [domain] - Check if a certificate exists
  le show [domain] - Show certificate details
  le showDomains - Show domains from certificate

Options:
  domain - Domain name for the certificate
  email - Email for Let's Encrypt registration`,
};
