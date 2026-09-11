import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

function SidebarToggleIcon() {
  return <svg className="aisee-sidebar__toggle-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M6.23813 2H9.76187C10.4844 1.99999 11.0671 1.99999 11.5391 2.03855C12.025 2.07825 12.4518 2.16212 12.8467 2.36331C13.4739 2.68289 13.9838 3.19283 14.3033 3.82003C14.5045 4.21489 14.5884 4.64169 14.6281 5.12759C14.6667 5.5995 14.6667 6.18226 14.6667 6.9048V9.0952C14.6667 9.81773 14.6667 10.4005 14.6281 10.8724C14.5884 11.3583 14.5045 11.7851 14.3033 12.18C13.9838 12.8072 13.4739 13.3171 12.8467 13.6367C12.4518 13.8379 12.025 13.9217 11.5391 13.9615C11.0672 14 10.4844 14 9.76187 14H6.23811C5.51559 14 4.93283 14 4.46092 13.9615C3.97502 13.9217 3.54823 13.8379 3.15337 13.6367C2.52616 13.3171 2.01622 12.8072 1.69665 12.18C1.49545 11.7851 1.41158 11.3583 1.37188 10.8724C1.33332 10.4005 1.33333 9.81773 1.33333 9.0952V6.9048C1.33333 6.18227 1.33332 5.59951 1.37188 5.12759C1.41158 4.64169 1.49545 4.21489 1.69665 3.82003C2.01622 3.19283 2.52616 2.68289 3.15337 2.36331C3.54823 2.16212 3.97502 2.07825 4.46092 2.03855C4.93284 1.99999 5.51561 1.99999 6.23813 2ZM4.56949 3.36745C4.16605 3.40041 3.93425 3.46186 3.75869 3.55132C3.38236 3.74307 3.0764 4.04903 2.88465 4.42535C2.79519 4.60092 2.73375 4.83271 2.70079 5.23616C2.66719 5.64739 2.66667 6.17559 2.66667 6.93333V9.06667C2.66667 9.8244 2.66719 10.3526 2.70079 10.7639C2.73375 11.1673 2.79519 11.3991 2.88465 11.5747C3.0764 11.951 3.38236 12.2569 3.75869 12.4487C3.93425 12.5381 4.16605 12.5996 4.56949 12.6325C4.78615 12.6503 5.03528 12.6588 5.33333 12.6629V3.33713C5.03528 3.34123 4.78615 3.34975 4.56949 3.36745ZM6.66667 3.33333V12.6667H9.73333C10.4911 12.6667 11.0193 12.6661 11.4305 12.6325C11.8339 12.5996 12.0657 12.5381 12.2413 12.4487C12.6177 12.2569 12.9236 11.951 13.1153 11.5747C13.2048 11.3991 13.2663 11.1673 13.2992 10.7639C13.3328 10.3526 13.3333 9.8244 13.3333 9.06667V6.93333C13.3333 6.17559 13.3328 5.64739 13.2992 5.23616C13.2663 4.83271 13.2048 4.60092 13.1153 4.42535C12.9236 4.04903 12.6177 3.74307 12.2413 3.55132C12.0657 3.46186 11.8339 3.40041 11.4305 3.36745C11.0193 3.33385 10.4911 3.33333 9.73333 3.33333H6.66667Z" fill="currentColor" opacity=".5" />
  </svg>;
}

export interface SidebarNavigationItem {
  id: string;
  label: string;
  icon?: ReactNode;
  iconSrc?: string;
  iconTone?: 'monochrome' | 'brand';
  badge?: ReactNode;
  status?: ReactNode;
  disabled?: boolean;
  children?: SidebarNavigationItem[];
}

export interface SidebarNavigationGroup {
  id: string;
  label?: string;
  items: SidebarNavigationItem[];
}

