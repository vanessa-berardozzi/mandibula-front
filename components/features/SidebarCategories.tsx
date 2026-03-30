import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/layout";

type Subcategory = { id: string | number; name: string };
type Category = { id: string | number; name: string; subcategories?: Subcategory[] };

// Ce composant affichera dynamiquement les catégories et sous-catégories depuis une API plus tard
export function SidebarCategories({ categories = [] }: { categories?: Category[] }) {
  return (
    <SidebarMenu>
      {categories.map((cat) => (
        <SidebarMenuItem key={cat.id}>
          <SidebarMenuButton>{cat.name}</SidebarMenuButton>
          {cat.subcategories && cat.subcategories.length > 0 && (
            <SidebarMenuSub>
              {cat.subcategories.map((sub) => (
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
