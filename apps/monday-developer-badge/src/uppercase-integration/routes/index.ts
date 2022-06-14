import express from 'express';
import mondayRoutes from './monday';
const router = express.Router();

router.use(mondayRoutes);
router.get('/', function(req, res) {
  res.json(getHealth());
});

router.get('/health', function(req, res) {
  res.json(getHealth());
  res.end();
});

function getHealth() {
  return {
    ok: true,
    message: 'Healthy'
  };
}

export default router;
