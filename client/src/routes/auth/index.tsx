import { createFileRoute } from '@tanstack/react-router';
import { AuthPage } from '../../components/pages/AuthPage';

export const Route = createFileRoute('/auth/')({
  component: AuthPage,
});
