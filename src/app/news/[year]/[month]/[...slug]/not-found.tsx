import { Container } from '@/components/ui/Container';
import { AlertCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function ArticleNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Container size="lg" className="py-24">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h2>
          <p className="text-slate-600 mb-6">
            The article you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-700 hover:shadow-xl"
          >
            <BookOpen className="h-4 w-4" />
            Browse All News
          </Link>
        </div>
      </Container>
    </div>
  );
}
