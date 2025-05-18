
import api from '../utils/api';


export const joinsession = (name,sessionid) => api.post(`play/join/${sessionid}`, {name:name});
export const playersessionstatus = (playerid) => api.get(`play/${playerid}/status`);
export const currentQuestionForPlayer = (playerid) => api.get(`play/${playerid}/question`);
export const correctAnswerForCurrentQuestionForPlayer = (playerid) => api.get(`play/${playerid}/answer`);
export const submitAnswerForCurrentQuestionForPlayer = (playerid,answers) => api.put(`play/${playerid}/answer`,{answers:answers});
export const collectResultsForPlayer = (playerid) => api.get(`play/${playerid}/results`);