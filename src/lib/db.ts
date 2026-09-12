import pg from 'pg';
import dotenv from 'dotenv';
import type { Part } from './types';

dotenv.config();

const { Client } = pg;

export const DEFAULT_PART_IMAGE = '/assets/dynasty-logo.png';

function getDatabaseUrl(): string {
  if (typeof process !== 'undefined' && process.env?.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  return 'postgresql://postgres.caknbpusgwwlwhaukbdb:D7nas7yp4ssw04dde2cv1n5085567@aws-0-us-west-2.pooler.supabase.com:5432/postgres';
}

const fallbackParts: Part[] = [
  {
    id: 'dw-p-01',
    name: 'Filtro de Aceite Sintético de Alto Desempeño',
    sku: 'DW-FLT-B48',
    barcode: '4011558021948',
    partType: 'Repuesto',
    category: 'Filtros',
    brand: 'MANN-FILTER',
    quality: 'OE Supplier',
    oeNumber: '11428583898',
    manufacturerNumber: 'HU 6022 z',
    warehouse: 'Principal',
    onHand: 24,
    price: 1350,
    active: true,
    fitments: [
      { make: 'BMW', model: 'Serie 3', chassis: 'G20', yearFrom: 2019, yearTo: 2024, engine: 'B48 2.0L Turbo' },
      { make: 'BMW', model: 'Serie 4', chassis: 'G22', yearFrom: 2020, yearTo: 2025, engine: 'B48' },
      { make: 'BMW', model: 'Z4', chassis: 'G29', yearFrom: 2019, yearTo: 2024, engine: 'sDrive30i' }
    ]
  },
  {
    id: 'dw-p-02',
    name: 'Pastillas de Freno Cerámicas Delanteras M-Sport',
    sku: 'DW-BRK-M4F82',
    barcode: '4047024783912',
    partType: 'Repuesto',
    category: 'Frenos',
    brand: 'Brembo',
    quality: 'OE Supplier',
    oeNumber: '34112284765',
    manufacturerNumber: 'P 06 088',
    axle: 'Delantero',
    side: 'Ambos',
    warehouse: 'Principal',
    onHand: 12,
    price: 9800,
    active: true,
    fitments: [
      { make: 'BMW', model: 'M4', chassis: 'F82', yearFrom: 2014, yearTo: 2020, engine: 'S55 3.0L Bi-Turbo' },
      { make: 'BMW', model: 'M3', chassis: 'F80', yearFrom: 2014, yearTo: 2019, engine: 'S55 3.0L' }
    ]
  },
  {
    id: 'dw-p-03',
    name: 'Discos de Freno Perforados y Ventilados 380mm',
    sku: 'DW-ROTOR-AMG',
    barcode: '4005108573210',
    partType: 'Repuesto',
    category: 'Frenos',
    brand: 'Zimmermann',
    quality: 'OE Supplier',
    oeNumber: '2054211312',
    manufacturerNumber: '400.3340.52',
    axle: 'Delantero',
    warehouse: 'Principal',
    onHand: 8,
    price: 18500,
    active: true,
    fitments: [
      { make: 'Mercedes-Benz', model: 'C63 AMG', chassis: 'W205', yearFrom: 2015, yearTo: 2022, engine: 'M177 4.0L V8' },
      { make: 'Mercedes-Benz', model: 'C43 AMG', chassis: 'W205', yearFrom: 2016, yearTo: 2021, engine: 'M276 3.0L V6' }
    ]
  },
  {
    id: 'dw-p-04',
    name: 'Bomba de Agua con Termostato Electrónico Integrado',
    sku: 'DW-COOL-EA888',
    barcode: '4044197821932',
    partType: 'Repuesto',
    category: 'Motor',
    brand: 'INA',
    quality: 'OE Supplier',
    oeNumber: '06L121111H',
    manufacturerNumber: '538 0360 10',
    warehouse: 'Principal',
    onHand: 6,
    price: 16500,
    active: true,
    fitments: [
      { make: 'Audi', model: 'A4', chassis: 'B9', yearFrom: 2016, yearTo: 2023, engine: '2.0 TFSI' },
      { make: 'Audi', model: 'A5', chassis: 'F5', yearFrom: 2017, yearTo: 2024, engine: '2.0 TFSI' },
      { make: 'Audi', model: 'Q5', chassis: 'FY', yearFrom: 2018, yearTo: 2024, engine: '2.0 TFSI quattro' }
    ]
  },
  {
    id: 'dw-p-05',
    name: 'Bujías de Iridio Láser High Performance (Set 4x)',
    sku: 'DW-SPK-NGK-ILZ',
    barcode: '087295194982',
    partType: 'Repuesto',
    category: 'Encendido',
    brand: 'NGK Laser Iridium',
    quality: 'OE Supplier',
    oeNumber: '12290-59B-003',
    manufacturerNumber: 'ILZKAR8H8S',
    warehouse: 'Principal',
    onHand: 35,
    price: 4600,
    active: true,
    fitments: [
      { make: 'Honda', model: 'Civic Type R', chassis: 'FK8 / FL5', yearFrom: 2017, yearTo: 2024, engine: 'K20C1 Turbo' },
      { make: 'Honda', model: 'Accord', chassis: 'CV1', yearFrom: 2018, yearTo: 2023, engine: '2.0T' }
    ]
  },
  {
    id: 'dw-p-06',
    name: 'Amortiguadores Monotubo Delanteros Bilstein B6',
    sku: 'DW-SUS-B6-F150',
    barcode: '4025258793214',
    partType: 'Repuesto',
    category: 'Suspensión',
    brand: 'Bilstein',
    quality: 'Aftermarket Premium',
    oeNumber: 'JL3Z-18124-B',
    manufacturerNumber: '24-248129',
    axle: 'Delantero',
    warehouse: 'Principal',
    onHand: 10,
    price: 14200,
    active: true,
    fitments: [
      { make: 'Ford', model: 'F-150', chassis: 'Gen 13', yearFrom: 2015, yearTo: 2020, engine: '3.5L EcoBoost / 5.0L V8' },
      { make: 'Ford', model: 'F-150', chassis: 'Gen 14', yearFrom: 2021, yearTo: 2024, engine: '3.5L PowerBoost / EcoBoost' }
    ]
  },
  {
    id: 'dw-p-07',
    name: 'Kit de Cadena de Distribución con Tensores Hidráulicos',
    sku: 'DW-TIM-2GR',
    barcode: '4909500982310',
    partType: 'Repuesto',
    category: 'Motor',
    brand: 'AISIN / Toyoda',
    quality: 'Original OE',
    oeNumber: '13506-31010',
    manufacturerNumber: 'TK-042A',
    warehouse: 'Principal',
    onHand: 7,
    price: 22800,
    active: true,
    fitments: [
      { make: 'Toyota', model: '4Runner', chassis: 'N280', yearFrom: 2010, yearTo: 2024, engine: '1GR-FE 4.0L V6' },
      { make: 'Toyota', model: 'Tacoma', chassis: 'N300', yearFrom: 2016, yearTo: 2023, engine: '2GR-FKS 3.5L V6' },
      { make: 'Toyota', model: 'Land Cruiser Prado', chassis: 'J150', yearFrom: 2012, yearTo: 2023, engine: '1GR-FE' }
    ]
  },
  {
    id: 'dw-p-08',
    name: 'Brazos de Control y Rótulas Delanteras Reforzadas',
    sku: 'DW-ARM-LEM-F30',
    barcode: '4047437084920',
    partType: 'Repuesto',
    category: 'Suspensión',
    brand: 'Lemförder',
    quality: 'OE Supplier',
    oeNumber: '31126855741',
    manufacturerNumber: '36940 01',
    axle: 'Delantero',
    side: 'Izquierdo/Derecho',
    warehouse: 'Principal',
    onHand: 14,
    price: 8400,
    active: true,
    fitments: [
      { make: 'BMW', model: 'Serie 3', chassis: 'F30 / F31', yearFrom: 2012, yearTo: 2018, engine: 'N20 / B48 / B58' },
      { make: 'BMW', model: 'Serie 4', chassis: 'F32 / F36', yearFrom: 2014, yearTo: 2020, engine: '428i / 430i / 440i' }
    ]
  },
  {
    id: 'dw-p-09',
    name: 'Filtro de Aceite de Rendimiento Porsche OE',
    sku: 'DW-FLT-POR911',
    barcode: '4011558099201',
    partType: 'Repuesto',
    category: 'Filtros',
    brand: 'Mahle / Porsche OE',
    quality: 'Genuine',
    oeNumber: '9A719840500',
    manufacturerNumber: 'OX 1034D',
    warehouse: 'Principal',
    onHand: 18,
    price: 3200,
    active: true,
    fitments: [
      { make: 'Porsche', model: '911 Carrera / S / GTS', chassis: '992', yearFrom: 2019, yearTo: 2024, engine: '3.0L Twin-Turbo Boxer-6' },
      { make: 'Porsche', model: 'Macan', chassis: '95B', yearFrom: 2018, yearTo: 2024, engine: '2.0T / 2.9T V6' },
      { make: 'Porsche', model: 'Cayenne', chassis: '9Y0', yearFrom: 2018, yearTo: 2024, engine: '3.0T V6 / 4.0T V8' }
    ]
  },
  {
    id: 'dw-p-10',
    name: 'Pastillas de Freno Delanteras High-Performance',
    sku: 'DW-BRK-POR-GT',
    barcode: '4047024991351',
    partType: 'Repuesto',
    category: 'Frenos',
    brand: 'Brembo',
    quality: 'OE Supplier',
    oeNumber: '99135194902',
    manufacturerNumber: 'P 65 025',
    axle: 'Delantero',
    side: 'Ambos',
    warehouse: 'Principal',
    onHand: 8,
    price: 18900,
    active: true,
    fitments: [
      { make: 'Porsche', model: '911 GT3 / Turbo', chassis: '991', yearFrom: 2014, yearTo: 2019, engine: '3.8L / 4.0L' },
      { make: 'Porsche', model: 'Panamera', chassis: '971', yearFrom: 2017, yearTo: 2024, engine: '2.9T / 4.0T' }
    ]
  },
  {
    id: 'dw-p-11',
    name: 'Amortiguadores Delanteros Adaptativos CCD Motorcraft OE',
    sku: 'DW-SUS-LINC-NAV',
    barcode: '031508241812',
    partType: 'Repuesto',
    category: 'Suspensión',
    brand: 'Motorcraft',
    quality: 'Genuine',
    oeNumber: 'JL1Z-18124-C',
    manufacturerNumber: 'ASH-24626',
    axle: 'Delantero',
    side: 'Ambos',
    warehouse: 'Principal',
    onHand: 6,
    price: 26500,
    active: true,
    fitments: [
      { make: 'Lincoln', model: 'Navigator', chassis: 'U554', yearFrom: 2018, yearTo: 2024, engine: '3.5L Twin-Turbo EcoBoost V6' },
      { make: 'Lincoln', model: 'Aviator', chassis: 'U611', yearFrom: 2020, yearTo: 2024, engine: '3.0L Twin-Turbo V6' }
    ]
  },
  {
    id: 'dw-p-12',
    name: 'Discos de Freno Delanteros Heavy-Duty Ventilados',
    sku: 'DW-ROTOR-LINC',
    barcode: '031508112544',
    partType: 'Repuesto',
    category: 'Frenos',
    brand: 'Motorcraft',
    quality: 'Genuine',
    oeNumber: 'FL1Z-1125-A',
    manufacturerNumber: 'BRRF-318',
    axle: 'Delantero',
    side: 'Ambos',
    warehouse: 'Principal',
    onHand: 10,
    price: 15800,
    active: true,
    fitments: [
      { make: 'Lincoln', model: 'Navigator L', chassis: 'U554', yearFrom: 2018, yearTo: 2024, engine: '3.5L V6 EcoBoost' },
      { make: 'Lincoln', model: 'Continental', chassis: 'D544', yearFrom: 2017, yearTo: 2020, engine: '2.7L / 3.0L Twin-Turbo' }
    ]
  },
  {
    id: 'dw-p-13',
    name: 'Bujías de Iridio Doble Profesional (Set 8x)',
    sku: 'DW-SPK-ACD-V8',
    barcode: '707773889123',
    partType: 'Repuesto',
    category: 'Encendido',
    brand: 'AC Delco Professional',
    quality: 'OE Supplier',
    oeNumber: '12622561',
    manufacturerNumber: '41-110',
    warehouse: 'Principal',
    onHand: 28,
    price: 6800,
    active: true,
    fitments: [
      { make: 'Chevrolet', model: 'Silverado 1500', chassis: 'T1XX', yearFrom: 2019, yearTo: 2024, engine: 'EcoTec3 5.3L / 6.2L V8' },
      { make: 'Chevrolet', model: 'Tahoe / Suburban', chassis: 'GMT1XX', yearFrom: 2021, yearTo: 2024, engine: '5.3L / 6.2L V8' },
      { make: 'Chevrolet', model: 'Camaro SS', chassis: 'Alpha', yearFrom: 2016, yearTo: 2024, engine: '6.2L LT1 V8' }
    ]
  },
  {
    id: 'dw-p-14',
    name: 'Bomba de Agua con Carcasa y Empaque AC Delco OE',
    sku: 'DW-PUMP-CHEV-53',
    barcode: '707773126689',
    partType: 'Repuesto',
    category: 'Motor',
    brand: 'AC Delco',
    quality: 'Genuine',
    oeNumber: '12668984',
    manufacturerNumber: '251-751',
    warehouse: 'Principal',
    onHand: 9,
    price: 13900,
    active: true,
    fitments: [
      { make: 'Chevrolet', model: 'Tahoe', chassis: 'K2XX / T1XX', yearFrom: 2015, yearTo: 2023, engine: '5.3L EcoTec3 V8' },
      { make: 'Chevrolet', model: 'Silverado 1500', chassis: 'K2XX / T1XX', yearFrom: 2014, yearTo: 2023, engine: '5.3L / 6.2L V8' }
    ]
  },
  {
    id: 'dw-p-15',
    name: 'Filtro de Aceite de Motor Sintético Hengst / Mercedes OE',
    sku: 'DW-FLT-MB-M274',
    barcode: '4030776044123',
    partType: 'Repuesto',
    category: 'Filtros',
    brand: 'Hengst / Mercedes OE',
    quality: 'Original OE',
    oeNumber: '2701800109',
    manufacturerNumber: 'E818H D238',
    warehouse: 'Principal',
    onHand: 20,
    price: 1850,
    active: true,
    fitments: [
      { make: 'Mercedes-Benz', model: 'Clase C (C300)', chassis: 'W205 / W206', yearFrom: 2015, yearTo: 2024, engine: 'M274 / M254 2.0L Turbo' },
      { make: 'Mercedes-Benz', model: 'GLC 300', chassis: 'X253 / X254', yearFrom: 2016, yearTo: 2024, engine: '2.0L Turbo' },
      { make: 'Mercedes-Benz', model: 'Clase E (E350)', chassis: 'W213', yearFrom: 2017, yearTo: 2023, engine: '2.0L Turbo' }
    ]
  },
  {
    id: 'dw-p-16',
    name: 'Kit de Pastillas de Freno Delanteras ATE Ceramic OE',
    sku: 'DW-BRK-AUDI-ATE',
    barcode: '4006632289123',
    partType: 'Repuesto',
    category: 'Frenos',
    brand: 'ATE',
    quality: 'OE Supplier',
    oeNumber: '8W0698151N',
    manufacturerNumber: '13.0470-7313.2',
    axle: 'Delantero',
    side: 'Ambos',
    warehouse: 'Principal',
    onHand: 11,
    price: 8900,
    active: true,
    fitments: [
      { make: 'Audi', model: 'A4 / S4', chassis: 'B9', yearFrom: 2017, yearTo: 2024, engine: '2.0 TFSI / 3.0 TFSI' },
      { make: 'Audi', model: 'Q5 / SQ5', chassis: 'FY', yearFrom: 2018, yearTo: 2024, engine: '2.0T / 3.0T quattro' },
      { make: 'Audi', model: 'A6', chassis: 'C8', yearFrom: 2019, yearTo: 2024, engine: '2.0T / 3.0T' }
    ]
  },
  {
    id: 'dw-p-17',
    name: 'Pastillas de Freno Delanteras Cerámicas Advics / Toyota OE',
    sku: 'DW-BRK-TOY-ADV',
    barcode: '4954514981234',
    partType: 'Repuesto',
    category: 'Frenos',
    brand: 'Advics / Toyota',
    quality: 'Original OE',
    oeNumber: '04465-AZ200',
    manufacturerNumber: 'SN119P',
    axle: 'Delantero',
    side: 'Ambos',
    warehouse: 'Principal',
    onHand: 16,
    price: 5200,
    active: true,
    fitments: [
      { make: 'Toyota', model: 'Land Cruiser', chassis: 'J200 / J300', yearFrom: 2012, yearTo: 2024, engine: '5.7L V8 / 3.5L Twin-Turbo' },
      { make: 'Toyota', model: '4Runner', chassis: 'N280', yearFrom: 2010, yearTo: 2024, engine: '4.0L V6' },
      { make: 'Toyota', model: 'Hilux', chassis: 'AN120', yearFrom: 2015, yearTo: 2024, engine: '2.8L D-4D Turbo Diesel' }
    ]
  }
];

export async function getAllParts(): Promise<Part[]> {
  let client: pg.Client | null = null;
  try {
    const conn = getDatabaseUrl();
    client = new Client({
      connectionString: conn,
      ssl: conn.includes('supabase.com') ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 5000,
    });
    await client.connect();
    const query = `
      SELECT p.id, p.name, p.sku, p.barcode, p.part_type as "partType", p.category, p.brand,
             p.quality, p.oe_number as "oeNumber", p.manufacturer_number as "manufacturerNumber",
             p.axle, p.side, p.position, p.warehouse, p.on_hand as "onHand", p.price::float as price,
             p.notes, p.image_url as "imageUrl", p.image_url as "image_url", p.active,
             coalesce(
               json_agg(
                 json_build_object(
                   'id', f.id,
                   'make', f.make,
                   'model', f.model,
                   'chassis', f.chassis,
                   'yearFrom', f.year_from,
                   'yearTo', f.year_to,
                   'engine', f.engine,
                   'drivetrain', f.drivetrain
                 )
               ) filter (where f.id is not null), '[]'::json
             ) as fitments
      FROM parts p
      LEFT JOIN fitments f ON f.part_id = p.id
      WHERE p.active = true
      GROUP BY p.id
      ORDER BY p.name ASC
    `;
    const res = await client.query(query);
    const rawDbParts = (res.rows || []).map((row: any) => ({
      ...row,
      price: Number(row.price || 0),
      onHand: Number(row.onHand || 0),
      imageUrl: (row.imageUrl || row.image_url || '').trim() || DEFAULT_PART_IMAGE,
      image_url: (row.imageUrl || row.image_url || '').trim() || DEFAULT_PART_IMAGE,
      fitments: Array.isArray(row.fitments) ? row.fitments : []
    }));

    // Filter out vitest/migration test records so customers only see real inventory
    const dbParts = rawDbParts.filter((p: any) => {
      const name = (p.name || '').toLowerCase().trim();
      const sku = (p.sku || '').toLowerCase().trim();
      if (name === 'test' || name.startsWith('filtro de prueba') || name.startsWith('pieza ciclo') || name.startsWith('pieza para dev') || name.startsWith('prueba')) {
        return false;
      }
      if (sku.startsWith('test-') || sku.startsWith('mov-cycle') || sku.startsWith('ret-test')) {
        return false;
      }
      return true;
    });

    // Combine dbParts with enriched high-demand catalog items so users have both
    // real Supabase parts and an extensive catalog ready to buy.
    const normalizedFallbacks = fallbackParts.map(fp => ({
      ...fp,
      imageUrl: fp.imageUrl || fp.image_url || DEFAULT_PART_IMAGE,
      image_url: fp.imageUrl || fp.image_url || DEFAULT_PART_IMAGE,
    }));
    const existingSkus = new Set(dbParts.map((p: any) => (p.sku || '').toLowerCase()));
    const enriched = [
      ...dbParts,
      ...normalizedFallbacks.filter(fp => !existingSkus.has(fp.sku.toLowerCase()))
    ];
    return enriched;
  } catch (err) {
    console.error('Database connection error in getAllParts, using fallback catalog:', err);
    return fallbackParts.map(fp => ({
      ...fp,
      imageUrl: fp.imageUrl || fp.image_url || DEFAULT_PART_IMAGE,
      image_url: fp.imageUrl || fp.image_url || DEFAULT_PART_IMAGE,
    }));
  } finally {
    if (client) {
      try {
        await client.end();
      } catch {}
    }
  }
}
