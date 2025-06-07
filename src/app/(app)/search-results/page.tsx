
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BilingualText } from '@/components/shared/BilingualText';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ArrowLeft, Search } from 'lucide-react';

// Mock search results structure
interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  type: 'Book' | 'Project' | 'Stationery' | 'AI Tip';
  link: string;
  imageUrl?: string;
  dataAiHint?: string;
}

const mockSearchResults: SearchResultItem[] = [
    { id: 'book1', title: 'NCERT Maths Class 10', description: 'Full syllabus textbook for CBSE Class 10 Mathematics.', type: 'Book', link: '/class-6-12-books/c10_math_e', imageUrl: 'https://placehold.co/100x120.png', dataAiHint: 'maths textbook' },
    { id: 'project1', title: 'DIY Volcano Model', description: 'Complete kit and guide to build a working volcano model.', type: 'Project', link: '/services/projects?id=volcano', imageUrl: 'https://placehold.co/100x120.png', dataAiHint: 'volcano science' },
    { id: 'stationery1', title: 'Classmate Notebook Pack (Set of 5)', description: 'Ruled notebooks for all subjects.', type: 'Stationery', link: '/delivery?item=notebook_pack', imageUrl: 'https://placehold.co/100x120.png', dataAiHint: 'notebooks school' },
    { id: 'ai1', title: 'How to solve quadratic equations?', description: 'AI Guruji explains step-by-step.', type: 'AI Tip', link: '/ai-guruji?query=quadratic+equations', imageUrl: 'https://placehold.co/100x120.png', dataAiHint: 'ai learning' },
    { id: 'book2', title: 'Physics Concepts by H.C. Verma', description: 'In-depth physics concepts for competitive exams.', type: 'Book', link: '/competitive-bookstore/hc_verma_physics', imageUrl: 'https://placehold.co/100x120.png', dataAiHint: 'physics book' },
];


export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q');
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<SearchResultItem[]>([]);

  useEffect(() => {
    setIsLoading(true);
    if (query) {
      // Simulate API call for search results
      setTimeout(() => {
        const filteredResults = mockSearchResults.filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.type.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredResults);
        setIsLoading(false);
      }, 1000);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline text-primary flex items-center gap-2">
            <Search className="h-7 w-7" />
            <BilingualText en="Search Results" hi="खोज परिणाम" />
          </h1>
          {query && (
            <p className="text-muted-foreground">
              <BilingualText en={`For: "${query}"`} hi={`इसके लिए: "${query}"`} />
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <BilingualText en="Back" hi="वापस" />
        </Button>
      </header>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10">
          <LoadingSpinner size={40} />
          <p className="mt-3 text-muted-foreground">
            <BilingualText en="Searching..." hi="खोज रहा है..." />
          </p>
        </div>
      )}

      {!isLoading && results.length === 0 && (
        <Card className="text-center py-10">
          <CardContent>
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              <BilingualText en="No results found for your query." hi="आपकी खोज के लिए कोई परिणाम नहीं मिला।" />
            </p>
            {query && <p className="text-sm text-muted-foreground mt-1"><BilingualText en={`Try searching for something else, or check your spelling.`} hi={`कुछ और खोजने का प्रयास करें, या अपनी वर्तनी जांचें।`} /></p>}
          </CardContent>
        </Card>
      )}

      {!isLoading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-start gap-4">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} className="w-20 h-24 object-cover rounded-md bg-muted data-ai-hint={item.dataAiHint || 'search result'}" />
                )}
                <div className="flex-grow">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm">{item.type}</span>
                  <h3 className="text-md font-semibold mt-1 mb-0.5 hover:text-primary">
                    <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
                <Button variant="ghost" size="sm" asChild className="self-start">
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                        <BilingualText en="View" hi="देखें"/> <ArrowLeft className="transform rotate-180 ml-1 h-3 w-3"/>
                    </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
