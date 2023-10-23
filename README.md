## web3auth/modal + Safe protocol-kit + Safe relay-kit

* Create .env file.
* Use a safe address that belongs to the signer you re going to test.

```env
VITE_WEB3AUTH_CLIENT_ID=
VITE_ETH_SEND_TO=
VITE_ETH_SIGNER_SAFE_ADDRESS=
```

```bash
pnpm run dev
```

Using `web3auth@modal@7.0.5` won't work. Relay kit fails. 

Not changing any code and downgrading to `web3auth@modal@4.3.1` (auth-kit version) will work.

why????
