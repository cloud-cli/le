import { spawnSync as sh } from 'child_process';
import { existsSync, readdirSync, rmdirSync, statSync } from 'fs';
import { join } from 'path';

const certificatesFolder = process.env.LE_CERTS_DIR || '/etc/letsencrypt/live';

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
    if (!this.isValidDomain(domain)) {
      throw new Error('A domain is required');
    }

    return existsSync(join(certificatesFolder, domain));
  }

  createCertificate({ domain, useWildcard, additionalOptions }: CreateCertificateOptions) {
    if (!this.isValidDomain(domain)) {
      throw new Error('Invalid domain: ' + domain);
    }

    const path = join(certificatesFolder, domain);
    if (existsSync(path)) {
      return true;
    }

    const domains = [domain, useWildcard ? '*.' + domain : ''].filter(Boolean);
    const domainsWithPrefix = domains.map((domain) => `-d${domain}`);
    const out = sh('certbot', ['certonly', ...(additionalOptions || []), ...domainsWithPrefix]);
    const stdout = String(out.stdout || '');
    const stderr = String(out.stderr || '').split('\n').map(s => '! ' + s).join('\n');
    const logs = stdout + '\n\n' + stderr;

    return out.status !== 0 ? Promise.reject(logs) : Promise.resolve(logs);
  }

  removeCertificate({ domain }: CertificateOptions) {
    const path = join(certificatesFolder, domain);

    if (existsSync(path)) {
      rmdirSync(path, { recursive: true });
      return true;
    }

    throw new Error('Invalid domain: ' + domain);
  }

  getCertificateList(): string[] {
    return readdirSync(certificatesFolder, { encoding: 'utf-8' }).filter((file) => {
      return statSync(join(certificatesFolder, file)).isDirectory();
    });
  }

  private isValidDomain(domain: string) {
    return domain && String(domain).length <= 253 && this.domainPattern.test(domain);
  }
}
