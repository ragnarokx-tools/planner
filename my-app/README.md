# Ragnarok X Tools - Planner

Just a small skill planner for Ragnarok X. Information based off of just scraping the net on the various versions.

This README covers the development details.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Major components

## App
`App.js` presents the entire application. Keeps track of the current state and manages the saving and loading. Also manages the location/routing to make it looks nice

## Job
`job/Job.js` represents the current job, and renders the corresponding skill tree.

## Skill
`skill/Skill.js` represents one skill, and tracks whether it can be increased or decreased based on its dependencies.

# Data sources

## Icons
`src/icons/all_skills_global.png` has a bunch of icons I cribbed off the net and slammed into a sprite sheet. The specifications are 20-across, 100px, and in whatever order I wrote the skill json in.

## Skills
`skill.json` represents all the skills, their prerequisites, and which sprite goes with them. These are all generated from a spreadsheet I filled out and turned into JSON objects.

## Jobs
`jobs.json` is a crude representation of all the jobs and their skill trees as shown in the game. The skill tree is hard-coded to be a 3-column grid with `-2` representing links downward. `-1` is for the job barrier and `-3` is for both a barrier and a line crossing it. Best thing I could come up with while slamming this together.
