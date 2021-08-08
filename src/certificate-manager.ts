import { existsSync, rmdirSync } from 'fs';
import { join } from 'path';
import { spawnSync as sh } from 'child_process';

const certificatesFolder = process.env.LE_CERTS_DIR || join('etc', 'letsencrypt', 'live');

export interface Certificate {
  rootDomain: string;
  certificate: string;
  key: string;
}

export interface CertificateOptions {
  domain: string;
}

export interface CreateCertificateOptions extends CertificateOptions {
  useWildcard: boolean;
  additionalOptions?: string[];
}

export class CertificateManager {
  private readonly domainPattern = /^[a-z0-9-.]+$/i;

  certificateExists({ domain }: CertificateOptions) {
    return existsSync(certificatesFolder + domain);
  }

  createCertificate({ domain, useWildcard, additionalOptions }: CreateCertificateOptions) {
    if (!this.isValidDomain(domain)) {
      throw new Error('Invalid domain: ' + domain);
    }

    const domains = [domain, useWildcard ? '*.' + domain : domain].filter(Boolean);
    const domainsWithPrefix = domains.map((domain) => `-d'${domain}'`);
    additionalOptions = (additionalOptions || []).map((option) => `--'${option}'`);

    return sh('certbot', ['certonly', '--agree-tos', '--force-renewal', ...additionalOptions, ...domainsWithPrefix]);
  }

  removeCertificate({ domain }: CertificateOptions) {
    const path = join(certificatesFolder, domain);

    if (existsSync(path)) {
      rmdirSync(path, { recursive: true });
    }
  }

  private isValidDomain(domain: string) {
    return domain.length <= 253 && this.domainPattern.test(domain);
  }
}
