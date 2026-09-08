'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Lightbulb } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { labs, type LabId } from '@/lib/labs';
import { RegressionLab } from './regression';
import { ClassificationLab } from './classification';
import { ClusteringLab } from './clustering';
import { PCALab } from './pca';
import { NetworkLab } from './network';
import { AttentionLab } from './attention';
export function LabBrowser({ initial }: { initial: string }) {
  const router = useRouter();
  const [id, setId] = useState<LabId>(
    labs.some((l) => l.id === initial)
      ? (initial as LabId)
      : 'gradient-descent',
  );
  const current = labs.find((l) => l.id === id)!;
  return (
    <Tabs
      value={id}
      onValueChange={(v) => {
        setId(v as LabId);
        router.replace('/labs?lab=' + v, { scroll: false });
      }}
      className="lab-browser"
    >
      <TabsList className="lab-selector">
        {labs.map((l, i) => (
          <TabsTrigger value={l.id} key={l.id}>
            <span className="mono">{String(i + 1).padStart(2, '0')}</span>
            {l.title}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={id}>
        <div className="lab-title-row">
          <div>
            <div className="eyebrow">{current.category}</div>
            <h2>{current.title}</h2>
            <p>{current.description}</p>
          </div>
          <Link className="text-link" href={'/learn/' + current.lesson}>
            Read the lesson <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="lab-workspace" key={id}>
          {id === 'linear-regression' || id === 'gradient-descent' ? (
            <RegressionLab descent={id === 'gradient-descent'} />
          ) : id === 'logistic-regression' ||
            id === 'knn' ||
            id === 'decision-tree' ? (
            <ClassificationLab mode={id} />
          ) : id === 'k-means' ? (
            <ClusteringLab />
          ) : id === 'pca' ? (
            <PCALab />
          ) : id === 'neural-network' ? (
            <NetworkLab />
          ) : (
            <AttentionLab />
          )}
        </div>
        <div className="lab-question">
          <Lightbulb size={23} />
          <div>
            <strong>Try this. Then ask why.</strong>
            <p>{current.prompt}</p>
          </div>
        </div>
        <div className="lab-formula mono">{current.formula}</div>
      </TabsContent>
    </Tabs>
  );
}
