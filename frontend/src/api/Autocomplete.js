// SPDX-FileCopyrightText: 2021 Magenta ApS
// SPDX-License-Identifier: MPL-2.0

import Service from "./HttpCommon"
import { get_by_graphql } from "./HttpCommon"

export default {
  _getServiceUrl(entity, query, atDate = null) {
    let params = new URLSearchParams()
    params.append("query", query)

    if (atDate != null) {
      params.append("at", atDate)
    }

    return `/${entity}/autocomplete/?${params}`
  },

  _call(entity, query, atDate = null) {
    return Service.get(this._getServiceUrl(entity, query, atDate))
      .then((response) => {
        return response.data.items
      })
      .catch((error) => {
        console.log(error.response)
      })
  },

  /**
   * Search for an employee in an organisation
   * @param {String} query - search query
   * @returns {Array} - a list of employees matching the query
   */
  employees(query, atDate = null) {
    query = query || ""
    return this._call("e", query, atDate)
  },

  employeesGraphQL(queryString, atDate = null) {
    let query = `query EmployeesSearch($filter: EmployeeFilter) {
      employees(filter: $filter) {
        objects {
          objects {
            uuid
            name
          }
        }
      }
    }`
    let filter = { query: queryString, from_date: atDate }
    return get_by_graphql({ query: query, variables: { filter } })
  },

  /**
   * Search for organisation units within an organisation
   * @param {String} query - search query
   * @returns {Array} - a list of organisation units matching the query
   */
  organisations(query, atDate = null) {
    query = query || ""
    return this._call("ou", query, atDate)
  },
  organisationsGraphQL(queryString, atDate = null) {
    let query = `query OrgUnitsSearch($filter: OrganisationUnitFilter) {
      org_units(filter: $filter) {
        objects {
          objects {
            uuid
            name
          }
        }
      }
    }`
    let filter = { query: queryString, from_date: atDate }
    return get_by_graphql({ query: query, variables: { filter } })
  },
}
