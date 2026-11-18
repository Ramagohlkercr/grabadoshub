import { connectToDatabase, closeDatabase, getDb } from '../config/database.js';
import { logger } from '../utils/logger.util.js';
import { env } from '../config/env.js';
import { Product } from '../models/product.model.js';

const DEMO_PRODUCTS: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>[] = [
  // ECOCUERO
  {
    name: 'Cuaderno A5 Ecocuero Grabado Láser',
    description: 'Cuaderno con tapas duras forradas en ecocuero de grano fino, 96 hojas rayadas ahuesadas de 80g y cinta señaladora. Grabado láser de alta precisión con bajo relieve térmico que revela un tono contrastante elegante.',
    category: 'Ecocuero',
    price: 18500,
    stock: 45,
    available: true,
    featured: true,
    imageUrl: '/assets/products/cuaderno-ecocuero.svg',
  },
  {
    name: 'Billetera Slim de Ecocuero con Iniciales',
    description: 'Billetera compacta de ecocuero reforzado con costuras perimetrales. Capacidad para 6 tarjetas y compartimento para billetes. Grabado láser puntual en esquina frontal con monograma o logotipo corporativo.',
    category: 'Ecocuero',
    price: 14200,
    stock: 30,
    available: true,
    featured: false,
    imageUrl: '/assets/products/billetera-ecocuero.svg',
  },
  {
    name: 'Set de 6 Posavasos Circulares en Ecocuero',
    description: 'Juego de seis posavasos de ecocuero bicapa de 10 cm de diámetro con base antideslizante y soporte contenedor a juego. Grabado láser detallado con patrones geométricos o marcas gastronómicas.',
    category: 'Ecocuero',
    price: 12900,
    stock: 25,
    available: true,
    featured: false,
    imageUrl: '/assets/products/posavasos-ecocuero.svg',
  },
  {
    name: 'Estuche Portadocumentos Ejecutivo',
    description: 'Organizador de viaje y reuniones confeccionado en ecocuero de alta resistencia al roce. Apto para pasaporte, credenciales y tablet pequeña. Grabado láser central con acabado mate distinguido.',
    category: 'Ecocuero',
    price: 26400,
    stock: 15,
    available: true,
    featured: true,
    imageUrl: '/assets/products/portadocumentos-ecocuero.svg',
  },

  // POLIAMIDA
  {
    name: 'Placa de Identificación Industrial en Poliamida',
    description: 'Chapa de poliamida técnica PA6 mecanizada y grabada con tecnología láser CO2 de alta frecuencia. Inmune a solventes, aceites y exposición prolongada a intemperie o altas temperaturas.',
    category: 'Poliamida',
    price: 8900,
    stock: 120,
    available: true,
    featured: false,
    imageUrl: '/assets/products/placa-poliamida.svg',
  },
  {
    name: 'Llaveros Técnicos con Código QR Grabado',
    description: 'Llavero robusto en poliamida reforzada con fibra para trazabilidad de llaves de obra, vehículos o casilleros. Grabado láser permanente de QR de alta densidad y código alfanumérico legible.',
    category: 'Poliamida',
    price: 4500,
    stock: 80,
    available: true,
    featured: false,
    imageUrl: '/assets/products/llavero-poliamida.svg',
  },
  {
    name: 'Panel Frontal para Instrumentación Electrónica',
    description: 'Frente de control cortado y grabado en poliamida con tolerancias menores a 0.1 mm. Calados para pulsadores y visualizadores digitales, grabado con esquemas y leyendas funcionales.',
    category: 'Poliamida',
    price: 32000,
    stock: 8,
    available: true,
    featured: true,
    imageUrl: '/assets/products/panel-poliamida.svg',
  },

  // ACRÍLICO
  {
    name: 'Cartel Corporativo Acrílico Cristal Flotante',
    description: 'Cartel de acrílico cristal colado de 6 mm con cantos pulidos al fuego y separadores metálicos de pared cromados. Grabado láser invertido en cara posterior que otorga profundidad tridimensional.',
    category: 'Acrílico',
    price: 39500,
    stock: 18,
    available: true,
    featured: true,
    imageUrl: '/assets/products/cartel-acrilico.svg',
  },
  {
    name: 'Trofeo Institucional Bloque Monolítico',
    description: 'Galardón conmemorativo en bloque macizo de acrílico de 20 mm con base escalonada. Grabado láser interno por rasterizado de microburbujas para reconocimientos corporativos y académicos.',
    category: 'Acrílico',
    price: 48000,
    stock: 12,
    available: true,
    featured: true,
    imageUrl: '/assets/products/trofeo-acrilico.svg',
  },
  {
    name: 'Lámpara LED Decorativa con Acrílico Grabado',
    description: 'Base de madera maciza de haya con tira LED blanca cálida de bajo consumo y placa acrílica de 4 mm grabada por vectorización de contorno. Crea un efecto de silueta luminosa flotante.',
    category: 'Acrílico',
    price: 24700,
    stock: 22,
    available: true,
    featured: false,
    imageUrl: '/assets/products/lampara-acrilico.svg',
  },
  {
    name: 'Señalética de Oficina en Acrílico Esmerilado',
    description: 'Placas modulares para numeración de despachos y salas de reunión. Acrílico esmerilado antirreflejo grabado a láser con iconografía universal accesible de alto contraste.',
    category: 'Acrílico',
    price: 11500,
    stock: 35,
    available: true,
    featured: false,
    imageUrl: '/assets/products/senaletica-acrilico.svg',
  },

  // ACCESORIOS
  {
    name: 'Termo de Acero Inoxidable 1L con Grabado Láser Fibra',
    description: 'Termo con doble pared de aislamiento al vacío que mantiene líquidos calientes o fríos por 24 horas. Grabado láser por recocido térmico sobre pintura electrostática, revelando el acero plateado.',
    category: 'Accesorios',
    price: 42000,
    stock: 28,
    available: true,
    featured: true,
    imageUrl: '/assets/products/termo-accesorios.svg',
  },
  {
    name: 'Mate Térmico de Acero con Grabado Láser',
    description: 'Mate ergonómico de acero inoxidable 304 térmico que no transmite calor al exterior ni genera condensación. Personalización láser perimetral con motivos tradicionales o corporativos.',
    category: 'Accesorios',
    price: 21500,
    stock: 40,
    available: true,
    featured: false,
    imageUrl: '/assets/products/mate-accesorios.svg',
  },
  {
    name: 'Lapicera Ejecutiva Metálica en Estuche Grabado',
    description: 'Bolígrafo metálico con mecanismo giratorio suave y repuesto tipo Parker. Incluye grabado láser de nombre o firma en el cuerpo y estuche metálico grabado a juego.',
    category: 'Accesorios',
    price: 13800,
    stock: 0,
    available: false,
    featured: false,
    imageUrl: '/assets/products/lapicera-accesorios.svg',
  },
  {
    name: 'Multiherramienta Plegable 12 en 1 Grabada',
    description: 'Pinza multifunción en acero templado con alicate, navaja, serrucho, abrelatas y juego de puntas de destornillador. Mango con cachas anodizadas grabadas con marca o dedicatoria.',
    category: 'Accesorios',
    price: 29900,
    stock: 14,
    available: true,
    featured: false,
    imageUrl: '/assets/products/multiherramienta-accesorios.svg',
  },
];

async function seedProducts() {
  try {
    logger.info('🌱 Starting products seed process...');

    let mongoUri = env.MONGODB_URI;
    try {
      await connectToDatabase(mongoUri);
    } catch {
      logger.warn('⚠️ Starting embedded MongoMemoryServer for seed...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const memoryServer = await MongoMemoryServer.create();
      mongoUri = memoryServer.getUri();
      await connectToDatabase(mongoUri);
    }

    const db = getDb();
    const collection = db.collection<Product>('products');

    const currentCount = await collection.countDocuments();
    logger.info(`Existing products count: ${currentCount}`);

    const now = new Date();
    const productsToInsert = DEMO_PRODUCTS.map((prod, index) => ({
      ...prod,
      createdAt: new Date(now.getTime() - (DEMO_PRODUCTS.length - index) * 3600000),
      updatedAt: now,
    }));

    // If already has products, update them or insert missing
    for (const item of productsToInsert) {
      await collection.updateOne(
        { name: item.name },
        { $set: item },
        { upsert: true }
      );
    }

    const finalCount = await collection.countDocuments();
    logger.info(`✅ Successfully seeded catalog! Total products now: ${finalCount}`);

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
