import React, { useEffect, useState } from 'react';
import { Tabs } from './Tabs';

export type TabItem = {
  id: string;
  tabText: string;
  content?: JSX.Element; // You can either pass tab navs content or just render children
  firstItem?: boolean;
  tabTextFormatter?: (text: string) => string | JSX.Element;
  nestedItemType?: string;
  nestedTabs?: TabItem[];
};

export type TabNav = {
  items: TabItem[];
  itemType?: string;
  activeId?: string;
  nestedActiveId?: string;
  onClick?: (id: string, item: TabItem) => void;
};

export const TabNav: React.FC<TabNav> = ({
  items,
  activeId,
  nestedActiveId,
  onClick,
  itemType,
  children,
}) => {
  const [activeTab, setActiveTab] = useState(
    items.find((i) => i.id === activeId) || items[0]
  );

  const [nestedActiveTab, setNestedActiveTab] = useState<TabItem>();

  useEffect(() => {
    if (activeTab?.nestedTabs?.length) {
      const defaultNestedActiveTab =
        activeTab.nestedTabs.find((i) => i.id === nestedActiveId) ||
        activeTab?.nestedTabs?.[0];
      setNestedActiveTab(defaultNestedActiveTab);
    }
  }, [activeTab, nestedActiveId]);

  return (
    <div className="oec-tab-nav">
      <div className="oec-tab-nav--header">
        <Tabs
          itemType={itemType}
          items={items}
          onClick={onClick}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {activeTab?.nestedTabs && nestedActiveTab && (
          <Tabs
            secondary
            itemType={activeTab.nestedItemType}
            items={activeTab.nestedTabs}
            onClick={onClick}
            activeTab={nestedActiveTab}
            setActiveTab={setNestedActiveTab}
          />
        )}
      </div>
      <div
        className="oec-tab-nav--content"
        aria-labelledby={nestedActiveId || activeId}
        role="tabpanel"
      >
        {children || nestedActiveTab?.content || activeTab?.content}
      </div>
    </div>
  );
};
