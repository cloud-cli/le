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
  domains?: string;
}

export interface CreateCertificateOptions extends CertificateOptions {
  useWildcard: boolean;
  additionalOptions?: string[];
  update: boolean;
}

export class CertificateManager {
  private readonly domainPattern = /^[a-z0-9-.]+$/i;

  certificateExists({ domain }: CertificateOptions) {
    if (!this.isValidDomain(domain)) {
      throw new Error('A domain is required');
    }

    return existsSync(join(certificatesFolder, domain));
  }

  createCertificate({ domain, domains, useWildcard, additionalOptions, update }: CreateCertificateOptions) {
    const path = join(certificatesFolder, domain);
    if (existsSync(path) && !update) {
      return true;
    }

    const listOfDomains = domains ? domains.split(',').map(s => s.trim()) : [domain];

    for (const d of listOfDomains) {
      if (!this.isValidDomain(d)) {
        throw new Error('Invalid domain: ' + d);
      }
    }

    const domainsWithStar = !useWildcard ? listOfDomains : listOfDomains.flatMap(d => [d, '*.' + d]);
    const domainsWithPrefix = domainsWithStar.flatMap((domain) => ['-d', domain]);
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

  async getCertificate({ domain }: CertificateOptions) {
    const pemFile = join(certificatesFolder, domain, 'cert.pem');

    if (!existsSync(pemFile)) {
      throw new Error('Invalid domain: ' + domain);
    }

    const out = sh('openssl', ['x509', '-in', pemFile, '-noout', '-text']);

    if (out.status !== 0) {
      throw new Error(String(out.stderr));
    }

    return String(out.stdout);
  }

  async getDomainsFromCert({ domain }: CertificateOptions) {
    const cert = await this.getCertificate({ domain });
    const line = String(cert).split('\n').find(s => s.includes('DNS:'));

    if (line) {
      return line.split(',').map(p => p.replace('DNS:', '').trim());
    }

    return [];
  }

  private isValidDomain(domain: string) {
    return domain && String(domain).length <= 253 && this.domainPattern.test(domain);
  }
}
