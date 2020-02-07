const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const chalk = require("chalk");
const pdf = require("html-pdf");
const generateHTML = require("./generateHTML");
const filename = "index.html";
const questions = [

{
    type: "input",
    name: "username",
    message: "Enter your GitHub username:"
  },
  {
    type: "list",
    message: "Select your color of choice:",
    name: "color",
    choices: ["green", "blue", "pink", "red"]
  }
];

const askQuestions = () => {
  return inquirer.prompt(questions);
};

const writeToFile = (filename, data) => {
  fs.writeFile(filename, data, function(err) {
    if (err) console.log(err);
    console.log(chalk.green("File written successfully"));
  });
};

const getGitResponse = data => {
  const queryUrl = `https://api.github.com/users/${data.username}`;
  const starredUrl = `https://api.github.com/users/${data.username}/starred`;
  return axios.all([axios.get(queryUrl), axios.get(starredUrl)]);
};

const convertToPDF = page => {
  const options = {
    format: "letter"
  };
  pdf.create(page, options).toFile("./profile.pdf", function(err, res) {
    if (err) return console.log(chalk.yellow(`Something went wrong ${err}`));
    console.log(chalk.green(`Profile PDF written`));
  });
};

async function init() {
  try {
    const data = await askQuestions();
    const responseArr = await getGitResponse(data);
    const page = generateHTML(data, responseArr);
    writeToFile(filename, page);
    convertToPDF(page);
  } catch (error) {
    console.log(chalk.inverse.yellow(`There was a problem ${error}`));
  }
}

init();