export interface SidebarNavigationProps {
  groups: SidebarNavigationGroup[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  openItemIds?: string[];
  defaultOpenItemIds?: string[];
  onOpenItemIdsChange?: (ids: string[]) => void;
  header?: ReactNode;
  footer?: ReactNode;
  collapseIcon?: ReactNode;
  expandIcon?: ReactNode;
  ariaLabel?: string;
  className?: string;
}

export function SidebarNavigation({
  groups,
  value,
  defaultValue,
  onValueChange,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  openItemIds,
  defaultOpenItemIds = [],
  onOpenItemIdsChange,
  header,
  footer,
  collapseIcon,
  expandIcon,
  ariaLabel = 'Primary navigation',
  className = '',
}: SidebarNavigationProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [internalOpenIds, setInternalOpenIds] = useState(defaultOpenItemIds);
  const [collapsedMenuId, setCollapsedMenuId] = useState<string>();
  const activeValue = value ?? internalValue;
  const isCollapsed = collapsed ?? internalCollapsed;
  const activeOpenIds = openItemIds ?? internalOpenIds;
  const toggleLabel = isCollapsed ? 'Open sidebar' : 'Close sidebar';

  const select = (id: string) => {
    if (value === undefined) setInternalValue(id);
    onValueChange?.(id);
  };
  const toggleCollapsed = () => {
    const next = !isCollapsed;
    setCollapsedMenuId(undefined);
    if (collapsed === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };
  const toggleItem = (id: string) => {
    const next = activeOpenIds.includes(id) ? activeOpenIds.filter((itemId) => itemId !== id) : [...activeOpenIds, id];
    if (openItemIds === undefined) setInternalOpenIds(next);
    onOpenItemIdsChange?.(next);
  };

  useEffect(() => {
    if (!isCollapsed || !collapsedMenuId) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!sidebarRef.current?.contains(event.target as Node)) setCollapsedMenuId(undefined);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCollapsedMenuId(undefined);
    };
    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [collapsedMenuId, isCollapsed]);

  const renderIcon = (item: SidebarNavigationItem) => {
    if (item.iconSrc) return <span className="aisee-sidebar__icon" aria-hidden="true">
      {item.iconTone === 'brand'
        ? <img src={item.iconSrc} alt="" />
        : <span
          className="aisee-sidebar__icon-mask"
          style={{ '--aisee-sidebar-icon': `url("${item.iconSrc}")` } as CSSProperties}
        />}
    </span>;
    return item.icon ? <span className="aisee-sidebar__icon" aria-hidden="true">{item.icon}</span> : null;
  };

  const renderItem = (item: SidebarNavigationItem, nested = false) => {
    const hasChildren = Boolean(item.children?.length);
    const isOpen = activeOpenIds.includes(item.id);
    const isFlyoutOpen = isCollapsed && collapsedMenuId === item.id;
    return <div className={`aisee-sidebar__item-wrap${nested ? ' aisee-sidebar__item-wrap--nested' : ''}`} key={item.id}>
      <button
        className="aisee-sidebar__item"
        type="button"
        aria-current={!hasChildren && activeValue === item.id ? 'page' : undefined}
        aria-expanded={hasChildren ? (isCollapsed ? isFlyoutOpen : isOpen) : undefined}
        aria-controls={hasChildren ? (isCollapsed ? `aisee-sidebar-menu-${item.id}` : `aisee-sidebar-sub-${item.id}`) : undefined}
        aria-haspopup={isCollapsed && hasChildren ? 'menu' : undefined}
        title={isCollapsed ? item.label : undefined}
        disabled={item.disabled}
        onClick={() => {
          if (hasChildren) {
            if (isCollapsed) setCollapsedMenuId((current) => current === item.id ? undefined : item.id);
            else toggleItem(item.id);
          } else {
            setCollapsedMenuId(undefined);
            select(item.id);
          }
        }}
      >
        {renderIcon(item)}
        <span className="aisee-sidebar__label">{item.label}</span>
        {item.badge && <span className="aisee-sidebar__badge">{item.badge}</span>}
        {item.status && <span className="aisee-sidebar__status">{item.status}</span>}
      </button>
      {hasChildren && <div className="aisee-sidebar__sub" id={`aisee-sidebar-sub-${item.id}`} data-open={isOpen} aria-hidden={!isOpen}><div className="aisee-sidebar__rail" aria-hidden="true" /><div className="aisee-sidebar__sub-items">{item.children?.map((child) => renderItem(child, true))}</div></div>}
      {hasChildren && isFlyoutOpen && <div className="aisee-sidebar__flyout" id={`aisee-sidebar-menu-${item.id}`} role="menu" aria-label={item.label}>
        <div className="aisee-sidebar__flyout-label">{item.label}</div>
        {item.children?.map((child) => <button
          className="aisee-sidebar__flyout-item"
          type="button"
          role="menuitem"
          key={child.id}
          aria-current={activeValue === child.id ? 'page' : undefined}
          disabled={child.disabled}
          onClick={() => { setCollapsedMenuId(undefined); select(child.id); }}
        >
          {renderIcon(child)}
          <span className="aisee-sidebar__label">{child.label}</span>
          {child.badge && <span className="aisee-sidebar__badge">{child.badge}</span>}
          {child.status && <span className="aisee-sidebar__status">{child.status}</span>}
        </button>)}
      </div>}
    </div>;
  };

  return <aside
    ref={sidebarRef}
    className={`aisee-sidebar${isCollapsed ? ' aisee-sidebar--collapsed' : ''} ${className}`.trim()}
    aria-label={ariaLabel}
    onClick={(event) => {
      if (!isCollapsed || (event.target as Element).closest('button, a, input, select, textarea, [role="menu"]')) return;
      toggleCollapsed();
    }}
  >
    <div className="aisee-sidebar__header">{header}<button className="aisee-sidebar__collapse" type="button" aria-label={toggleLabel} aria-expanded={!isCollapsed} onClick={toggleCollapsed}>{isCollapsed ? (expandIcon ?? <SidebarToggleIcon />) : (collapseIcon ?? <SidebarToggleIcon />)}<span className="aisee-sidebar__collapse-tooltip" role="tooltip">{toggleLabel}</span></button></div>
    <nav className="aisee-sidebar__nav">{groups.map((group) => <section className="aisee-sidebar__group" key={group.id}>{group.label && <div className="aisee-sidebar__group-label">{group.label}</div>}{group.items.map((item) => renderItem(item))}</section>)}</nav>
    {footer && <div className="aisee-sidebar__footer">{footer}</div>}
  </aside>;
}
