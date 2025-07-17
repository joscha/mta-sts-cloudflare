export const stsPolicies: Record<string, string> = {
  "yourdomain.com": ` 
                version: STSv1
                mode: enforce
                mx: smtp.google.com
                mx: aspmx.l.google.com
                mx: *.aspmx.l.google.com
                max_age: 604800
            `,
};
