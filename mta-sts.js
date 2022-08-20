// This worker is designed to be able to neatly handle MTA-STS policies for multiple domains.

// Make a new worker with this script and add your domains to the stsPolicies dict like the example.
// Add a DNS AAAA record for mta-sts.yourdomain.com pointing to 100:: and set to proxied,
// then add a workers route for mta-sts.yourdomain.com/* pointing to this worker.

// You'll still need to manually add the appropriate _mta-sts.yourdomain.com TXT record to enable the policy, 
// and the _smtp._tls.yourdomain.com TXT record for reporting.

const stsPolicies = {
  "yourdomain.com":
`version: STSv1
mode: enforce
mx: mail.yourdomain.com
max_age: 86400`
}


const respHeaders = {
  "Content-Type": "text/plain;charset=UTF-8",
  "X-Clacks-Overhead": "GNU Terry Pratchett, Jon Postel, Alan Turing, Dan Kaminsky"
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const reqUrl = new URL(request.url)

  if (!reqUrl.hostname.startsWith("mta-sts.")) {
    return new Response(`Incorrect worker route. mta-sts policies must be served on the mta-sts subdomain\n`, {status: 500, headers: respHeaders})
  }

  const policyHost = reqUrl.hostname.slice(8)

  if (!stsPolicies.hasOwnProperty(policyHost)) {
    return new Response(`${policyHost} is not defined in the mta-sts worker\n`, {status: 500, headers: respHeaders})
  }

  if (reqUrl.protocol !== "https:" || reqUrl.pathname !== "/.well-known/mta-sts.txt") {
    reqUrl.protocol = "https:"
    reqUrl.pathname = "/.well-known/mta-sts.txt"
    return Response.redirect(reqUrl, 301)
  }

  return new Response(stsPolicies[policyHost] + "\n", {status: 200, headers: respHeaders})
}
