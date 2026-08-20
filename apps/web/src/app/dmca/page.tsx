import { permanentRedirect } from 'next/navigation';

export default function LegacyDmcaRedirect() {
  permanentRedirect('/dmca-disclaimer');
}
