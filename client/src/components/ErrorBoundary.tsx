import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Alert variant="destructive" className="max-w-xl">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription className="mt-2">{error.message}</AlertDescription>
        <Button
          variant="destructive"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Alert>
    </div>
  );
}
