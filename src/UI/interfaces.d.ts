/**
 * Implement this interface for anything that should be able
 * to render a line-item in the DataAutofill Tooltip
 */
interface TooltipItemRenderer {
  id(): string;
  labelMedium(subtype: string): string;
  label?(subtype: string): string | null | undefined;
  labelSmall?(subtype: string): string | null | undefined;
}
