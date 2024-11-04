import { makeAutoObservable } from "mobx";
import searchService from "../services/searchService";

class SearchSkins {
  query = "";
  results = [];

  constructor() {
    makeAutoObservable(this);
  }

  setQuery(newQuery) {
    this.query = newQuery;
    this.search();
  }

  async search() {
    try {
      const results = await searchService.search(this.query);
      this.results = results;
    } catch (error) {
      console.log(error);
    }
  }
}

const searchSkins = new SearchSkins();
export default searchSkins;