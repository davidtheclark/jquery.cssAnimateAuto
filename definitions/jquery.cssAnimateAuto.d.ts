interface cssAnimateAutoOptions {
  transition?: string;
  action?: string;
  openClass?: string;
  eventNamespace?: string;
  to?: boolean;
}

interface JQuery {
    cssAnimateAuto(param?: cssAnimateAutoOptions): JQuery;
    cssAnimateAuto(param?: string): JQuery;
}
