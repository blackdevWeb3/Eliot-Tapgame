interface TelegramWebApps {
  WebApp: {
    ready(): void;
    expand(): void;
    disableVerticalSwipes(): void;
    isVerticalSwipesEnabled: boolean;
    setHeaderColor: (color: string) => void;
  }
}

declare global {
  interface Window {
    Telegram?: TelegramWebApps;
  }
}

export {};