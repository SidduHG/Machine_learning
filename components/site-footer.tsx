import Link from 'next/link';
import { Layers3 } from 'lucide-react';
export function SiteFooter(){return <footer className="site-footer"><div className="wrap footer-inner"><Link href="/" className="brand"><Layers3 size={20}/> ml<span className="brand-light">atlas.</span></Link><p>Made for the joy of understanding.</p><div><Link href="/resources">Resources & sources</Link><a href="https://github.com/SidduHG/Machine_learning">GitHub ↗</a></div></div></footer>}
