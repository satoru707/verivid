import { createFileRoute } from '@tanstack/react-router';
import { CertificatePage } from '../../components/pages/CertificatePage';

export const Route = createFileRoute('/certificate/$id')({
  component: CertificatePage,
});
