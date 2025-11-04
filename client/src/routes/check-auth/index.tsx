import { createFileRoute } from '@tanstack/react-router';
import { CheckAuthenticityPage } from '../../components/pages/CheckAuthenticityPage';

export const Route = createFileRoute('/check-auth/')({
  component: CheckAuthenticityPage,
});
