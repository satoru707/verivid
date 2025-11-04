import { createFileRoute } from '@tanstack/react-router';
import { DocsPage } from '../../components/pages/DocsPage';

export const Route = createFileRoute('/docs/')({
  component: DocsPage,
});
