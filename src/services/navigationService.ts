import prisma from './prisma';

export interface Point {
  latitude: number;
  longitude: number;
}

class NavigationService {
  // Helper to calculate distance between two coordinates in meters (Haversine)
  calculateDistance(p1: Point, p2: Point): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (p1.latitude * Math.PI) / 180;
    const φ2 = (p2.latitude * Math.PI) / 180;
    const Δφ = ((p2.latitude - p1.latitude) * Math.PI) / 180;
    const Δλ = ((p2.longitude - p1.longitude) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Find the nearest MapNode to a given coordinate
  async findNearestNode(point: Point, floorId?: string) {
    const nodes = await prisma.mapNode.findMany({
      where: floorId ? { floorId } : {},
    });

    if (nodes.length === 0) return null;

    let nearest = nodes[0];
    let minDistance = this.calculateDistance(point, { latitude: nodes[0].latitude, longitude: nodes[0].longitude });

    for (const node of nodes) {
      const dist = this.calculateDistance(point, { latitude: node.latitude, longitude: node.longitude });
      if (dist < minDistance) {
        minDistance = dist;
        nearest = node;
      }
    }

    return nearest;
  }

  // A* Pathfinding Implementation
  async findPath(startNodeId: string, endNodeId: string) {
    const nodes = await prisma.mapNode.findMany({
      include: { outgoingEdges: true }
    });

    // Create lookup maps
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    
    // openSet: nodes to be evaluated
    const openSet: string[] = [startNodeId];
    
    // cameFrom: for reconstructing the final path
    const cameFrom = new Map<string, string>();

    // gScore: cost from start to current node
    const gScore = new Map<string, number>();
    nodes.forEach(n => gScore.set(n.id, Infinity));
    gScore.set(startNodeId, 0);

    // fScore: total estimated cost (gScore + heuristic)
    const fScore = new Map<string, number>();
    nodes.forEach(n => fScore.set(n.id, Infinity));
    
    const endNode = nodeMap.get(endNodeId);
    if (!endNode) return null;

    fScore.set(startNodeId, this.calculateDistance(
      nodeMap.get(startNodeId)!, 
      endNode
    ));

    while (openSet.length > 0) {
      // Find node in openSet with lowest fScore
      openSet.sort((a, b) => (fScore.get(a) || Infinity) - (fScore.get(b) || Infinity));
      const currentId = openSet.shift()!;

      if (currentId === endNodeId) {
        return this.reconstructPath(cameFrom, currentId, nodeMap);
      }

      const current = nodeMap.get(currentId)!;
      for (const edge of current.outgoingEdges) {
        const neighborId = edge.endNodeId;
        const neighbor = nodeMap.get(neighborId);
        if (!neighbor) continue;

        const tentativeGScore = (gScore.get(currentId) || Infinity) + edge.distance;

        if (tentativeGScore < (gScore.get(neighborId) || Infinity)) {
          cameFrom.set(neighborId, currentId);
          gScore.set(neighborId, tentativeGScore);
          const h = this.calculateDistance(neighbor, endNode);
          fScore.set(neighborId, tentativeGScore + h);

          if (!openSet.includes(neighborId)) {
            openSet.push(neighborId);
          }
        }
      }
    }

    return null; // No path found
  }

  private reconstructPath(cameFrom: Map<string, string>, currentId: string, nodeMap: Map<string, any>) {
    const totalPath = [nodeMap.get(currentId)];
    while (cameFrom.has(currentId)) {
      currentId = cameFrom.get(currentId)!;
      totalPath.unshift(nodeMap.get(currentId));
    }
    
    return {
      nodes: totalPath,
      coordinates: totalPath.map(n => ({ latitude: n.latitude, longitude: n.longitude })),
      distance: totalPath.length > 1 ? this.calculateTotalDistance(totalPath) : 0,
      duration: Math.round((totalPath.length > 1 ? this.calculateTotalDistance(totalPath) : 0) / 1.4) // Assuming 1.4m/s walking speed
    };
  }

  private calculateTotalDistance(pathNodes: any[]): number {
    let total = 0;
    for (let i = 0; i < pathNodes.length - 1; i++) {
      total += this.calculateDistance(pathNodes[i], pathNodes[i+1]);
    }
    return total;
  }
}

export default new NavigationService();
