## LE

Lets Encrypt API

#### Usage

As a module:

```ts
import le from '@cloud-cli/le';

le.start({ port: 4567 });

le.certificateExists({ domain: 'example.com' });
le.createCertificate({ domain: 'example.com', useWildcard: true });
le.removeCertificate({ domain: 'example.com' };

```

With Cloudy CLI:

```ts
import le from '@cloud-cli/le';
import { cli } from '@cloud-cli/cy';

cli.add('le', le);
```

**start() options**

| Property | Type   | Default     |
| -------- | ------ | ----------- |
| `host`   | String | '127.0.0.1' |
| `port`   | Number |             |

#### HTTP API

**Create a certificate**

```
POST /certificates

{
  "domain": "example.com",
  "useWildcard": true,
}

```

**Delete a certificate**

```
DELETE /certificates/example.com
```

**Check if a certificate exists**

```
HEAD /certificates/example.com
```
