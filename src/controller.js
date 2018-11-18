const router = require('express').Router();
const fs = require('fs');
const database = require('../database.json');
const stringify = require('csv-stringify');

router.get('/', (req, res) => {
  const handles = req.query.handles.split(';').map(handle => handle.toLowerCase().trim());
  console.log(handles);
  const data = database
    .filter(entry => handles.indexOf(entry.handle.toLowerCase()) !== -1)
    .map(entry => ({
      handle: entry.handle.toLowerCase(),
      'Contest 1': entry['Contest 1'] ? entry['Contest 1'].points : 0,
      'Contest 2': entry['Contest 2'] ? entry['Contest 2'].points : 0,
      'Contest 3': entry['Contest 3'] ? entry['Contest 3'].points : 0,
      'Contest 4': entry['Contest 4'] ? entry['Contest 4'].points : 0,
      'Contest 1 Details': entry['Contest 1'],
      'Contest 2 Details': entry['Contest 2'],
      'Contest 3 Details': entry['Contest 3'],
      'Contest 4 Details': entry['Contest 4']
    }));

  data.sort((a, b) => handles.indexOf(a.handle) - handles.indexOf(b.handle));

  for (let i = 0; i < handles.length; ++i) {
    if (data.length <= i || data[i].handle !== handles[i]) {
      data.splice(i, 0, {
        handle: handles[i],
        'Contest 1': 0,
        'Contest 2': 0,
        'Contest 3': 0,
        'Contest 4': 0
      });
    }
  }

  const columns = [
    'handle',
    'Contest 1',
    'Contest 2',
    'Contest 3',
    'Contest 4',
    'Contest 1 Details',
    'Contest 2 Details',
    'Contest 3 Details',
    'Contest 4 Details'
  ];
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="points.csv"');
  stringify(data, { header: true, columns }).pipe(res);
});

module.exports = router;
