import { Rows } from "./types";

export const GET_LEADS = "SELECT * FROM leads";

export const GET_SPECIFIC_LEADS = (params: Rows) => {
  let filterCondition = "";
  const queryParams: string[] = [];

  if (params.email) {
    filterCondition += filterCondition ? " AND " : " WHERE ";
    filterCondition += "email = ? ";
    queryParams.push(params.email);
  }
  if (params.name) {
    filterCondition += filterCondition ? " AND " : " WHERE ";
    filterCondition += "name = ? ";
    queryParams.push(params.name);
  }
  console.log("Filter", filterCondition);
  if (params.mobile) {
    filterCondition += filterCondition ? " AND " : " WHERE ";
    filterCondition += "mobile = ? ";
    queryParams.push(params.email);
  }
  if (params.postcode) {
    filterCondition += filterCondition ? " AND " : " WHERE ";
    filterCondition += "postcode = ? ";
    queryParams.push(params.postcode);
  }
  if (params.services) {
    filterCondition += filterCondition ? " AND " : " WHERE ";
    filterCondition += "services LIKE ? ";
    queryParams.push(`%${params.services}%`);
  }

  return {
    query: GET_LEADS + filterCondition, // base query with condition
    queryParams: queryParams,
  };
};

export const GET_LEAD_BY_ID: string = "SELECT * FROM leads where id = ?";

export const INSERT_LEAD = "INSERT INTO leads (name, email, mobile, postcode, services) VALUES (?, ?, ?, ?, ?)";
