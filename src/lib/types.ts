export interface Fitment {
  id?: string;
  partId?: string;
  make: string;
  model: string;
  chassis?: string;
  yearFrom?: number | null;
  yearTo?: number | null;
  engine?: string;
  drivetrain?: string;
  trim?: string;
  notes?: string;
}

export interface PartReference {
  id?: string;
  partId?: string;
  refType?: string;
  brand?: string;
  number: string;
  notes?: string;
}

export interface Part {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  partType?: string;
  category?: string;
  brand?: string;
  quality?: string;
  oeNumber?: string;
  manufacturerNumber?: string;
  axle?: string;
  side?: string;
  position?: string;
  warehouse?: string;
  onHand: number;
  committed?: number;
  price: number;
  cost?: number;
  warrantyMonths?: number;
  notes?: string;
  imageUrl?: string;
  image_url?: string;
  active: boolean;
  fitments: Fitment[];
  references?: PartReference[];
}
