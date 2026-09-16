import { useState, type CSSProperties, type ReactNode } from 'react';

export interface TreeNavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  iconSrc?: string;
  iconTone?: 'monochrome' | 'brand';
  badge?: ReactNode;
  status?: ReactNode;
  disabled?: boolean;
  children?: TreeNavItem[];
}

export interface TreeNavProps {
  items: TreeNavItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  openItemIds?: string[];
  defaultOpenItemIds?: string[];
  onOpenItemIdsChange?: (ids: string[]) => void;
  ariaLabel?: string;
  className?: string;
  showDisclosure?: boolean;
  showRootRail?: boolean;
}

export function TreeNav({
  items,
  value,
  defaultValue,
  onValueChange,
  openItemIds,
  defaultOpenItemIds = [],
  onOpenItemIdsChange,
  ariaLabel = 'Tree navigation',
  className = '',
  showDisclosure = true,
  showRootRail = false,
}: TreeNavProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpenIds, setInternalOpenIds] = useState(defaultOpenItemIds);
  const activeValue = value ?? internalValue;
  const activeOpenIds = openItemIds ?? internalOpenIds;

  const select = (id: string) => {
    if (value === undefined) setInternalValue(id);
    onValueChange?.(id);
  };

  const toggleItem = (id: string) => {
    const next = activeOpenIds.includes(id)
      ? activeOpenIds.filter((itemId) => itemId !== id)
      : [...activeOpenIds, id];
    if (openItemIds === undefined) setInternalOpenIds(next);
    onOpenItemIdsChange?.(next);
  };

  const renderIcon = (item: TreeNavItem) => {
    if (item.iconSrc) return <span className="aisee-tree-nav__icon" aria-hidden="true">
      {item.iconTone === 'brand'
        ? <img src={item.iconSrc} alt="" />
        : <span
          className="aisee-tree-nav__icon-mask"
          style={{ '--aisee-tree-nav-icon': `url("${item.iconSrc}")` } as CSSProperties}
        />}
    </span>;
    return item.icon ? <span className="aisee-tree-nav__icon" aria-hidden="true">{item.icon}</span> : null;
  };

  const renderItem = (item: TreeNavItem, depth = 0) => {
    const hasChildren = Boolean(item.children?.length);
    const isOpen = activeOpenIds.includes(item.id);
    const childrenId = `aisee-tree-nav-children-${item.id}`;
    return <div
      className="aisee-tree-nav__item-wrap"
      data-depth={depth}
      key={item.id}
      style={{ '--aisee-tree-nav-depth': depth } as CSSProperties}
    >
      <button
        className="aisee-tree-nav__item"
        type="button"
        aria-current={!hasChildren && activeValue === item.id ? 'page' : undefined}
        aria-expanded={hasChildren ? isOpen : undefined}
        aria-controls={hasChildren ? childrenId : undefined}
        disabled={item.disabled}
        onClick={() => hasChildren ? toggleItem(item.id) : select(item.id)}
      >
        {renderIcon(item)}
        <span className="aisee-tree-nav__label">{item.label}</span>
        {item.badge && <span className="aisee-tree-nav__badge">{item.badge}</span>}
        {item.status && <span className="aisee-tree-nav__status">{item.status}</span>}
        {hasChildren && showDisclosure && <span className="aisee-tree-nav__disclosure" aria-hidden="true" />}
      </button>
      {hasChildren && <div
        className="aisee-tree-nav__children"
        id={childrenId}
        data-open={isOpen}
        aria-hidden={!isOpen}
      >
        <div className="aisee-tree-nav__rail" aria-hidden="true" />
        <div className="aisee-tree-nav__children-list">{item.children?.map((child) => renderItem(child, depth + 1))}</div>
      </div>}
    </div>;
  };

  return <nav className={`aisee-tree-nav ${className}`.trim()} aria-label={ariaLabel} data-root-rail={showRootRail}>
    {items.map((item) => renderItem(item))}
  </nav>;
}
