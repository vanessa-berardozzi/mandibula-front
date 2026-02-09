import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/layout/Header/Sidebar/sidebar";

interface Subcategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subcategories?: Subcategory[];
}

interface SidebarCategoriesProps {
  categories?: Category[];
}

// Ce composant affichera dynamiquement les catégories et sous-catégories depuis une API plus tard
export function SidebarCategories({ categories = [] }: SidebarCategoriesProps) {
  return (
    <SidebarMenu>
      {categories.map(cat => (
        <SidebarMenuItem key={cat.id}>
          <SidebarMenuButton>{cat.name}</SidebarMenuButton>
          {cat.subcategories && cat.subcategories.length > 0 && (
            <SidebarMenuSub>
              {cat.subcategories.map(sub => (
                <SidebarMenuSubItem key={sub.id}>
                  <SidebarMenuSubButton>{sub.name}</SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
