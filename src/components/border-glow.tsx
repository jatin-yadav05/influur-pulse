'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface GlassmorphicMenuProps {
  items?: MenuItem[];
  isOpen?: boolean;
  onToggle?: () => void;
  onItemSelect?: (itemId: string) => void;
  className?: string;
}

const GlassmorphicMenu: React.FC<GlassmorphicMenuProps> = ({
  items = [
    { id: '1', label: 'Dashboard' },
    { id: '2', label: 'Analytics' },
    { id: '3', label: 'Settings' },
    { id: '4', label: 'Profile' },
  ],
  isOpen = true,
  onToggle,
  onItemSelect,
  className = ''
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    setSelectedItem(itemId);
    onItemSelect?.(itemId);
  };

  return (
    <>
      {/* Custom CSS for complex effects that can't be replicated with Tailwind */}
      <style jsx>{`
        :root {
          --hue1: 255;
          --hue2: 222;
          --border: 1px;
          --border-color: hsl(var(--hue2), 12%, 20%);
          --radius: 22px;
          --ease: cubic-bezier(0.5, 1, 0.89, 1);
        }

        @property --item-opacity {
          syntax: "<number>";
          inherits: false;
          initial-value: 0;
        }

        .menu-container {
          font-family: 'Asap', sans-serif;
        }

        .menu-container:not(.menu-open) .glow-effect,
        .menu-container:not(.menu-open) .shine-effect {
          opacity: 0;
          pointer-events: none;
          animation: glowoff 0.25s var(--ease) both;
        }

        .menu-container.menu-open .glow-effect,
        .menu-container.menu-open .shine-effect {
          animation: glow 1s var(--ease) both;
        }

        .menu-container.menu-open .shine-effect {
          animation-delay: 0s;
          animation-duration: 2s;
        }

        .menu-container.menu-open .glow-effect {
          animation-delay: 0.2s;
        }

        .menu-container.menu-open .glow-bright {
          animation-delay: 0.1s;
          animation-duration: 1.5s;
        }

        .menu-container.menu-open .shine-bottom {
          animation-delay: 0.1s;
          animation-duration: 1.8s;
        }

        .menu-container.menu-open .glow-bottom {
          animation-delay: 0.3s;
        }

        .menu-container.menu-open .glow-bright.glow-bottom {
          animation-delay: 0.3s;
          animation-duration: 1.1s;
        }

        .shine-effect,
        .shine-effect::before,
        .shine-effect::after {
          pointer-events: none;
          border-radius: 0;
          border-top-right-radius: inherit;
          border-bottom-left-radius: inherit;
          border: 1px solid transparent;
          width: 75%;
          height: auto;
          min-height: 0px;
          aspect-ratio: 1;
          display: block;
          position: absolute;
          right: calc(var(--border) * -1);
          top: calc(var(--border) * -1);
          left: auto;
          z-index: 1;
          background: conic-gradient(from -45deg at center in oklch,
                  transparent 12%, hsl(255, 80%, 60%), transparent 50%) border-box;
          mask:
              linear-gradient(transparent),
              linear-gradient(black);
          mask-repeat: no-repeat;
          mask-clip: padding-box, border-box;
          mask-composite: subtract;
        }

        .shine-effect::before,
        .shine-effect::after {
          content: "";
          width: auto;
          inset: -2px;
          mask: none;
        }

        .shine-effect::after {
          z-index: 2;
          background: conic-gradient(from -45deg at center in oklch,
                  transparent 17%, hsl(255, 80%, 85%), transparent 33%);
        }

        .shine-bottom {
          top: auto;
          bottom: calc(var(--border) * -1);
          left: calc(var(--border) * -1);
          right: auto;
          background: conic-gradient(from 135deg at center in oklch,
                  transparent 12%, hsl(222, 80%, 60%), transparent 50%) border-box;
        }

        .shine-bottom::after {
          background: conic-gradient(from 135deg at center in oklch,
                  transparent 17%, hsl(222, 80%, 85%), transparent 33%);
        }

        .glow-effect {
          pointer-events: none;
          border-top-right-radius: calc(var(--radius) * 2.5);
          border-bottom-left-radius: calc(var(--radius) * 2.5);
          border: calc(var(--radius) * 1.25) solid transparent;
          inset: calc(var(--radius) * -2);
          width: 75%;
          height: auto;
          min-height: 0px;
          aspect-ratio: 1;
          display: block;
          position: absolute;
          left: auto;
          bottom: auto;
          mask: url('https://assets.codepen.io/13471/noise-base.png');
          mask-mode: luminance;
          mask-size: 29%;
          opacity: 1;
          filter: blur(12px) saturate(1.25) brightness(0.5);
          mix-blend-mode: plus-lighter;
          z-index: 3;
        }

        .glow-effect.glow-bottom {
          inset: calc(var(--radius) * -2);
          top: auto;
          right: auto;
        }

        .glow-effect::before,
        .glow-effect::after {
          content: "";
          position: absolute;
          inset: 0;
          border: inherit;
          border-radius: inherit;
          background: conic-gradient(from -45deg at center in oklch,
                  transparent 0%, hsl(255, 95%, 60%), transparent 50%) border-box;
          mask:
              linear-gradient(transparent),
              linear-gradient(black);
          mask-repeat: no-repeat;
          mask-clip: padding-box, border-box;
          mask-composite: subtract;
          filter: saturate(2) brightness(1);
        }

        .glow-bottom::before,
        .glow-bottom::after {
          background: conic-gradient(from 135deg at center in oklch,
                  transparent 0%, hsl(222, 95%, 60%), transparent 50%) border-box;
        }

        .glow-effect::after {
          border-width: calc(var(--radius) * 1.75);
          border-radius: calc(var(--radius) * 2.75);
          inset: calc(var(--radius) * -0.25);
          z-index: 4;
          opacity: 0.75;
          background: conic-gradient(from -45deg at center in oklch,
                  transparent 15%, hsl(255, 100%, 70%), transparent 35%) border-box;
        }

        .glow-bottom::after {
          background: conic-gradient(from 135deg at center in oklch,
                  transparent 15%, hsl(222, 100%, 70%), transparent 35%) border-box;
        }

        .glow-bright {
          border-width: 5px !important;
          border-radius: calc(var(--radius) + 2px) !important;
          inset: -7px !important;
          left: auto;
          filter: blur(2px) brightness(0.66) !important;
        }

        .glow-bright::before {
          background: conic-gradient(from -45deg at center in oklch,
                  transparent 13%, hsl(255, 100%, 80%), transparent 37%) border-box !important;
        }

        .glow-bright.glow-bottom::before {
          background: conic-gradient(from 135deg at center in oklch,
                  transparent 13%, hsl(222, 100%, 80%), transparent 37%) border-box !important;
        }

        .glow-bright::after {
          content: none;
        }

        .glow-bright.glow-bottom {
          inset: -7px !important;
          right: auto;
          top: auto;
        }

        .menu-item {
          position: relative;
          transition: all 0.3s ease-in, --item-opacity 0.3s ease-in;
          background:
              linear-gradient(90deg in oklch,
                  hsl(255 29% 13% / var(--item-opacity)),
                  hsl(255 30% 15% / var(--item-opacity)) 24% 32%,
                  hsl(255 5% 7% / var(--item-opacity))) border-box;
        }

        .menu-item::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: inherit;
          background:
              linear-gradient(90deg in oklch,
                  hsl(255 15% 16% / var(--item-opacity)),
                  hsl(255 40% 24% / var(--item-opacity)) 20% 32%,
                  hsl(255 2% 12% / var(--item-opacity))) border-box;
          mask:
              linear-gradient(transparent),
              linear-gradient(black);
          mask-repeat: no-repeat;
          mask-clip: padding-box, border-box;
          mask-composite: subtract;
        }

        .menu-item:hover,
        .menu-item.selected,
        .menu-item:hover::after,
        .menu-item.selected::after {
          --item-opacity: 0.5;
          transition: all 0.1s ease-out, --item-opacity 0.1s ease-out;
          color: white;
        }

        .menu-item.selected,
        .menu-item.selected::after {
          animation: flash 0.75s ease-out 1 forwards;
        }

        @keyframes glow {
          0% {
            opacity: 0;
          }
          3% {
            opacity: 1;
          }
          10% {
            opacity: 0;
          }
          12% {
            opacity: 0.7;
          }
          16% {
            opacity: 0.3;
            animation-timing-function: var(--ease);
          }
          100% {
            opacity: 1;
            animation-timing-function: var(--ease);
          }
        }

        @keyframes glowoff {
          to {
            opacity: 0;
          }
        }

        @keyframes flash {
          0% {
            opacity: 0;
            --item-opacity: 0;
          }
          7% {
            opacity: 0.5;
            --item-opacity: 1;
          }
          14% {
            opacity: 0;
            --item-opacity: 0.5;
          }
          21%,
          100% {
            opacity: 1;
            --item-opacity: 1;
          }
        }
      `}</style>

      <aside
        className={cn(
          'menu-container',
          isOpen ? 'menu-open' : '',
          isOpen
            ? 'visible opacity-100 pointer-events-auto'
            : 'invisible opacity-0 pointer-events-none',
          'fixed top-[140px] left-[2vw] min-w-[275px] min-h-[275px] rounded-[22px]',
          'border border-solid border-[hsl(222,12%,20%)] p-4',
          'backdrop-blur-[12px] transition-all duration-300 ease-[cubic-bezier(0.5,1,0.89,1)]',
          isOpen ? 'blur-0 delay-0' : 'blur-[4px] delay-500',
          "text-[#737985] font-['Asap',sans-serif] text-sm",
          className
        )}
        style={{
          background: `
            linear-gradient(235deg, hsl(255 50% 10% / 0.8), hsl(255 50% 10% / 0) 33%), 
            linear-gradient(45deg, hsl(222 50% 10% / 0.8), hsl(222 50% 10% / 0) 33%), 
            linear-gradient(hsl(220deg 25% 4.8% / 0.66))
          `,
          boxShadow: `
            hsl(222 50% 2%) 0px 10px 16px -8px, 
            hsl(222 50% 4%) 0px 20px 36px -14px
          `,
          transitionProperty: 'visibility, opacity, filter',
          transitionDuration: '0s, 0.25s, 0.25s, 0.25s',
          transitionDelay: isOpen ? '0s' : '0.5s, 0s, 0s, 0s',
        }}
      >
        {/* Shine Effects */}
        <span className={cn('shine-effect', 'shine-top', 'absolute')}></span>
        <span className={cn('shine-effect', 'shine-bottom', 'absolute')}></span>

        {/* Glow Effects */}
        <span className={cn('glow-effect', 'glow-top', 'absolute')}></span>
        <span className={cn('glow-effect', 'glow-bottom', 'absolute')}></span>
        <span className={cn('glow-effect', 'glow-bright', 'glow-top', 'absolute')}></span>
        <span className={cn('glow-effect', 'glow-bright', 'glow-bottom', 'absolute')}></span>

        {/* Menu Content */}
        <div className="relative z-10 flex flex-col gap-2">
          {/* Search Input */}
          <label className="grid grid-cols-1 grid-rows-1 mb-4 w-full">
            <input
              type="text"
              placeholder="Search..."
              className={cn(
                'col-start-1 row-start-1 self-center pl-9 pr-4 py-2 w-full',
                "font-['Asap',sans-serif] font-light text-sm",
                'bg-[hsl(255_0%_40%/0.05)] border border-[hsl(222_13%_18.5%/0.5)]',
                'rounded-[calc(22px*0.33333)] shadow-[0_0_0_1px_transparent]',
                'focus:outline-none focus:ring-1 focus:ring-[hsl(255_50%_50%/0.5)]',
                'transition-all duration-200'
              )}
            />
            <svg
              className={cn(
                'col-start-1 row-start-1 self-center ml-2 opacity-50 w-5 h-5 fill-none stroke-current stroke-1'
              )}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </label>

          {/* Header */}
          <header className="text-xs font-light px-2 mb-2 opacity-70">
            NAVIGATION
          </header>

          {/* Menu Items */}
          <ul className="list-none p-0 m-0 flex flex-col gap-1">
            {items.map((item) => (
              <li
                key={item.id}
                className={cn(
                  'menu-item',
                  selectedItem === item.id && 'selected',
                  'px-3 py-2 h-8 flex items-center gap-2',
                  'rounded-[calc(22px*0.33333)] border border-transparent',
                  'cursor-pointer relative z-[1]',
                  'hover:text-white'
                )}
                onClick={() => handleItemClick(item.id)}
                style={{
                  '--item-opacity': selectedItem === item.id ? '0.5' : '0',
                } as React.CSSProperties}
              >
                {item.icon && (
                  <span className={cn('w-5 h-5 flex items-center justify-center')}>
                    {item.icon}
                  </span>
                )}
                <span className="relative z-[2]">{item.label}</span>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <hr className="w-full h-px bg-[var(--border-color)] border-none my-2 opacity-66" />

          {/* Additional Section */}
          <section className="flex flex-col gap-2">
            <header className="text-xs font-light px-2 opacity-70">
              TOOLS
            </header>
            <ul className="list-none p-0 m-0 flex flex-col gap-1">
              <li
                className={cn(
                  'menu-item',
                  'px-3 py-2 h-8 flex items-center gap-2',
                  'rounded-[calc(22px*0.33333)] border border-transparent',
                  'cursor-pointer relative z-[1]',
                  'hover:text-white'
                )}
                style={{ '--item-opacity': '0' } as React.CSSProperties}
              >
                <svg
                  className={cn('w-5 h-5 fill-none stroke-current stroke-1')}
                  viewBox="0 0 24 24"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="relative z-[2]">Settings</span>
              </li>
            </ul>
          </section>
        </div>
      </aside>
    </>
  );
};

export default GlassmorphicMenu;