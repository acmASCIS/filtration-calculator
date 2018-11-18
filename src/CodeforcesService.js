const axios = require('axios');
const CryptoJS = require('crypto-js');

class CodeforcesService {
  constructor(key, secret) {
    this.key = key;
    this.secret = secret;
    this.baseUrl = 'http://codeforces.com/api';
  }

  async getContestStandings(contestId, showUnofficial = false) {
    const url = this.generateMethodUrl('contest.standings', {
      contestId,
      showUnofficial
    });
    try {
      const submissions = await axios.get(url);
      return submissions.data.result;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  generateMethodUrl(methodName, params) {
    const randomStart = this.generateRandomStart();
    const time = Math.round(Date.now() / 1000);
    const apiSigParamsObject = this.sortObjectKeys({ ...params, apiKey: this.key, time });
    const apiSig = this.generateApiSig(randomStart, methodName, apiSigParamsObject);
    return `${this.baseUrl}/${methodName}?${this.toParamsString(params)}&apiKey=${
      this.key
    }&time=${time}&apiSig=${randomStart}${apiSig}`;
  }

  generateRandomStart() {
    return Math.random()
      .toString(36)
      .substring(2, 8);
  }

  sortObjectKeys(obj) {
    const newObject = {};
    Object.keys(obj)
      .sort()
      .forEach(key => (newObject[key] = obj[key]));
    return newObject;
  }

  generateApiSig(randomStart, methodName, params) {
    return CryptoJS.SHA512(
      `${randomStart}/${methodName}?${this.toParamsString(params)}#${this.secret}`
    ).toString();
  }

  toParamsString(params) {
    return Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
  }
}

module.exports = CodeforcesService;
