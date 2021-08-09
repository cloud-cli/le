## LE

Lets Encrypt API

#### Usage

```ts
import { letsEncrypt } from '@cloud-cli/le';

const le = letsEncrypt({
  port: 4567,
});

le.certificateExists({ domain: 'example.com' });
le.createCertificate({ domain: 'example.com', useWildcard: true });
le.removeCertificate({ domain: 'example.com' };

```

**letsEncrypt() options**

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
