'use client';
import { lazy, Suspense, useState } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
const StudyChat = lazy(() => import('./study-chat'));
export function StudyAssistant() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="study-trigger">
        <MessageCircle size={20} />
        <span>Ask Atlas</span>
      </SheetTrigger>
      <SheetContent className="tutor-sheet">
        <SheetHeader className="tutor-header">
          <div className="tutor-avatar">
            <Sparkles size={22} />
          </div>
          <div>
            <SheetTitle>Ask Atlas</SheetTitle>
            <SheetDescription>Your companion for the course</SheetDescription>
          </div>
        </SheetHeader>
        {open && (
          <Suspense
            fallback={
              <div className="tutor-loading">Opening your study guide…</div>
            }
          >
            <StudyChat />
          </Suspense>
        )}
      </SheetContent>
    </Sheet>
  );
}
