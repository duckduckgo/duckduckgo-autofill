/**
 * Implement this interface for anything that should be able
 * to render a line-item in the DataAutofill Tooltip
 */
interface TooltipItemRenderer {
  id(): string;
  secondaryText(subtype: string): string;
  primaryText(subtype: string): string;
}
