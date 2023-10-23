## web3auth/modal + Safe protocol-kit + Safe relay-kit + Safe api kit

* Create .env file.
* Add web3auth client id.

```env
VITE_WEB3AUTH_CLIENT_ID=
```

```bash
pnpm install
pnpm run dev
```

Using `web3auth@modal@7.0.5` won't work. Relay kit fails. 

Not changing any code and downgrading to `web3auth@modal@4.3.1` (auth-kit version) will work.

why????
