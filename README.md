# `mta-sts` Cloudlfare worker

Template for a Cloudflare worker for handling the MTA STS policy file.

Create a copy of this template and connect it via the github feature from Cloudflare workers:

<img width="310" height="345" alt="SCR-20250717-orqf" src="https://github.com/user-attachments/assets/1c7f2a72-4e21-4008-8826-67b45cbb2ade" />

and then: 

<img width="603" height="98" alt="SCR-20250717-opyc" src="https://github.com/user-attachments/assets/2d42550e-5f93-4d07-a9d0-d78aeb2ff11e" />


---

This worker is designed to be able to neatly handle MTA-STS policies for multiple domains.

- Make a new worker with this script and add your domains to the `stsPolicies` dict like the example.
- Add a DNS `AAAA` record for `mta-sts.yourdomain.com` pointing to `100::` and set to proxied,
- Then add a workers route for `mta-sts.yourdomain.com/*` pointing to this worker.
- You should probably also create a Cloudflare configuration rule disabling Browser Integrity Check for the mta-sts subdomain to ensure MTAs aren't blocked from retrieving your policy.
- You'll still need to manually add the appropriate `_mta-sts.yourdomain.com` `TXT` record to enable the policy, and the `_smtp._tls.yourdomain.com` `TXT` record for reporting.

---
