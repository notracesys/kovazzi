'use client';

import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { names } from '@/lib/names';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';

export default function SalesNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentName, setCurrentName] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const showRandomNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      setCurrentName(randomName);
      setIsVisible(true);

      timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // Show for 5 seconds
    };

    // Show the first notification after a delay
    const initialTimeout = setTimeout(showRandomNotification, 8000);

    const interval = setInterval(() => {
      showRandomNotification();
    }, Math.random() * (10000 - 5000) + 5000); // Then every 5-10 seconds

    return () => {
      clearTimeout(timer);
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-50 w-full max-w-[280px] transition-transform duration-500 ease-in-out",
        isVisible ? "translate-x-0" : "-translate-x-[calc(100%+2rem)]"
      )}
    >
      <Card className="p-3 shadow-2xl bg-background/80 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary p-2 rounded-full">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="text-sm">
            <p className="font-bold text-foreground">{currentName}</p>
            <p className="text-muted-foreground">acabou de adquirir o método.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
