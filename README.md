# Let's Encrypt certificates

SSL certificate generation.
Requires `certbot` to be installed on server and properly configured for Let's Encrypt certs

## API

**Create a certificate for example.com**

```
cy le.add --domain example.com
```

**Update a certificate with domain example.com and all its subdomains**

```
cy le.add --domain example.com --useWildcard 1 --update
```

**Remove a certificate**

```
cy le.remove --domain example.com
```

**Check if a certificate exists**

```
cy le.exists --domain example.com
```

**List certificates by domains**

```
cy le.list
```

**Show certificate by domains**

```
cy le.show --domain example.com
```

**Show certificate domains**

```
cy le.showDomains --domain example.com
```

