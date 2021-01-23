const router = require('express').Router();
const stringify = require('csv-stringify');

const database = require('../database.json');

router.get('/', (req, res) => {
  const handles = req.query.handles.split(';').map(handle => handle.toLowerCase().trim());

  const data = handles.map(handle => {
    const entry = database.filter(entry => entry.handle.toLowerCase() === handle)[0];
    if (entry === undefined) {
      return { handle, 'Contest 1': 0, 'Contest 2': 0, 'Contest 3': 0, 'Total': 0 };
    } else {
      const points = [
        entry['Contest 1'] ? entry['Contest 1'].points : 0,
        entry['Contest 2'] ? entry['Contest 2'].points : 0,
        entry['Contest 3'] ? entry['Contest 3'].points : 0,
      ];

      return {
        handle,
        'Contest 1': entry['Contest 1'] ? entry['Contest 1'].points : 0,
        'Contest 2': entry['Contest 2'] ? entry['Contest 2'].points : 0,
        'Contest 3': entry['Contest 3'] ? entry['Contest 3'].points : 0,
        'Total': points.reduce((prev, current) => prev + current, 0),
        'Contest 1 Details': entry['Contest 1'],
        'Contest 2 Details': entry['Contest 2'],
        'Contest 3 Details': entry['Contest 3'],
      };
    }
  });

  const columns = [
    'handle',
    'Contest 1',
    'Contest 2',
    'Contest 3',
    'Total',
    'Contest 1 Details',
    'Contest 2 Details',
    'Contest 3 Details',
  ];

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="points.csv"');

  stringify(data, { header: true, columns }).pipe(res);
});

module.exports = router;
