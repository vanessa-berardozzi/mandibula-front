import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/layout/Sidebar/sidebar";

// Ce composant affichera dynamiquement les catégories et sous-catégories depuis une API plus tard
export function SidebarCategories({ categories = [] }) {
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
