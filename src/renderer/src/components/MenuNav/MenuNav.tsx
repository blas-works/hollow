import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { MenuTab } from '../../schemas'

interface MenuNavProps {
  activeTab: MenuTab
  onTabChange: (tab: MenuTab) => void
  items: Array<{ key: MenuTab; label: string; Icon: LucideIcon }>
}

export function MenuNav({ activeTab, onTabChange, items }: MenuNavProps): React.JSX.Element {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => onTabChange(v as MenuTab)}
      className="app-no-drag"
    >
      <TabsList>
        {items.map(({ key, label, Icon }) => (
          <TabsTrigger key={key} value={key}>
            <Icon size={15} strokeWidth={1.5} />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
