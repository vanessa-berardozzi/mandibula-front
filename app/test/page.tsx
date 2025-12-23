import { Card } from '@/components/ui/card';

export default function TestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-linear-to-br from-orange-400 to-purple-400">
      <Card className="bg-white/20 backdrop-blur-3xl border border-white/20 shadow-2xs p-6 rounded-xl max-w-sm w-full text-white">
        <h1 className="text-amber-50 font-bold mb-1">Test Page</h1>
        <p>Effet glassmorphisme sur la carte !</p>
      </Card>
    </div>
  );
}