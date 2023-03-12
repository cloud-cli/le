# Let's Encrypt certificates

## Usage

As a module:

```ts
import le from '@cloud-cli/le';

le.exists({ domain: 'example.com' });
le.add({ domain: 'example.com', useWildcard: true });
le.remove({ domain: 'example.com' };

```

With Cloudy CLI:

```ts
import le from '@cloud-cli/le';
import { cli } from '@cloud-cli/cy';

cli.add('le', le);
```

## API

**Create a certificate**

```
cy cert.add --domain example.com --useWildcard

```

**Remove a certificate**

```
cy cert.remove --domain example.com
```

**Check if a certificate exists**

```
cy cert.exists --domain example.com
```
**List certificates**

```
cy cert.list
```

