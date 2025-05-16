import { useState } from 'react';
import './App.css';
import allJobsAndSkillsData from './resources/skills.json'
import Job from './job/Job.js';

function App() {
  const [job, setJob] = useState("Knight");
  const [skillLevels, setSkills] = useState({});

  const onClickJobHandler = (jobName) => {
    return (_ => {
      if (Object.keys(skillLevels).length !== 0) {
        if (window.confirm("Changing job will reset all skills. Continue?")) {
          setSkills({})
          setJob(jobName)
        }
      } else {
        setSkills({})
        setJob(jobName)
      }
    })
  }

  const renderJobs = (data) => {
    if (!data) {
      return null
    } else {
      const listOfJobs = data.jobs.map(jobObject => {
        return (
        <div 
          className="App-jobOption"
          onClick={onClickJobHandler(jobObject.name)}>
            {jobObject.name}
        </div>)
      })
      return <div className="App-jobList">{listOfJobs}</div>
    }
  }

  const getJobDataByName = (jobName, allJobsAndSkillsDataJobs) => {
    return allJobsAndSkillsDataJobs.find((job) => jobName === job.name)
  }

  if (!allJobsAndSkillsData) {
    return <div>Loading static data... Try reloading if it doesn't work.</div>
  }

  return (
    <div className="App">
      {renderJobs (allJobsAndSkillsData)}
      { job ?  <Job data={getJobDataByName(job, allJobsAndSkillsData.jobs)} skillLevels={skillLevels} setSkills={setSkills} /> : null }
    </div>
  );
}

export default App;
