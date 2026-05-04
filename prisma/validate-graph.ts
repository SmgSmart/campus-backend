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

async function validateGraph() {
  console.log('🔍 Validating Campus Navigation Graph...\n');

  const nodes = await prisma.mapNode.findMany({ include: { outgoingEdges: true } });
  const edges = await prisma.mapEdge.findMany();

  if (nodes.length === 0) {
    console.log('❌ Error: No nodes found in database.');
    return;
  }

  console.log(`📊 Graph Stats: ${nodes.length} Nodes, ${edges.length} Edges.`);

  // 1. Check for Orphaned Nodes (No connections)
  const orphaned = nodes.filter(n => n.outgoingEdges.length === 0);
  if (orphaned.length > 0) {
    console.warn(`⚠️  Warning: Found ${orphaned.length} orphaned nodes (no outgoing paths):`);
    orphaned.forEach(n => console.log(`   - Node ${n.id} at ${n.latitude}, ${n.longitude}`));
  } else {
    console.log('✅ All nodes have outgoing connections.');
  }

  // 2. Connectivity Check (Breadth-First Search)
  // Ensures you can get from the main gate to everywhere else
  const startNode = nodes[0].id;
  const visited = new Set<string>();
  const queue = [startNode];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const node = nodes.find(n => n.id === currentId);
    if (node) {
      node.outgoingEdges.forEach(edge => {
        if (!visited.has(edge.endNodeId)) {
          queue.push(edge.endNodeId);
        }
      });
    }
  }

  if (visited.size < nodes.length) {
    console.error(`❌ Critical Error: Graph is DISCONNECTED.`);
    console.error(`   Accessible nodes: ${visited.size} / ${nodes.length}`);
    console.error(`   Tip: Check for broken edges or one-way paths that trap the algorithm.`);
  } else {
    console.log('✅ Graph is fully connected! Navigation is safe.');
  }

  console.log('\n✨ Validation complete.');
}

validateGraph()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
