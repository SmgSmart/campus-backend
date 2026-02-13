import { Router } from 'express';
import { getAllBuildings, getBuildingById, createBuilding, updateBuilding, deleteBuilding } from '../controllers/buildingController';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../controllers/roomController';
import { getPaths } from '../controllers/pathController';
import { postFeedback, postAnalytics } from '../controllers/extraController';
import { register, login } from '../controllers/authController';
import { adminAuth } from '../middleware/adminAuth';

const router = Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Profile routes
import { getProfile, updateProfile } from '../controllers/userController';
import { userAuth } from '../middleware/userAuth';
router.get('/auth/profile', userAuth, getProfile);
router.put('/auth/profile', userAuth, updateProfile);

// Building routes
router.get('/buildings', getAllBuildings);
router.get('/buildings/:id', getBuildingById);

// Room routes
router.get('/rooms', getRooms);

// Path routes
router.get('/paths', getPaths);

// Feedback & Analytics
router.post('/feedback', postFeedback);
router.post('/analytics/location-usage', postAnalytics);

// Admin Protected Routes
router.post('/buildings', adminAuth, createBuilding);
router.put('/buildings/:id', adminAuth, updateBuilding);
router.delete('/buildings/:id', adminAuth, deleteBuilding);

router.post('/rooms', adminAuth, createRoom);
router.put('/rooms/:id', adminAuth, updateRoom);
router.delete('/rooms/:id', adminAuth, deleteRoom);

// Floor routes
import { getFloors, createFloor, updateFloor, deleteFloor } from '../controllers/floorController';
router.get('/floors', getFloors);
router.post('/floors', adminAuth, createFloor);
router.put('/floors/:id', adminAuth, updateFloor);
router.delete('/floors/:id', adminAuth, deleteFloor);

// Category routes
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
router.get('/categories', getCategories);
router.post('/categories', adminAuth, createCategory);
router.put('/categories/:id', adminAuth, updateCategory);
router.delete('/categories/:id', adminAuth, deleteCategory);

export default router;
