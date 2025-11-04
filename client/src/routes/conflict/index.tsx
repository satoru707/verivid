import { createFileRoute } from '@tanstack/react-router';
import { ConflictPage } from '../../components/pages/ConflictPage';

export const Route = createFileRoute('/conflict/')({
  component: ConflictPage,
});
