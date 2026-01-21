"use client";

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/layout/Sidebar/sidebar";
import { useState } from "react";

// Configuration des catégories avec couleurs personnalisées
const categories = [
  {
    id: "isopodes",
    name: "Isopodes",
    color: "#22c56e", 
    subcategories: ["Débutant", "Intermédiaire", "Expert"]
  },
  {
    id: "blattes",
    name: "Blattes",
    color: "#7ba996", 
    subcategories: ["Débutant", "Intermédiaire", "Expert"]
  },
  {
    id: "accessoires",
    name: "Accessoires",
    color: "#658e7d", 
    subcategories: ["Terrariums", "Substrats", "Décoration", "Nourriture"]
  }
];

export function SidebarContent() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="flex flex-col gap-2 p-0">
      <SidebarGroup className="px-1">
        <SidebarMenu className="gap-0">
          {categories.map((category) => (
            <SidebarMenuItem key={category.id}>
              <SidebarMenuButton 
                onClick={() => toggleCategory(category.id)}
                style={{
                  background: `linear-gradient(to right, ${category.color}66, ${category.color}33)`,
                  borderColor: `${category.color}33`,
                  boxShadow: `0 10px 15px -3px ${category.color}66`
                }}
                className="hover:opacity-90 transition-opacity"
              >
                {category.name}
              </SidebarMenuButton>
              {openCategory === category.id && (
                <SidebarMenuSub className="ml-8 mt-1 space-y-1">
                  {category.subcategories.map((subcat) => (
                    <SidebarMenuSubItem key={subcat}>
                      <SidebarMenuSubButton
                        style={{
                          background: `linear-gradient(to right, ${category.color}4D, ${category.color}26)`,
                          borderColor: `${category.color}4D`
                        }}
                        className="hover:opacity-90 transition-opacity"
                      >
                        {subcat}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </div>
  );
}
