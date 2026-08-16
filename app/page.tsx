import React from "react";
import { Lalezar } from "next/font/google";
import config from "../config.json";
import Calculators from "./components/Calculators";
import WaitlistSection from "./components/WaitlistSection";

const lalezar = Lalezar({ weight: '400', subsets: ['arabic'] });

interface SquircleButtonProps {
  href?: string;
  title: string;
  titleClassName?: string;
  subtitle: string;
  subtitleClassName?: string;
  icon: React.ReactNode;
  bgClass: string;
  textClass: string;
  disabled?: boolean;
  borderClass?: string;
}

const SquircleButton = ({
  href,
  title,
  titleClassName = "",
  subtitle,
  subtitleClassName = "",
  icon,
  bgClass,
  textClass,
  borderClass = "",
  disabled,
}: SquircleButtonProps) => {
  const content = (
    <div
      className={`aspect-square w-full rounded-[32px] p-5 flex flex-col items-center justify-between transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) relative overflow-hidden ${bgClass} ${textClass} ${borderClass} ${
        disabled
          ? "opacity-50 cursor-default grayscale-[40%]"
          : "hover:scale-[1.04] hover:shadow-[0_12px_40px_rgba(255,255,255,0.08)] active:scale-[0.96] cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:border-white/40 hover:bg-white/20"
      }`}
      dir="rtl"
    >
      {disabled && (
        <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-neutral-200 border border-white/20 backdrop-blur-md">
          به‌زودی
        </span>
      )}
      <div className="flex-1 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
        {icon}
      </div>
      <div className="flex flex-col items-center text-center mt-2 w-full">
        <span className={`font-bold text-[19px] leading-tight mb-0.5 tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${titleClassName}`}>{title}</span>
        <span className={`text-xs font-semibold tracking-wider text-neutral-200 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] ${subtitleClassName}`}>{subtitle}</span>
      </div>
    </div>
  );

  if (disabled || !href || href === "#") {
    return <div className="w-full select-none">{content}</div>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-full block outline-none group">
      {content}
    </a>
  );
};

