import type { NextConfig } from 'next';
import path from 'node:path';
const config: NextConfig = { outputFileTracingRoot:path.resolve(process.cwd(),'../..'),turbopack:{root:path.resolve(process.cwd(),'../..')},poweredByHeader: false, async headers() { return [{source:'/(.*)',headers:[{key:'Referrer-Policy',value:'no-referrer'},{key:'X-Content-Type-Options',value:'nosniff'},{key:'X-Frame-Options',value:'DENY'}]}]; }};
export default config;
