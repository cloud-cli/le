import { Request, Resource, Response } from '@cloud-cli/gw';
import { decode } from 'querystring';
import { CertificateManager, CreateCertificateOptions } from './certificate-manager.js';

export class CertificateApi extends Resource {
  body = { json: {} };

  constructor(private manager: CertificateManager) {
    super();
  }

  get(_: Request, response: Response): void {
    response.writeHead(200);
    response.end(JSON.stringify(this.manager.getCertificateList()));
  }

  head(request: Request, response: Response): void {
    const domainInUrl = this.readDomainFromUrl(request.url);
    const domain = this.sanitiseDomain(domainInUrl);
    const httpStatus = this.manager.certificateExists({ domain }) ? 200 : 404;

    response.writeHead(httpStatus);
    response.end();
  }

  post(request: Request, response: Response): void | Promise<any> {
    const { domain, useWildcard } = request.body as CreateCertificateOptions;

    try {
      this.manager.createCertificate({ domain, useWildcard });
      response.writeHead(201);
      response.end();
    } catch (error) {
      response.writeHead(400);
      response.end(error.message);
    }
  }

  delete(request: Request, response: Response) {
    const domain = this.readDomainFromUrl(request.url);

    if (!domain) {
      response.writeHead(400);
      response.end();
      return;
    }

    try {
      this.manager.removeCertificate({ domain });
      response.writeHead(200);
    } catch {
      response.writeHead(500);
    }

    response.end();
  }

  private readDomainFromUrl(url: string): string {
    const query = decode(url);
    return String(query.domain);
  }

  private sanitiseDomain(domain: string) {
    return domain.replace(/[^a-z0-9-.]+/g, '');
  }
}
