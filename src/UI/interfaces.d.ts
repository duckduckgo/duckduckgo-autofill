import { TranslateFn } from "../locales/strings";

/**
 * Implement this tooltipHandler for anything that should be able
 * to render a line-item in the DataWebTooltip Tooltip
 */
interface TooltipItemRenderer {
  id(): string;
  labelMedium(t: TranslateFn, subtype: string): string;
  label?(t: TranslateFn, subtype: string): string | null | undefined;
  labelSmall?(t: TranslateFn, subtype: string): string | null | undefined;
  credentialsProvider?(): CredentialsObject["credentialsProvider"]
}

type PosFn = () => { x: number; y: number; height: number; width: number; }
type CleanupFn = () => void;
