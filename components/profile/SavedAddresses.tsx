"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Address {
  id: string;
  name?: string;
  fullName?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface FormData {
  name: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export function SavedAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Charger les adresses
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/addresses", { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Non authentifié");
        }
        throw new Error("Erreur lors du chargement des adresses");
      }
      const data = await res.json();
      setAddresses(data.addresses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      postalCode: "",
      country: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (address: Address) => {
    const fullName = address.fullName || "";
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";
    
    setFormData({
      name: address.name || "",
      firstName: firstName,
      lastName: lastName,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.street || !formData.city || !formData.postalCode || !formData.country) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const url = editingId ? `/api/addresses/${editingId}` : "/api/addresses";
      const method = editingId ? "PUT" : "POST";

      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          fullName: fullName,
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        }),
      });

      if (!res.ok) {
        try {
          const errorData = await res.json();
          throw new Error(errorData.error || "Erreur lors de la sauvegarde");
        } catch {
          throw new Error(`Erreur serveur (${res.status})`);
        }
      }

      await fetchAddresses();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette adresse ?")) return;

    try {
      setError(null);
      const res = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        try {
          const errorData = await res.json();
          throw new Error(errorData.error || "Erreur lors de la suppression");
        } catch {
          throw new Error(`Erreur serveur (${res.status})`);
        }
      }

      await fetchAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
    }
  };

  if (loading) {
    return (
      <Card className="border-primary/30 bg-card/30 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-primary">Adresses de Livraison</CardTitle>
          <CardDescription>Gérez vos adresses de livraison</CardDescription>
        </CardHeader>
        <div className="px-6 pb-6 flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 bg-card/30 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-primary">Adresses de Livraison</CardTitle>
        <CardDescription>Gérez vos adresses de livraison</CardDescription>
      </CardHeader>

      <div className="px-6 pb-6">
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-sm flex gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        {!showForm ? (
          <>
            {addresses.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground mb-4">Aucune adresse enregistrée</p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm border border-primary/50"
                >
                  + Ajouter une adresse
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="relative p-4 bg-accent/15 border border-primary/20 rounded-sm hover:border-primary/50 transition-colors"
                      style={{
                        clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                      }}
                    >
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50" />

                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-primary text-sm">{address.name || "Adresse"}</h4>
                      </div>
                      {address.fullName && (
                        <p className="text-sm text-foreground font-medium mb-2">{address.fullName}</p>
                      )}
                      <p className="text-xs text-muted-foreground mb-1">{address.street}</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {address.postalCode} {address.city}, {address.country}
                      </p>

                      <div className="flex gap-2 pt-3 border-t border-primary/10">
                        <Button
                          size="sm"
                          onClick={() => startEdit(address)}
                          className="flex-1 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 rounded-sm text-xs h-7"
                        >
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(address.id)}
                          variant="outline"
                          className="flex-1 border-red-500/50 text-red-300 hover:bg-red-500/10 rounded-sm text-xs h-7"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="w-full mt-4 p-4 border-2 border-dashed border-primary/30 rounded-sm hover:border-primary/60 flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
                  style={{
                    clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                  }}
                >
                  <span className="text-center">
                    <div className="text-2xl mb-2">+</div>
                    <div className="text-xs font-semibold">Ajouter une adresse</div>
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                {editingId ? "Modifier l'adresse" : "Nouvelle adresse"}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Titre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-2 px-3 py-2 bg-accent/30 border border-primary/20 rounded-sm text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <input
                type="text"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="col-span-1 px-3 py-2 bg-accent/30 border border-primary/20 rounded-sm text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <input
                type="text"
                placeholder="Nom"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="col-span-1 px-3 py-2 bg-accent/30 border border-primary/20 rounded-sm text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <input
                type="text"
                placeholder="Rue *"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                required
                className="col-span-2 px-3 py-2 bg-accent/30 border border-primary/20 rounded-sm text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <input
                type="text"
                placeholder="Ville *"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="col-span-2 px-3 py-2 bg-accent/30 border border-primary/20 rounded-sm text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <input
                type="text"
                placeholder="Code postal *"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                required
                className="col-span-1 px-3 py-2 bg-accent/30 border border-primary/20 rounded-sm text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <input
                type="text"
                placeholder="Pays *"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
                className="col-span-1 px-3 py-2 bg-accent/30 border border-primary/20 rounded-sm text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm text-xs h-8"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    Sauvegarde...
                  </>
                ) : editingId ? (
                  "Mettre à jour"
                ) : (
                  "Ajouter"
                )}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                variant="outline"
                className="flex-1 border-primary/50 text-primary hover:bg-primary/10 rounded-sm text-xs h-8"
              >
                Annuler
              </Button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
