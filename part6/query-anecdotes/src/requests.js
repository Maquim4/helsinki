import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

export const retrieve = () => axios.get(baseUrl).then((res) => res.data);

export const create = (newObj) =>
  axios.post(baseUrl, newObj).then((res) => res.data);

export const vote = (newObj) =>
  axios.put(`${baseUrl}/${newObj.id}`, newObj).then((res) => res.data);
