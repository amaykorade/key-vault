import dynamic from 'next/dynamic';

const RedocStandalone = dynamic(
  () => import('redoc').then(mod => mod.RedocStandalone),
  { ssr: false }
);

export default function DocsPage() {
  return (
    <div style={{ height: '100vh' }}>
      <RedocStandalone specUrl="/openapi.yaml" />
    </div>
  );
} 