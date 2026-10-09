import { CertificateManager, CertificateOptions, CreateCertificateOptions } from "./certificate-manager.js";

import { help } from "@cloud-cli/cli";

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
  le.add --domain <domain> [--domains <comma-separated-domains>] [--useWildcard] [--update] [--additionalOptions <args>] - Create/update a certificate
  le.remove --domain <domain> - Remove a certificate
  le.list - List certificates
  le.exists --domain <domain> - Check whether a certificate exists
  le.show --domain <domain> - Show certificate details
  le.showDomains --domain <domain> - Show domains in a certificate

Options:
  domain - Certificate root domain
  domains - Optional comma-separated domain list
  useWildcard - Include wildcard names
  update - Replace an existing certificate
  additionalOptions - Additional certbot arguments`,
};