const TelegramIcon = ({ className = "w-11 h-11" }: { className?: string }) => (
  <svg className={`${className} fill-current text-sky-400 drop-shadow-[0_2px_8px_rgba(56,189,248,0.4)]`} viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.799-1.185-.78-.415-1.21.258-1.91.176-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const WhatsAppIcon = ({ className = "w-11 h-11" }: { className?: string }) => (
  <svg className={`${className} fill-current text-emerald-400 drop-shadow-[0_2px_8px_rgba(52,211,153,0.4)]`} viewBox="0 0 24 24">
    <path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.12.552 4.17 1.599 5.986L.071 24l6.126-1.606c1.764.957 3.742 1.464 5.83 1.464 6.645 0 12.028-5.383 12.028-12.031S18.675 0 12.031 0zm0 21.849c-1.793 0-3.548-.482-5.086-1.393l-.365-.217-3.774.989 1.008-3.682-.238-.378a10.02 10.02 0 0 1-1.543-5.318C2.033 6.309 6.471 1.867 12.031 1.867c5.556 0 9.994 4.439 9.994 9.983s-4.438 9.999-9.994 9.999zm5.485-7.485c-.301-.151-1.782-.88-2.059-.982-.276-.1-.477-.151-.678.151-.201.301-.778.982-.954 1.183-.176.201-.351.226-.653.075-2.093-1.05-3.513-1.921-4.836-3.626-.176-.226-.019-.348.131-.498.136-.136.301-.351.452-.527.151-.176.201-.301.301-.502.1-.201.05-.376-.025-.527-.075-.151-.678-1.631-.929-2.233-.245-.588-.495-.508-.678-.518-.176-.008-.376-.011-.577-.011s-.527.075-.803.376c-.276.301-1.054 1.029-1.054 2.51s1.079 2.911 1.229 3.112c.151.201 2.122 3.238 5.14 4.542 1.942.836 2.709.914 3.652.766.793-.125 2.457-1.004 2.802-1.97.345-.966.345-1.792.245-1.97-.101-.176-.376-.276-.678-.427z" />
  </svg>
);

const ChatIcon = ({ className = "w-11 h-11" }: { className?: string }) => (
  <svg className={`${className} fill-current text-indigo-400 drop-shadow-[0_2px_8px_rgba(129,140,248,0.4)]`} viewBox="0 0 24 24">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 14h8v2H6v-2zm0-3h12v2H6v-2zm0-3h12v2H6V8z" />
  </svg>
);

const RobotIcon = ({ className = "w-11 h-11" }: { className?: string }) => (
  <svg className={`${className} fill-current text-rose-400 drop-shadow-[0_2px_8px_rgba(251,113,133,0.4)]`} viewBox="0 0 24 24">
    <path d="M19 10V7c0-1.1-.9-2-2-2h-3c0-1.1-.9-2-2-2s-2 .9-2 2H7c-1.1 0-2 .9-2 2v3c-1.66 0-3 1.34-3 3s1.34 3 3 3v2c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-2c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-8 4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
);

const LocationPinIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={`${className} fill-current text-red-400 drop-shadow-[0_2px_6px_rgba(248,113,113,0.5)]`} viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'telegram': return <TelegramIcon />;
    case 'whatsapp': return <WhatsAppIcon />;
    case 'bale': return <ChatIcon />;
    case 'bot': return <RobotIcon />;
    default: return <ChatIcon />;
  }
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-14 pb-10 px-6 w-full relative">
      {/* Brand Header */}
      <header className="flex flex-col items-center mb-8 text-center select-none">
        <h1 className="text-[44px] font-black tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] mb-1 leading-none">
          {config.business.nameEn}
        </h1>
        <p className="text-xs font-bold text-neutral-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] uppercase tracking-[0.25em]">
          {config.business.tagline}
        </p>
      </header>

      {/* 2x2 Grid Buttons Container */}
      <section className="w-full grid grid-cols-2 gap-4.5" dir="rtl">
        {config.buttons.map((button) => (
          <SquircleButton
            key={button.id}
            href={button.url}
            title={button.title}
            titleClassName={lalezar.className}
            subtitle={button.subtitle}
            subtitleClassName={button.subtitle === 'Coming Soon' ? '' : lalezar.className}
            icon={getIcon(button.icon)}
            bgClass="bg-white/[0.08] backdrop-blur-[24px]"
            textClass="text-white"
            borderClass="border border-white/[0.12]"
            disabled={!button.isActive}
          />
        ))}
      </section>

      {/* Interactive Calculators Section (Installments & Registry) */}
      <Calculators lalezarClassName={lalezar.className} />

      {/* VIP Waitlist & iPhone Radar Section */}
      <WaitlistSection lalezarClassName={lalezar.className} />

      {/* Location & Address Section */}
      <section className="w-full mt-7" dir="rtl">
        <div className="bg-white/[0.08] backdrop-blur-[24px] rounded-[32px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/[0.12] flex flex-col gap-4">
          <div className="flex items-start gap-3 text-white">
            <div className="mt-1 shrink-0">
              <LocationPinIcon />
            </div>
            <p className="text-[15px] font-medium leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              <span className="font-bold block mb-1">
                <span className={`${lalezar.className} tracking-wide text-lg text-white`}>{config.location.storeName}</span> <span className="text-neutral-300 text-sm font-normal">{config.business.nameEn}</span>
              </span>
              <span className={`${lalezar.className} tracking-wide text-neutral-200 text-[14px]`}>
                {config.location.addressText}
              </span>
            </p>
          </div>
          
          {/* Map Link Wrapper with Premium Overlay Effect */}
          <a 
            href={config.location.mapUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full block aspect-video rounded-[20px] overflow-hidden shadow-inner relative group border border-white/[0.08]"
            title="نمایش در نقشه گوگل"
          >
            <iframe 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(config.location.addressText)}&z=15&output=embed`}
              className="w-full h-full border-0 pointer-events-none brightness-[0.85] contrast-[1.05] transition-all duration-500 group-hover:brightness-100 group-hover:scale-105" 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto pt-10 pb-2 text-[10px] font-medium text-neutral-400 tracking-wider select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
        &copy; {new Date().getFullYear()} {config.business.nameEn}. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
