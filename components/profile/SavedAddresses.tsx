"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Address {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface SavedAddressesProps {
  addresses: Address[];
}

export function SavedAddresses({ addresses }: SavedAddressesProps) {
  return (
    <Card className="border-primary/30 bg-card/30 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-primary">Adresses de Livraison</CardTitle>
        <CardDescription>Gérez vos adresses de livraison</CardDescription>
      </CardHeader>

      <div className="px-6 pb-6">
        {addresses.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-4">Aucune adresse enregistrée</p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm border border-primary/50">
              + Ajouter une adresse
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="relative p-4 bg-accent/15 border border-primary/20 rounded-sm hover:border-primary/50 transition-colors"
                style={{
                  clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)"
                }}
              >
                {/* Coins */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50" />

                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-primary text-sm">{address.label}</h4>
                  {address.isDefault && (
                    <Badge className="bg-secondary/30 text-secondary border border-secondary/50 text-xs">
                      Par défaut
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-foreground font-medium mb-2">{address.fullName}</p>
                <p className="text-xs text-muted-foreground mb-1">{address.street}</p>
                <p className="text-xs text-muted-foreground mb-3">
                  {address.postalCode} {address.city}, {address.country}
                </p>
                <p className="text-xs text-muted-foreground mb-3">📱 {address.phone}</p>

                <div className="flex gap-2 pt-3 border-t border-primary/10">
                  <Button
                    size="sm"
                    className="flex-1 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 rounded-sm text-xs h-7"
                  >
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-red-500/50 text-red-300 hover:bg-red-500/10 rounded-sm text-xs h-7"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}

            <button
              className="p-4 border-2 border-dashed border-primary/30 rounded-sm hover:border-primary/60 flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
              style={{
                clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)"
              }}
            >
              <span className="text-center">
                <div className="text-2xl mb-2">+</div>
                <div className="text-xs font-semibold">Ajouter</div>
              </span>
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
