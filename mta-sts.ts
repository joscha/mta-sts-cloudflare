import { stsPolicies } from "./sts-policies";

const RESP_HEADERS = { "Content-Type": "text/plain;charset=UTF-8" };
const WELL_KNOWN_PATH = "/.well-known/mta-sts.txt";

addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (!url.hostname.startsWith("mta-sts.")) {
    return new Response(
      "Incorrect worker route. mta-sts policies must be served on the mta-sts subdomain\n",
      { status: 500, headers: RESP_HEADERS }
    );
  }

  const domain = url.hostname.slice(8);
  const policy = stsPolicies[domain];

  if (!policy) {
    return new Response(
      `${domain} is not defined in the mta-sts worker\n`,
      { status: 500, headers: RESP_HEADERS }
    );
  }

  if (url.protocol !== "https:" || url.pathname !== WELL_KNOWN_PATH) {
    url.protocol = "https:";
    url.pathname = WELL_KNOWN_PATH;
    return Response.redirect(url.toString(), 301);
  }

  const ret = policy
    .split(/\s*\n\s*/)
    .filter(Boolean)
    .join("\n")
    .trim();

  return new Response(ret + "\n", {
    status: 200,
    headers: RESP_HEADERS
  });
}
  
