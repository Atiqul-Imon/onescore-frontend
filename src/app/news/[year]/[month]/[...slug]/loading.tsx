import { Container } from '@/components/ui/Container';
import { Loader2 } from 'lucide-react';

export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Container size="lg" className="py-24">
        <div className="flex flex-col items-center justify-center text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading Article</h2>
          <p className="text-slate-600">Please wait while we fetch the content...</p>
        </div>
      </Container>
    </div>
  );
}
