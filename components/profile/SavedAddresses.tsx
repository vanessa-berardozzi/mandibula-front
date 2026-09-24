"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AsYouType, isValidPhoneNumber } from "libphonenumber-js";
import { AlertCircle, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

// Codes ISO 3166-1 alpha-2. Le format attendu du téléphone et du code postal
// dépend du pays sélectionné (validé côté back également).
const COUNTRIES = [
  { code: "FR", label: "France" },
  { code: "BE", label: "Belgique" },
  { code: "CH", label: "Suisse" },
  { code: "LU", label: "Luxembourg" },
  { code: "MC", label: "Monaco" },
  { code: "DE", label: "Allemagne" },
  { code: "AT", label: "Autriche" },
  { code: "ES", label: "Espagne" },
  { code: "IT", label: "Italie" },
  { code: "NL", label: "Pays-Bas" },
  { code: "PT", label: "Portugal" },
  { code: "GB", label: "Royaume-Uni" },
  { code: "IE", label: "Irlande" },
  { code: "DK", label: "Danemark" },
  { code: "SE", label: "Suède" },
  { code: "NO", label: "Norvège" },
  { code: "FI", label: "Finlande" },
  { code: "PL", label: "Pologne" },
  { code: "CZ", label: "République tchèque" },
  { code: "SK", label: "Slovaquie" },
  { code: "HU", label: "Hongrie" },
  { code: "RO", label: "Roumanie" },
  { code: "BG", label: "Bulgarie" },
  { code: "HR", label: "Croatie" },
  { code: "SI", label: "Slovénie" },
  { code: "GR", label: "Grèce" },
  { code: "CY", label: "Chypre" },
  { code: "MT", label: "Malte" },
  { code: "EE", label: "Estonie" },
  { code: "LV", label: "Lettonie" },
  { code: "LT", label: "Lituanie" },
  { code: "CA", label: "Canada" },
  { code: "US", label: "États-Unis" },
  { code: "AU", label: "Australie" },
  { code: "JP", label: "Japon" },
] as const;

type CountryCode = (typeof COUNTRIES)[number]["code"];

const ADDRESS_TYPES = [
  { value: "BOTH", label: "Livraison + Facturation" },
  { value: "SHIPPING", label: "Livraison uniquement" },
  { value: "BILLING", label: "Facturation uniquement" },
] as const;

type AddressTypeValue = (typeof ADDRESS_TYPES)[number]["value"];

interface Address {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  type?: AddressTypeValue;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface FormData {
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  type: AddressTypeValue;
  street: string;
  city: string;
  postalCode: string;
  country: CountryCode;
}

export function SavedAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    firstName: "",
    lastName: "",
    phone: "",
    type: "BOTH",
    street: "",
    city: "",
    postalCode: "",
    country: "FR",
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
      phone: "",
      type: "BOTH",
      street: "",
      city: "",
      postalCode: "",
      country: "FR",
    });
    setPhoneError(null);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (address: Address) => {
    const firstName = address.firstName || "";
    const lastName = address.lastName || "";
    const country = (COUNTRIES.find((c) => c.code === address.country.toUpperCase())?.code ?? "FR") as CountryCode;

    setFormData({
      name: address.name || "",
      firstName: firstName,
      lastName: lastName,
      phone: address.phone || "",
      type: address.type ?? "BOTH",
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country,
    });
    setPhoneError(null);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.street || !formData.city || !formData.postalCode || !formData.country) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (formData.phone && !isValidPhoneNumber(formData.phone, formData.country)) {
      setPhoneError(`Numéro de téléphone invalide pour ${formData.country}`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setPhoneError(null);

      const url = editingId ? `/api/addresses/${editingId}` : "/api/addresses";
      const method = editingId ? "PUT" : "POST";

      
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
          type: formData.type,
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
                        <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary/80 border border-primary/30">
                          {ADDRESS_TYPES.find((t) => t.value === (address.type ?? "BOTH"))?.label}
                        </span>
                      </div>
                      {(address.firstName || address.lastName) && (
                        <p className="text-sm text-foreground font-medium mb-2">
                          {`${address.firstName ?? ""} ${address.lastName ?? ""}`.trim()}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mb-1">{address.street}</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {address.postalCode} {address.city}, {address.country}
                      </p>
                      {address.phone && (
                        <p className="text-xs text-muted-foreground mb-3">📞 {address.phone}</p>
                      )}

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
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as AddressTypeValue })}
                className="col-span-2 px-3 py-2 bg-accent/30 border border-primary/20 rounded-sm text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                {ADDRESS_TYPES.map((t) => (
                  <option key={t.value} value={t.value} className="bg-background">
                    {t.label}
                  </option>
                ))}
              </select>
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
              <select
                value={formData.country}
                onChange={(e) => {
                  const country = e.target.value as CountryCode;
                  setFormData({ ...formData, country });
                  setPhoneError(
                    formData.phone && !isValidPhoneNumber(formData.phone, country)
                      ? `Numéro de téléphone invalide pour ${country}`
                      : null
                  );
                }}
                required
                className="col-span-1 px-3 py-2 bg-accent/30 border border-primary/20 rounded-sm text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-background">
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="Téléphone"
                value={formData.phone}
                onChange={(e) => {
                  const formatted = new AsYouType(formData.country).input(e.target.value);
                  setFormData({ ...formData, phone: formatted });
                  setPhoneError(null);
                }}
                onBlur={() => {
                  if (formData.phone && !isValidPhoneNumber(formData.phone, formData.country)) {
                    setPhoneError(`Numéro de téléphone invalide pour ${formData.country}`);
                  }
                }}
                className="col-span-2 px-3 py-2 bg-accent/30 border border-primary/20 rounded-sm text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
              />
              {phoneError && (
                <p className="col-span-2 text-xs text-red-300 -mt-2">{phoneError}</p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={submitting || Boolean(phoneError)}
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
