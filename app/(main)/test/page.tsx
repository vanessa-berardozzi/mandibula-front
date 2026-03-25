import { Button, Card, Input, Label } from '@/components/ui';

export default function TestPage() {

   
  return (
    <div className="flex min-h-screen items-center justify-center font-sans " >
      <Card className="bg-white/10 backdrop-blur-4xl border border-green/20 shadow-4xl p-6 rounded-xl max-w-sm w-full text-black">
        <h1 className="text-amber-50 font-bold mb-1">Test Page</h1>
        <p>Effet glassmorphisme sur la carte !</p>
      </Card>
      <div>
        <Input placeholder="Champ de saisie test" className="mt-4" />
        <Button className="mt-4">Bouton Test</Button>
        <Label className="mt-4 block text-white">Label Test</Label>
      </div>
    </div>
  );
}