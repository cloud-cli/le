import { Gateway } from '@cloud-cli/gw';
import { createServer } from 'http';
import { CertificateApi } from './certificate-api.js';
import { Certificate, CertificateManager } from './certificate-manager.js';
import { CommandLineInterface } from './cli.js';

const manager = new CertificateManager();
const cli = new CommandLineInterface(manager);

export default cli;

export { CertificateManager, Certificate };

export function letsEncrypt(configuration: LetsEncryptConfiguration): CertificateManager {
  const gw = new Gateway();
  const certificates = new CertificateApi(manager);

  gw.add('certificates', certificates);

  const { port, host = '127.0.0.1' } = configuration;
  createServer((request, response) => gw.dispatch(request, response)).listen(port, host);

  return manager;
}

export interface LetsEncryptConfiguration {
  host?: string;
  port: number;
}
