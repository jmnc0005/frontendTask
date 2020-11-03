<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-form v-model="valid" ref="form">
          <v-container>
            <v-row>
              <v-col cols="12" md="5">
                <v-text-field
                  type="number"
                  v-model="code"
                  :rules="codeRules"
                  :counter="8"
                  label="Code"
                  required
                />
              </v-col>

              <v-col cols="12" md="5">
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  :counter="100"
                  label="Name"
                  required
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-btn
                  color="primary"
                  :disabled="!valid"
                  class="mr-4"
                  @click="submit"
                >
                  submit
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
        <v-progress-circular
          v-if="this.loading"
          :size="100"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <Expansible
          :level="0"
          v-if="!this.loading"
          :collection="this.segments"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import {
  checkClass,
  checkCommodity,
  checkFamily,
  checkSegment,
} from "../helpers/filters.js";
import { DataElement } from "../models/DataElement";
import Expansible from "./Expansible";

export default {
  name: "HelloWorld",
  components: {
    Expansible,
  },

  data: () => ({
    valid: false,
    segments: new Map(),
    loading: true,
    code: "",
    name: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length >= 10 || "Name must be bigger than 10 characters",
      (v) => v.length <= 100 || "Name must be less than 100 characters",
    ],
    codeRules: [
      (v) => !!v || "Code is required",
      (v) => v.length == 8 || "Code must be 8 characters",
    ],
  }),
  async created() {
    const inputData = await this.getData();
    this.setSegments(inputData);
    this.setFamilies(inputData);
    this.setClasses(inputData);
    this.setCommodities(inputData);
    this.loading = false;
  },
  methods: {
    async getData() {
      const data = await axios.get(
        "https://gist.githubusercontent.com/jakobt/8b44844ae0101949d7117a37f2d44161/raw/452dc8193f3279b36c7aa78f0c6d15b8114e3800/flatlist.json"
      );
      return data.data;
    },
    setSegments(data) {
      const segments = data.filter(checkSegment);
      segments.forEach((element) => {
        const dataElement = new DataElement(element);
        this.segments.set(element.code, dataElement);
        const mapSorted = new Map([...this.segments.entries()].sort());
        this.segments = mapSorted;
      });
    },
    setFamilies(data) {
      const families = data.filter(checkFamily);
      families.forEach((element) => {
        const dataElement = new DataElement(element);
        var map = this.getSegment(element).content;
        map.set(element.code, dataElement);
        const mapSorted = new Map([...map.entries()].sort());
        map = mapSorted;
      });
    },
    setClasses(data) {
      const classes = data.filter(checkClass);
      classes.forEach((element) => {
        const dataElement = new DataElement(element);
        var map = this.getFamily(element).content;
        map.set(element.code, dataElement);
        const mapSorted = new Map([...map.entries()].sort());
        map = mapSorted;
      });
    },
    setCommodities(data) {
      this.commodities = data.filter(checkCommodity);
      const commodities = data.filter(checkCommodity);
      commodities.forEach((element) => {
        const dataElement = new DataElement(element);
        var map = this.getClass(element).content;
        map.set(element.code, dataElement);
        const mapSorted = new Map([...map.entries()].sort());
        map = mapSorted;
      });
    },
    getSegment(element) {
      return this.segments.get(element.code - (element.code % 1000000));
    },
    getFamily(element) {
      const segment = this.getSegment(element);
      return segment.content.get(element.code - (element.code % 10000));
    },
    getClass(element) {
      const family = this.getFamily(element);
      const classs = family.content.get(element.code - (element.code % 100));
      return classs;
    },
    addSegment(dataElement) {
      let segmentMap = this.getSegment(dataElement);
      if (segmentMap === undefined) {
        if (dataElement.code % 1000000 === 0) {
          this.segments.set(dataElement.code, dataElement);
          const mapSorted = new Map([...this.segments.entries()].sort());
          this.segments = mapSorted;
          this.loading = false;
          alert("Added segment: \n" + this.code + " - " + this.name);
        } else {
          const code = parseInt(this.code - (this.code % 1000000));
          const element = { code: code, name: "segment for " + this.name };
          const dataElement = new DataElement(element);
          this.segments.set(dataElement.code, dataElement);
          const mapSorted = new Map([...this.segments.entries()].sort());
          this.segments = mapSorted;
          segmentMap = this.getSegment(dataElement);
          alert("Added segment: \n" + code + " - " + this.name);
        }
      }
      return segmentMap;
    },
    addFamily(dataElement, segmentMap) {
      let familyMap = this.getFamily(dataElement);
      if (familyMap === undefined) {
        if (dataElement.code % 10000 === 0) {
          segmentMap.content.set(dataElement.code, dataElement);
          const mapSorted = new Map([...segmentMap.content.entries()].sort());
          this.segmentMap = mapSorted;
          this.loading = false;
          alert("Added family: \n" + this.code + " - " + this.name);
        } else {
          const code = parseInt(this.code - (this.code % 10000));
          const element = { code: code, name: "family for " + this.name };
          const dataElement = new DataElement(element);
          segmentMap.content.set(dataElement.code, dataElement);
          const mapSorted = new Map([...segmentMap.content.entries()].sort());
          segmentMap = mapSorted;
          familyMap = this.getFamily(dataElement);
          alert("Added family: \n" + code + " - " + this.name);
        }
      }
      return familyMap;
    },
    addClass(dataElement, familyMap) {
      let classMap = this.getClass(dataElement);
      if (classMap === undefined) {
        if (dataElement.code % 100 === 0) {
          familyMap.content.set(dataElement.code, dataElement);
          const mapSorted = new Map([...familyMap.content.entries()].sort());
          this.familyMap = mapSorted;
          this.loading = false;
          alert("Added class: \n" + this.code + " - " + this.name);
        } else {
          const code = parseInt(this.code - (this.code % 100));
          const element = { code: code, name: "class for " + this.name };
          const dataElement = new DataElement(element);
          familyMap.content.set(dataElement.code, dataElement);
          const mapSorted = new Map([...familyMap.content.entries()].sort());
          familyMap = mapSorted;
          classMap = this.getClass(dataElement);
          alert("Added class: \n" + code + " - " + this.name);
        }
      }
      return classMap;
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        const element = { code: parseInt(this.code), name: this.name };
        const dataElement = new DataElement(element);
        let segmentMap = this.addSegment(dataElement);
        let familyMap = this.addFamily(dataElement, segmentMap);
        let classMap = this.addClass(dataElement, familyMap);
        if (dataElement.code % 100 !== 0) {
          classMap.content.set(dataElement.code, dataElement);
          const mapSorted = new Map([...classMap.content.entries()].sort());
          classMap = mapSorted;
          alert("Added commodity: \n" + this.code + " - " + this.name);
        }
      this.loading = false;
      }
    },
  },
  computed: {},
};
</script>
