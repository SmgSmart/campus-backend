import { Request, Response } from 'express';
import NavigationService from '../services/navigationService';
import prisma from '../services/prisma';

export const findPath = async (req: Request, res: Response) => {
  try {
    const { startLat, startLng, destinationId, floorId } = req.body;

    if (!startLat || !startLng || !destinationId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // 1. Find the starting node nearest to the user
    const startNode = await NavigationService.findNearestNode({ latitude: startLat, longitude: startLng }, floorId);
    if (!startNode) {
      return res.status(404).json({ error: 'No navigation nodes found near your location' });
    }

    // 2. Find the destination node
    // Destinations can be Buildings or Rooms
    let endNodeId: string | null = null;
    
    const building = await prisma.building.findUnique({ where: { id: destinationId } });
    if (building) {
      // For buildings, find the nearest ENTRANCE node
      const entranceNode = await prisma.mapNode.findFirst({
        where: { type: 'ENTRANCE' as any } // Cast to any to avoid TS issues if prisma client not updated yet
      });
      endNodeId = entranceNode?.id || null;
    } else {
      const room = await prisma.room.findUnique({ where: { id: destinationId } });
      endNodeId = room?.nodeId || null;
    }

    if (!endNodeId) {
      return res.status(404).json({ error: 'Destination node not found' });
    }

    // 3. Execute A* Algorithm (Phase 4)
    const result = await NavigationService.findPath(startNode.id, endNodeId);

    if (!result) {
      return res.status(404).json({ error: 'No walkable path found to this destination' });
    }

    res.json({
      message: 'Route found',
      startNodeId: startNode.id,
      endNodeId: endNodeId,
      path: result.coordinates,
      distance: result.distance,
      duration: result.duration
    });
  } catch (error) {
    console.error('Pathfinding Error:', error);
    res.status(500).json({ error: 'Internal server error during pathfinding' });
  }
};

export const getMapData = async (req: Request, res: Response) => {
  try {
    const [nodes, edges] = await Promise.all([
      prisma.mapNode.findMany(),
      prisma.mapEdge.findMany()
    ]);
    res.json({ nodes, edges });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch map data' });
  }
};
