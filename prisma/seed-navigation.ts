/**
 * CAMPAUS NAVIGATION GRAPH SEEDER
 * ================================
 * This script populates your database with MapNodes and MapEdges
 * to define the walkable network on your campus.
 *
 * HOW TO USE:
 * 1. Replace the node coordinates with your REAL campus coordinates
 *    (use geojson.io or Google Maps to get accurate lat/lng)
 * 2. Define edges between nodes that share a walkable path
 * 3. Run: npx ts-node prisma/seed-navigation.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ============================================================
// STEP 1: DEFINE YOUR CAMPUS NODES
// Each node = a real point on campus (junction, entrance, etc.)
// Replace these with YOUR real campus coordinates from geojson.io
// ============================================================
const nodes = [
  // Main Gate Area
  { id: 'node-gate-main',      latitude: 5.6037,   longitude: -0.1872,  type: 'ENTRANCE'     },
  { id: 'node-gate-junction',  latitude: 5.6039,   longitude: -0.1870,  type: 'INTERSECTION' },

  // Science Center
  { id: 'node-sci-entrance',   latitude: 5.6043,   longitude: -0.1865,  type: 'ENTRANCE'     },
  { id: 'node-sci-junction',   latitude: 5.6041,   longitude: -0.1867,  type: 'INTERSECTION' },

  // Tech Plaza
  { id: 'node-tech-entrance',  latitude: 5.6030,   longitude: -0.1875,  type: 'ENTRANCE'     },
  { id: 'node-tech-junction',  latitude: 5.6032,   longitude: -0.1873,  type: 'INTERSECTION' },

  // Library
  { id: 'node-lib-entrance',   latitude: 5.6048,   longitude: -0.1860,  type: 'ENTRANCE'     },
  { id: 'node-lib-junction',   latitude: 5.6045,   longitude: -0.1862,  type: 'INTERSECTION' },

  // Dining Hall
  { id: 'node-dining-entrance',latitude: 5.6034,   longitude: -0.1868,  type: 'ENTRANCE'     },
  { id: 'node-central-cross',  latitude: 5.6038,   longitude: -0.1869,  type: 'INTERSECTION' },
];

// ============================================================
// STEP 2: DEFINE YOUR WALKABLE EDGES
// Each edge = a connection between two nodes
// distance is in METERS (pre-calculated for the A* algorithm)
// ============================================================
const edges = [
  // Main Gate to Central Crossroads
  { id: 'edge-01', startNodeId: 'node-gate-main',      endNodeId: 'node-gate-junction',  distance: 25,  type: 'WALKWAY' },
  { id: 'edge-02', startNodeId: 'node-gate-junction',  endNodeId: 'node-central-cross',  distance: 30,  type: 'WALKWAY' },

  // Central Cross to all buildings
  { id: 'edge-03', startNodeId: 'node-central-cross',  endNodeId: 'node-sci-junction',   distance: 45,  type: 'WALKWAY' },
  { id: 'edge-04', startNodeId: 'node-sci-junction',   endNodeId: 'node-sci-entrance',   distance: 20,  type: 'WALKWAY' },

  { id: 'edge-05', startNodeId: 'node-central-cross',  endNodeId: 'node-tech-junction',  distance: 50,  type: 'WALKWAY' },
  { id: 'edge-06', startNodeId: 'node-tech-junction',  endNodeId: 'node-tech-entrance',  distance: 22,  type: 'WALKWAY' },

  { id: 'edge-07', startNodeId: 'node-central-cross',  endNodeId: 'node-lib-junction',   distance: 70,  type: 'WALKWAY' },
  { id: 'edge-08', startNodeId: 'node-lib-junction',   endNodeId: 'node-lib-entrance',   distance: 18,  type: 'WALKWAY' },

  { id: 'edge-09', startNodeId: 'node-central-cross',  endNodeId: 'node-dining-entrance',distance: 35,  type: 'WALKWAY' },

  // Reverse edges (for bidirectional walking)
  { id: 'edge-01r', startNodeId: 'node-gate-junction',  endNodeId: 'node-gate-main',      distance: 25,  type: 'WALKWAY' },
  { id: 'edge-02r', startNodeId: 'node-central-cross',  endNodeId: 'node-gate-junction',  distance: 30,  type: 'WALKWAY' },
  { id: 'edge-03r', startNodeId: 'node-sci-junction',   endNodeId: 'node-central-cross',  distance: 45,  type: 'WALKWAY' },
  { id: 'edge-04r', startNodeId: 'node-sci-entrance',   endNodeId: 'node-sci-junction',   distance: 20,  type: 'WALKWAY' },
  { id: 'edge-05r', startNodeId: 'node-tech-junction',  endNodeId: 'node-central-cross',  distance: 50,  type: 'WALKWAY' },
  { id: 'edge-06r', startNodeId: 'node-tech-entrance',  endNodeId: 'node-tech-junction',  distance: 22,  type: 'WALKWAY' },
  { id: 'edge-07r', startNodeId: 'node-lib-junction',   endNodeId: 'node-central-cross',  distance: 70,  type: 'WALKWAY' },
  { id: 'edge-08r', startNodeId: 'node-lib-entrance',   endNodeId: 'node-lib-junction',   distance: 18,  type: 'WALKWAY' },
  { id: 'edge-09r', startNodeId: 'node-dining-entrance',endNodeId: 'node-central-cross',  distance: 35,  type: 'WALKWAY' },
];

async function seedNavigation() {
  console.log('🗺️  Seeding campus navigation graph...\n');

  // 1. Upsert all nodes
  console.log(`📍 Creating ${nodes.length} map nodes...`);
  for (const node of nodes) {
    await (prisma as any).mapNode.upsert({
      where: { id: node.id },
      update: { latitude: node.latitude, longitude: node.longitude, type: node.type as any },
      create: { id: node.id, latitude: node.latitude, longitude: node.longitude, type: node.type as any },
    });
  }
  console.log(`   ✅ ${nodes.length} nodes created.\n`);

  // 2. Upsert all edges
  console.log(`🔗 Creating ${edges.length} map edges...`);
  for (const edge of edges) {
    await (prisma as any).mapEdge.upsert({
      where: { id: edge.id },
      update: { distance: edge.distance, type: edge.type as any },
      create: {
        id: edge.id,
        startNodeId: edge.startNodeId,
        endNodeId: edge.endNodeId,
        distance: edge.distance,
        type: edge.type as any,
        isAccessible: true,
      },
    });
  }
  console.log(`   ✅ ${edges.length} edges created.\n`);

  console.log('🎉 Navigation graph seeded successfully!');
  console.log('   Run the validation script next to check graph connectivity.');
}

seedNavigation()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
