const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const chalk = require("chalk");
const pdf = require("html-pdf");
const generateHTML = require("./generateHTML");
const filename = "index.html";