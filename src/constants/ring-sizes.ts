// EU/ISO ring size = the inner circumference of the band in millimetres.
// Shared between the admin product form and the customer-facing size guide
// so the sizes we sell and the sizes we document can't drift apart.

export const RING_SIZE_MIN = 44;
export const RING_SIZE_MAX = 68;

export const RING_SIZE_OPTIONS: number[] = Array.from(
  { length: RING_SIZE_MAX - RING_SIZE_MIN + 1 },
  (_, i) => RING_SIZE_MIN + i
);

export function isValidRingSize(size: number): boolean {
  return (
    Number.isInteger(size) && size >= RING_SIZE_MIN && size <= RING_SIZE_MAX
  );
}

// Conversion reference shown in the size guide modal.
export const RING_SIZE_TABLE = [
  { eu: 48, us: "4.5", diameter: "15.3mm" },
  { eu: 50, us: "5.5", diameter: "15.9mm" },
  { eu: 52, us: "6", diameter: "16.5mm" },
  { eu: 54, us: "7", diameter: "17.2mm" },
  { eu: 56, us: "7.5", diameter: "17.8mm" },
  { eu: 58, us: "8.5", diameter: "18.5mm" },
  { eu: 60, us: "9", diameter: "19.1mm" },
];
