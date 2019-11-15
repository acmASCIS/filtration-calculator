const fs = require('fs');
const stringify = require('csv-stringify');

const CodeforcesSerivce = require('./CodeforcesService');
const config = require('./config');

const POINTS = [[1, 3, 1, 2, 2 , 3], [2, 3, 1, 1, 3], [1, 1, 4, 2, 1, 3]];
const CONTESTS = ['259043', '259389', '259644'];
const PROBLEMS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

(async function() {
  const cfService = new CodeforcesSerivce(config.CF_KEY, config.CF_SECRET);
  let data = [];

  for (let i = 0; i < CONTESTS.length; ++i) {
    const standings = await cfService.getContestStandings(CONTESTS[i]);
    const rows = standings.rows
      .map(row => ({
        handle: row.party.members[0].handle,
        rank: row.rank,
        problems: row.problemResults
          .map((problem, index) => ({ problem: PROBLEMS[index], points: problem.points }))
          .filter(problem => problem.points > 0)
          .map(problem => problem.problem)
      }))
      .map(entry => {
        entry.points = entry.problems.reduce((sum, problem) => {
          return sum + POINTS[i][problem.charCodeAt(0) - 'A'.charCodeAt(0)];
        }, 0);
        return entry;
      });

    rows.forEach(row => {
      if (data[row.handle] === undefined) data[row.handle] = {};
      data[row.handle][`Contest ${i + 1}`] = {
        points: row.points,
        rank: row.rank,
        problems: row.problems
      };
    });
  }

  for (key of Object.keys(data)) {
    data[data.length] = {
      handle: key,
      ...data[key]
    };
  }

  fs.writeFile('database.json', JSON.stringify(data), err => {
    if (err) throw err;
    console.log('Database created successfully.');
  });
})();
